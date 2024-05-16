import { bindAll } from 'bind-event-listener';
import invariant from 'tiny-invariant';
import { nanoid } from 'nanoid';
import { assign, createActor, not, setup } from 'xstate';
import { EventKeyMap } from '../types'
import { ContentAttributes, ContentId, ItemAttributes, ItemId, MachineId, MachineItemId, RootAttributes, RootId, TriggerAttributes, TriggerId } from './accordion-types';


const ACCORDION_ROOT_SELECTOR = '[data-part="accordion-root"]'
const ACCORDION_ITEM_SELECTOR = '[data-part="accordion-item"]'
const ACCORDION_TRIGGER_SELECTOR = '[data-part="accordion-trigger"]'
const ACCORDION_CONTENT_SELECTOR = '[data-part="accordion-content"]'


function setAttrs<T>(
  element: HTMLElement,
  attributes: Partial<T>
) {
  for (const key in attributes) {
    if (attributes[key]) {
      element.setAttribute(key, String(attributes[key]));
    } else {
      element.removeAttribute(key)
    }
  }
}



type Root = Document | Element | null | undefined

export const isDocument = (el: any): el is Document => el.nodeType === Node.DOCUMENT_NODE

export const isWindow = (el: any): el is Window => el != null && el === el.window

export function getDocument(el: Element | Window | Node | Document | null) {
  if (isDocument(el)) return el
  if (isWindow(el)) return el.document
  return el?.ownerDocument ?? document
}

export function queryAll<T extends Element = HTMLElement>(root: Root, selector: string) {
  return Array.from(root?.querySelectorAll<T>(selector) ?? [])
}

export const first = <T>(v: T[]): T | undefined => v[0]

export const last = <T>(v: T[]): T | undefined => v[v.length - 1]

export interface ScopeContext {
  getRootNode?(): Document | Node
}

export function createScope<T>(methods: T) {
  const screen = {
    getRootNode: (ctx: ScopeContext) => (ctx.getRootNode?.() ?? document) as Document,
    getDoc: (ctx: ScopeContext) => getDocument(screen.getRootNode(ctx)),
    getWin: (ctx: ScopeContext) => screen.getDoc(ctx).defaultView ?? window,
    getActiveElement: (ctx: ScopeContext) => screen.getDoc(ctx).activeElement as HTMLElement | null,
    isActiveElement: (ctx: ScopeContext, elem: HTMLElement | null) => elem === screen.getActiveElement(ctx),
    getById: <T extends HTMLElement = HTMLElement>(ctx: ScopeContext, id: string) =>
      screen.getRootNode(ctx).getElementById(id) as T | null,
    setValue: <T extends { value: string }>(elem: T | null, value: string | number | null | undefined) => {
      if (elem == null || value == null) return
      const valueAsString = value.toString()
      if (elem.value === valueAsString) return
      elem.value = value.toString()
    },
  }

  return { ...screen, ...methods }
}

export type ItemToId<T> = (v: T) => string

export const defaultItemToId = <T extends HTMLElement>(v: T) => v.id

export function itemById<T extends HTMLElement>(v: T[], id: string, itemToId: ItemToId<T> = defaultItemToId) {
  return v.find((item) => itemToId(item) === id)
}

export function indexOfId<T extends HTMLElement>(v: T[], id: string, itemToId: ItemToId<T> = defaultItemToId) {
  const item = itemById(v, id, itemToId)
  return item ? v.indexOf(item) : -1
}

export function nextById<T extends HTMLElement>(v: T[], id: string, loop = true) {
  let idx = indexOfId(v, id)
  idx = loop ? (idx + 1) % v.length : Math.min(idx + 1, v.length - 1)
  return v[idx]
}

export function prevById<T extends HTMLElement>(v: T[], id: string, loop = true) {
  let idx = indexOfId(v, id)
  if (idx === -1) return loop ? v[v.length - 1] : null
  idx = loop ? (idx - 1 + v.length) % v.length : Math.max(0, idx - 1)
  return v[idx]
}

