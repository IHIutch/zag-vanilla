import * as accordion from "@zag-js/accordion"
import { createNormalizer } from "@zag-js/types"
import { bindAll } from "bind-event-listener"


import { nanoid } from "nanoid"
import invariant from "tiny-invariant"


const ACCORDION_ROOT_SELECTOR = '[data-part="accordion-root"]'
const ACCORDION_ITEM_SELECTOR = '[data-part="accordion-item"]'
const ACCORDION_TRIGGER_SELECTOR = '[data-part="accordion-trigger"]'
const ACCORDION_CONTENT_SELECTOR = '[data-part="accordion-content"]'

interface AttrMap {
  [key: string]: string;
}

interface Attrs {
  [key: string]: any; // Change 'any' to the specific type you want to allow for attributes
}

const map: AttrMap = {
  Focus: "Focusin",
  Blur: "Focusout",
  Change: "Input",
  DoubleClick: "Dblclick",
  htmlFor: "for",
  className: "class",
  defaultValue: "value",
  defaultChecked: "checked",
};

export function attrs(node: HTMLElement, attrs: Attrs): () => void {
  const attrKeys = Object.keys(attrs);

  const addEvt = (e: string, f: EventListener) => {
    e = map[e] ?? e;
    node.addEventListener(e.toLowerCase(), f);
  };

  const remEvt = (e: string, f: EventListener) => {
    e = map[e] ?? e;
    node.removeEventListener(e.toLowerCase(), f);
  };

  const onEvents = (attr: string) => attr.startsWith("on");
  const others = (attr: string) => !attr.startsWith("on");

  const setup = (attr: string) => addEvt(attr.substring(2), attrs[attr]);
  const teardown = (attr: string) => remEvt(attr.substring(2), attrs[attr]);

  const apply = (attrName: string) => {
    let value = attrs[attrName];

    if (typeof value === "boolean") {
      value = value || undefined;
    }

    if (value != null) {
      if (["value", "checked", "htmlFor"].includes(attrName)) {
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



const propMap: any = {
  htmlFor: "for",
  className: "class",
  onDoubleClick: "onDblclick",
  // onChange: "onInput",
  // onFocus: "onFocusin",
  // onBlur: "onFocusout",
  defaultValue: "value",
  defaultChecked: "checked",
}

const toStyleString = (style: any) => {
  let string = ""
  for (let key in style) {
    const value = style[key]
    if (value === null || value === undefined) continue
    if (!key.startsWith("--")) key = key.replace(/[A-Z]/g, (match) => `-${match.toLowerCase()}`)
    string += `${key}:${value};`
  }
  return string
}


const normalizeProps = createNormalizer((props: any) => {

  return Object.entries(props).reduce<any>((acc, [key, value]) => {
    if (value === undefined) return acc

    if (key in propMap) {
      key = propMap[key]
    }

    if (key === "style" && typeof value === "object") {
      acc.style = toStyleString(value)
      return acc
    }

    acc[key.toLowerCase()] = value

    return acc
  }, {})
})


function initializeAccordion(ACCORDION_ROOT: HTMLElement) {

  const getApi = () => accordion.connect(service.state, service.send, normalizeProps)

  const accordionItems = Array.from(ACCORDION_ROOT.querySelectorAll<HTMLElement>(
    ACCORDION_ITEM_SELECTOR
  ))

  const service = accordion.machine({
    id: nanoid(),
    multiple: ACCORDION_ROOT.hasAttribute('data-multiple'),
    collapsible: true
  })

  attrs(ACCORDION_ROOT, getApi().rootProps)

  Array.from(accordionItems).forEach((ACCORDION_ITEM) => {
    const itemId = nanoid()

    const ACCORDION_TRIGGER = ACCORDION_ITEM.querySelector<HTMLButtonElement>(
      ACCORDION_TRIGGER_SELECTOR
    );
    const ACCORDION_CONTENT = ACCORDION_ITEM.querySelector<HTMLElement>(
      ACCORDION_CONTENT_SELECTOR
    );

    invariant(ACCORDION_TRIGGER instanceof HTMLButtonElement, 'Expected ACCORDION_TRIGGER to be defined');
    invariant(ACCORDION_CONTENT instanceof HTMLElement, 'Expected ACCORDION_CONTENT to be defined');

    const { onclick, onfocus, onblur, onkeydown } = getApi().getItemTriggerProps({ value: itemId })

    bindAll(ACCORDION_TRIGGER, [
      {
        type: 'click',
        listener: onclick
      },
      {
        type: 'focusin',
        listener: onfocus
      },
      {
        type: 'focusout',
        listener: onblur
      },
      {
        type: 'keydown',
        listener: onkeydown
      }
    ])


    service.subscribe(() => {
      const { onclick, onfocus, onblur, onkeydown, ...triggerProps } = getApi().getItemTriggerProps({ value: itemId })
      const itemProps = getApi().getItemProps({ value: itemId })
      const contentProps = getApi().getItemContentProps({ value: itemId })

      attrs(ACCORDION_ITEM, itemProps)
      attrs(ACCORDION_TRIGGER, triggerProps)
      attrs(ACCORDION_CONTENT, contentProps)
    })
  })

  service.start()

}

export function accordionZag() {
  Array.from(document.querySelectorAll<HTMLElement>(
    ACCORDION_ROOT_SELECTOR
  )).forEach((rootEl) => {
    initializeAccordion(rootEl)
  });
}