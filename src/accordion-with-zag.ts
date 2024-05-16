import * as accordion from '@zag-js/accordion';
import { createNormalizer } from '@zag-js/types';
import { nanoid } from 'nanoid';
import invariant from 'tiny-invariant';

const ACCORDION_ROOT_SELECTOR = '[data-part="accordion-root"]';
const ACCORDION_ITEM_SELECTOR = '[data-part="accordion-item"]';
const ACCORDION_TRIGGER_SELECTOR = '[data-part="accordion-trigger"]';
const ACCORDION_CONTENT_SELECTOR = '[data-part="accordion-content"]';

interface AttrMap {
  [key: string]: string;
}

interface Attrs {
  [key: string]: any; // Change 'any' to the specific type you want to allow for attributes
}

const propMap: AttrMap = {
  Focus: 'Focusin',
  Blur: 'Focusout',
  Change: 'Input',
  DoubleClick: 'Dblclick',
  htmlFor: 'for',
  className: 'class',
  defaultValue: 'value',
  defaultChecked: 'checked',
};

export function attrs(node: HTMLElement, attrs: Attrs): () => void {
  const attrKeys = Object.keys(attrs);

  const addEvt = (e: string, f: EventListener) => {
    e = propMap[e] ?? e;
    node.addEventListener(e.toLowerCase(), f);
  };

  const remEvt = (e: string, f: EventListener) => {
    e = propMap[e] ?? e;
    node.removeEventListener(e.toLowerCase(), f);
  };

  const onEvents = (attr: string) => attr.startsWith('on');
  const others = (attr: string) => !attr.startsWith('on');

  const setup = (attr: string) => addEvt(attr.substring(2), attrs[attr]);
  const teardown = (attr: string) => remEvt(attr.substring(2), attrs[attr]);

  const apply = (attrName: string) => {
    let value = attrs[attrName];

    if (typeof value === 'boolean') {
      value = value || undefined;
    }

    if (value != null) {
      if (['value', 'checked', 'htmlFor'].includes(attrName)) {
        (node as any)[attrName] = value; // Using 'any' here because TypeScript can't narrow the type based on the array check
      } else {
        node.setAttribute(attrName.toLowerCase(), value);
      }
      return;
    }

    node.removeAttribute(attrName.toLowerCase());
  };

  attrKeys.filter(onEvents).forEach(setup);
  attrKeys.filter(others).forEach(apply);

  return function cleanup() {
    attrKeys.filter(onEvents).forEach(teardown);
  };
}

const toStyleString = (style: any) => {
  let string = '';
  for (let key in style) {
    const value = style[key];
    if (value === null || value === undefined) continue;
    if (!key.startsWith('--'))
      key = key.replace(/[A-Z]/g, (match) => `-${match.toLowerCase()}`);
    string += `${key}:${value};`;
  }
  return string;
};

const normalizeProps = createNormalizer((props: any) => {
  return Object.entries(props).reduce<any>((acc, [key, value]) => {
    if (value === undefined) return acc;

    if (key in propMap) {
      key = propMap[key];
    }

    if (key === 'style' && typeof value === 'object') {
      acc.style = toStyleString(value);
      return acc;
    }

    acc[key.toLowerCase()] = value;

    return acc;
  }, {});
});

function init(rootEl: HTMLElement) {
  const accordionItems = Array.from(
    rootEl.querySelectorAll<HTMLElement>(ACCORDION_ITEM_SELECTOR)
  );

  const service = accordion.machine({
    id: nanoid(),
    multiple: rootEl.hasAttribute('data-multiple'),
    collapsible: true,
  });

  Array.from(accordionItems).forEach((itemEl) => {
    const itemId = nanoid();

    const triggerEl = itemEl.querySelector<HTMLButtonElement>(
      ACCORDION_TRIGGER_SELECTOR
    );
    const contentEl = itemEl.querySelector<HTMLElement>(
      ACCORDION_CONTENT_SELECTOR
    );

    let prev: () => void;
    function render(api: accordion.Api) {
      invariant(
        triggerEl instanceof HTMLButtonElement,
        'Expected triggerEl to be defined'
      );
      invariant(
        contentEl instanceof HTMLElement,
        'Expected contentEl to be defined'
      );

      if (prev) prev();
      let cleanups = [
        attrs(itemEl, api.getItemProps({ value: itemId })),
        attrs(triggerEl, api.getItemTriggerProps({ value: itemId })),
        attrs(contentEl, api.getItemContentProps({ value: itemId })),
      ];
      prev = () => {
        cleanups.forEach((fn) => fn());
      };
    }

    service.subscribe(() => {
      const api = accordion.connect(
        service.state,
        service.send,
        normalizeProps
      );
      render(api);
    });
  });

  service.start();
}

export function accordionZag() {
  Array.from(
    document.querySelectorAll<HTMLElement>(ACCORDION_ROOT_SELECTOR)
  ).forEach((rootEl) => {
    init(rootEl);
  });
}