export const dom = createScope({
  getRootId: (machineId: MachineId) => `accordion:${machineId}` as RootId,
  getItemId: (machineId: MachineId, machineItemId: MachineItemId) => `accordion:${machineId}:item:${machineItemId}` as ItemId,
  getItemContentId: (machineId: MachineId, machineItemId: MachineItemId) => `accordion:${machineId}:content:${machineItemId}` as ContentId,
  getItemTriggerId: (machineId: MachineId, machineItemId: MachineItemId) => `accordion:${machineId}:trigger:${machineItemId}` as TriggerId,

  getRootEl: (machineId: MachineId) => document.getElementById(dom.getRootId(machineId)),
  getTriggerEls: (machineId: MachineId) => {
    const selector = `${ACCORDION_TRIGGER_SELECTOR}:not([disabled])`
    return queryAll(dom.getRootEl(machineId), selector)
  },

  getFirstTriggerEl: (machineId: MachineId) => first(dom.getTriggerEls(machineId)),
  getLastTriggerEl: (machineId: MachineId) => last(dom.getTriggerEls(machineId)),
  getNextTriggerEl: (machineId: MachineId, machineItemId: MachineItemId) => nextById(dom.getTriggerEls(machineId), dom.getItemTriggerId(machineId, machineItemId)),
  getPrevTriggerEl: (machineId: MachineId, machineItemId: MachineItemId) => prevById(dom.getTriggerEls(machineId), dom.getItemTriggerId(machineId, machineItemId)),
})

const machineSetup = setup({
  types: {
    input: {} as {
      multiple: boolean
    },
    context: {} as {
      id: MachineId,
      value: Array<string>;
      multiple: boolean;
      focusedValue: MachineItemId | null;
    },
    events: {} as
      | { type: "GOTO.NEXT" }
      | { type: "GOTO.PREV" }
      | { type: "GOTO.LAST" }
      | { type: "GOTO.FIRST" }
      | { type: "TRIGGER.BLUR" }
      | { type: "TRIGGER.CLICK", machineItemId: MachineItemId }
      | { type: "TRIGGER.FOCUS", machineItemId: MachineItemId },
  },
  actions: {
    collapse: assign({
      value: ({ context }, params: { machineItemId: MachineItemId }) =>
        context.value.filter((v) => v !== params.machineItemId)
    }),
    expand: assign({
      value: ({ context }, params: { machineItemId: MachineItemId }) =>
        context.multiple ? [...context.value, params.machineItemId] : [params.machineItemId]
    }),
    setValue: assign({
      value: ({ context }, params: { machineItemId: MachineItemId }) =>
        context.multiple ? [...context.value, params.machineItemId] : [params.machineItemId],
    }),
    setFocusedValue: assign({
      focusedValue: (_, params: { machineItemId: MachineItemId }) => params.machineItemId
    }),
    clearFocusedValue: assign({
      focusedValue: () => null
    }),
    focusFirstTrigger({ context }) {
      dom.getFirstTriggerEl(context.id)?.focus()
    },
    focusLastTrigger({ context }) {
      dom.getLastTriggerEl(context.id)?.focus()
    },
    focusNextTrigger({ context }) {
      if (!context.focusedValue) return
      const triggerEl = dom.getNextTriggerEl(context.id, context.focusedValue)
      triggerEl?.focus()
    },
    focusPrevTrigger({ context }) {
      if (!context.focusedValue) return
      const triggerEl = dom.getPrevTriggerEl(context.id, context.focusedValue)
      triggerEl?.focus()
    },
  },
  guards: {
    isExpanded: ({ context }, params: { machineItemId: MachineItemId }) => context.value.includes(params.machineItemId),
    isNotExpanded: ({ context }, params: { machineItemId: MachineItemId }) => !context.value.includes(params.machineItemId)
  },
}).createMachine({
  initial: 'idle',
  context: ({ input }) => ({
    id: nanoid() as MachineId,
    value: [],
    multiple: input.multiple || false,
    focusedValue: null
  }),
  states: {
    idle: {
      on: {
        "TRIGGER.FOCUS": {
          target: 'focused',
          actions: {
            type: 'setFocusedValue',
            params: ({ event }) => ({
              machineItemId: event.machineItemId
            }),
          }
        }
      }
    },
    focused: {
      on: {
        "GOTO.NEXT": {
          actions: "focusNextTrigger"
        },
        "GOTO.PREV": {
          actions: "focusPrevTrigger"
        },
        "GOTO.FIRST": {
          actions: "focusFirstTrigger",
        },
        "GOTO.LAST": {
          actions: "focusLastTrigger",
        },
        'TRIGGER.CLICK': [
          {
            guard: {
              type: 'isExpanded',
              params: ({ event }) => ({
                machineItemId: event.machineItemId
              }),

            },
            actions: {
              type: 'collapse',
              params: ({ event }) => ({
                machineItemId: event.machineItemId
              })
            }
          }, {
            guard: not({
              type: 'isExpanded',
              params: ({ event }) => ({
                machineItemId: event.machineItemId
              }),
            }),
            actions: {
              type: 'expand',
              params: ({ event }) => ({
                machineItemId: event.machineItemId
              })
            }
          }
        ],
        "TRIGGER.BLUR": {
          target: "idle",
          actions: "clearFocusedValue",
        },
      }
    }
  },
})

