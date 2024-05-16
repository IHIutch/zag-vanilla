import { bindAll } from 'bind-event-listener';
import { createStore } from '@xstate/store';
import invariant from 'tiny-invariant';
import { nanoid } from 'nanoid';


const ACCORDION_ROOT_SELECTOR = '[data-part="accordion-root"]'
const ACCORDION_ITEM_SELECTOR = '[data-part="accordion-item"]'
const ACCORDION_TRIGGER_SELECTOR = '[data-part="accordion-trigger"]'
const ACCORDION_CONTENT_SELECTOR = '[data-part="accordion-content"]'

const initStore = createStore(
  // Initial context
  {
    id: 'David',
    value: new Array(),
    multiple: false,
  },
  // Transitions
  {
    init: (_context, event: { multiple: boolean }) => ({
      multiple: event.multiple
    }),
    add: {
      value: (context, event: { id: string }) =>
        context.multiple ? [...context.value, event.id] : [event.id],
    },
    remove: {
      value: (context, event: { id: string }) =>
        context.value.filter((v: string) => v !== event.id),
    },
  }
);


function initializeAccordion(rootEl: HTMLElement, store: typeof initStore) {
  const ACCORDION_ITEMS = rootEl.querySelectorAll<HTMLElement>(
    ACCORDION_ITEM_SELECTOR
  );

  ACCORDION_ITEMS.forEach((itemEl) => {
    const id = nanoid()

    const ACCORDION_TRIGGER = itemEl.querySelector<HTMLButtonElement>(
      ACCORDION_TRIGGER_SELECTOR
    );
    const ACCORDION_CONTENT = itemEl.querySelector<HTMLElement>(
      ACCORDION_CONTENT_SELECTOR
    );

    invariant(ACCORDION_TRIGGER instanceof HTMLButtonElement, 'Expected ACCORDION_TRIGGER to be defined');
    invariant(ACCORDION_CONTENT instanceof HTMLElement, 'Expected ACCORDION_CONTENT to be defined');

    ACCORDION_TRIGGER.setAttribute('id', `accordion-trigger::${id}`)
    ACCORDION_CONTENT.setAttribute('id', `accordion-content::${id}`)

    // Subscribe to snapshot changes
    store.subscribe((snapshot) => {
      console.log({ snapshot })
      if (snapshot.context.value.includes(id)) {
        ACCORDION_TRIGGER.setAttribute('aria-expanded', 'true')

        ACCORDION_CONTENT.removeAttribute('hidden')
      } else {
        ACCORDION_TRIGGER.removeAttribute('aria-expanded')

        ACCORDION_CONTENT.setAttribute('hidden', 'until-found')
      }
    });

    bindAll(ACCORDION_TRIGGER, [
      {
        type: 'click',
        listener: () => store.getSnapshot().context.value.includes(id)
          ? store.send({ type: 'remove', id })
          : store.send({ type: 'add', id })
      },
    ]);

    store.send({ type: 'init', multiple: rootEl.hasAttribute('data-multiple') })
  });
}

export function accordion() {
  const ACCORDION_ROOTS = document.querySelectorAll<HTMLElement>(
    ACCORDION_ROOT_SELECTOR
  );

  ACCORDION_ROOTS.forEach((rootEl) => {
    const rootId = nanoid()
    rootEl.setAttribute('id', `accordion-root::${rootId}`)

    initializeAccordion(rootEl, initStore)
  });
}