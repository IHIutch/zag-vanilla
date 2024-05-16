import * as accordion from '@zag-js/accordion';
import { nanoid } from 'nanoid';
import invariant from 'tiny-invariant';
import { attrs, normalizeProps } from './utils';

const ACCORDION_ROOT_SELECTOR = '[data-part="accordion-root"]';
const ACCORDION_ITEM_SELECTOR = '[data-part="accordion-item"]';
const ACCORDION_TRIGGER_SELECTOR = '[data-part="accordion-trigger"]';
const ACCORDION_CONTENT_SELECTOR = '[data-part="accordion-content"]';

function init(accordionRootEl: HTMLElement) {
  const accordionItems = Array.from(
    accordionRootEl.querySelectorAll<HTMLElement>(ACCORDION_ITEM_SELECTOR)
  );

  const service = accordion.machine({
    id: nanoid(),
    multiple: accordionRootEl.hasAttribute('data-multiple'),
    collapsible: true,
  });

  accordionItems.forEach((itemEl) => {
    const itemId = nanoid();

    const accordionTriggerEl = itemEl.querySelector<HTMLButtonElement>(
      ACCORDION_TRIGGER_SELECTOR
    );
    const accordionContentEl = itemEl.querySelector<HTMLElement>(
      ACCORDION_CONTENT_SELECTOR
    );

    let prev: () => void;
    function render(api: accordion.Api) {
      invariant(accordionTriggerEl, `Cannot find trigger element with attribute: ${ACCORDION_TRIGGER_SELECTOR}`);
      invariant(accordionContentEl, `Cannot find content element with attribute: ${ACCORDION_CONTENT_SELECTOR}`);

      if (prev) prev();
      let cleanups = [
        attrs(itemEl, api.getItemProps({ value: itemId })),
        attrs(accordionTriggerEl, api.getItemTriggerProps({ value: itemId })),
        attrs(accordionContentEl, api.getItemContentProps({ value: itemId })),
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
  ).forEach(init);
}