function initializeAccordion(ACCORDION_ROOT: HTMLElement) {

  const actor = createActor(machineSetup, {
    input: {
      multiple: ACCORDION_ROOT.hasAttribute('data-multiple')
    }
  });
  const context = actor.getSnapshot().context
  const rootId = dom.getRootId(context.id)

  setAttrs<RootAttributes>(ACCORDION_ROOT, {
    id: rootId
  })

  Array.from(ACCORDION_ROOT.querySelectorAll<HTMLElement>(
    ACCORDION_ITEM_SELECTOR
  )).forEach((ACCORDION_ITEM) => {
    const machineItemId = nanoid() as MachineItemId

    const ACCORDION_TRIGGER = ACCORDION_ITEM.querySelector<HTMLButtonElement>(
      ACCORDION_TRIGGER_SELECTOR
    );
    const ACCORDION_CONTENT = ACCORDION_ITEM.querySelector<HTMLElement>(
      ACCORDION_CONTENT_SELECTOR
    );

    invariant(ACCORDION_TRIGGER instanceof HTMLButtonElement, 'Expected ACCORDION_TRIGGER to be defined');
    invariant(ACCORDION_CONTENT instanceof HTMLElement, 'Expected ACCORDION_CONTENT to be defined');

    setAttrs<ItemAttributes>(ACCORDION_ITEM, {
      'id': dom.getItemId(context.id, machineItemId),
    })

    setAttrs<TriggerAttributes>(ACCORDION_TRIGGER, {
      'id': dom.getItemTriggerId(context.id, machineItemId),
      'data-ownedby': rootId
    })

    setAttrs<ContentAttributes>(ACCORDION_CONTENT, {
      id: dom.getItemContentId(context.id, machineItemId),
      "aria-labelledby": dom.getItemTriggerId(context.id, machineItemId)
    })

    actor.subscribe((snapshot) => {
      const isOpen = snapshot.context.value.includes(machineItemId)

      setAttrs<ItemAttributes>(ACCORDION_ITEM, {
        'data-state': isOpen ? 'open' : 'closed'
      })

      setAttrs<TriggerAttributes>(ACCORDION_TRIGGER, {
        'aria-expanded': isOpen ? 'true' : 'false',
        'data-state': isOpen ? 'open' : 'closed'
      })

      setAttrs<ContentAttributes>(ACCORDION_CONTENT, {
        hidden: isOpen ? false : 'until-found',
        'data-state': isOpen ? 'open' : 'closed'
      })

    });

    bindAll(ACCORDION_TRIGGER, [
      {
        type: 'click',
        listener: () => {
          actor.send({ type: 'TRIGGER.CLICK', machineItemId })
        }
      },
      {
        type: 'focus',
        listener: () => {
          actor.send({ type: 'TRIGGER.FOCUS', machineItemId })
        }
      },
      {
        type: 'blur',
        listener: () => {
          actor.send({ type: 'TRIGGER.BLUR' })
        }
      },
      {
        type: 'keydown',
        listener: (event) => {
          const keyMap: EventKeyMap = {
            ArrowDown() {
              actor.send({ type: "GOTO.NEXT" })
            },
            ArrowUp() {
              actor.send({ type: "GOTO.PREV" })
            },
            ArrowRight() {
              actor.send({ type: "GOTO.NEXT" })
            },
            ArrowLeft() {
              actor.send({ type: "GOTO.PREV" })
            },
            Home() {
              actor.send({ type: "GOTO.FIRST" })
            },
            End() {
              actor.send({ type: "GOTO.LAST" })
            },
          }

          const exec = keyMap[event.key]
          if (exec) {
            exec(event)
            event.preventDefault()
          }
        }
      }
    ]);
  });

  actor.start()
}

export function accordionMachine() {
  Array.from(document.querySelectorAll<HTMLElement>(
    ACCORDION_ROOT_SELECTOR
  )).forEach((rootEl) => {
    initializeAccordion(rootEl)
  });
}