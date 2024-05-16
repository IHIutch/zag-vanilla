import * as accordion from '@zag-js/accordion';
import { nanoid } from 'nanoid';
import invariant from 'tiny-invariant';
import { attrs, normalizeProps } from './utils';

const ACCORDION_ROOT_SELECTOR = '[data-part="accordion-root"]';
const ACCORDION_ITEM_SELECTOR = '[data-part="accordion-item"]';
const ACCORDION_TRIGGER_SELECTOR = '[data-part="accordion-trigger"]';
const ACCORDION_CONTENT_SELECTOR = '[data-part="accordion-content"]';

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

export function initAccordion() {
  Array.from(
    document.querySelectorAll<HTMLElement>(ACCORDION_ROOT_SELECTOR)
  ).forEach((rootEl) => {
    init(rootEl);
  });
}
