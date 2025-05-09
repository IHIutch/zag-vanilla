import * as combobox from '@zag-js/combobox'
import { query, queryAll } from '@zag-js/dom-query'
import { nanoid } from 'nanoid'
import { Component } from '../utils/component'
import { VanillaMachine } from '../utils/machine'
import { normalizeProps } from '../utils/normalize-props'
import { spreadProps } from '../utils/spread-props'

const COMBOBOX_ROOT_SELECTOR = '[data-part="combobox-root"]'
const COMBOBOX_TRIGGER_SELECTOR = '[data-part="combobox-trigger"]'
const COMBOBOX_INPUT_SELECTOR = '[data-part="combobox-input"]'
const COMBOBOX_LABEL_SELECTOR = '[data-part="combobox-label"]'
const COMBOBOX_CONTENT_SELECTOR = '[data-part="combobox-content"]'
const COMBOBOX_ITEM_SELECTOR = '[data-part="combobox-item"]'

export class ZagCombobox extends Component<combobox.Props, combobox.Api> {
  static instances: Map<string, ZagCombobox> = new Map()

  static getInstance(id: string) {
    return ZagCombobox.instances.get(id)
  }

  initMachine(context: combobox.Props) {
    ZagCombobox.instances.set(context.id, this)

    return new VanillaMachine(combobox.machine, {
      ...context,
    })
  }

  initApi() {
    return combobox.connect(this.machine.service, normalizeProps)
  }

  render() {
    spreadProps(this.rootEl, this.api.getRootProps())
    spreadProps(this.input, this.api.getInputProps())
    spreadProps(this.content, this.api.getContentProps())

    this.items.forEach((itemEl) => {
      this.renderItem(itemEl)
    })

    if (this.trigger) {
      spreadProps(this.trigger, this.api.getTriggerProps())
    }

    if (this.label) {
      spreadProps(this.label, this.api.getLabelProps())
    }
  }

  private get trigger() {
    return query(this.rootEl, COMBOBOX_TRIGGER_SELECTOR)
  }

  private get label() {
    return query(this.rootEl, COMBOBOX_LABEL_SELECTOR)
  }

  private get input() {
    const inputEl = query(this.rootEl, COMBOBOX_INPUT_SELECTOR)
    if (!inputEl) {
      throw new Error('Expected inputEl to be defined')
    }
    return inputEl
  }

  private get content() {
    const contentEl = query(this.rootEl, COMBOBOX_CONTENT_SELECTOR)
    if (!contentEl) {
      throw new Error('Expected contentEl to be defined')
    }
    return contentEl
  }

  private get items() {
    const itemEls = queryAll(this.content, COMBOBOX_ITEM_SELECTOR)
    if (!itemEls || itemEls.length === 0) {
      throw new Error('Expected at least 1 itemEls to be defined')
    }
    return itemEls
  }

  private renderItem(itemEl: HTMLElement) {
    const value = itemEl.getAttribute('data-value')
    if (!value) {
      throw new Error('Expected value to be defined')
    }

    spreadProps(itemEl, this.api.getItemProps({
      item: {
        value,
        label: (itemEl.textContent || '').trim(),
        isItemDisabled: itemEl.hasAttribute('disabled') || itemEl.hasAttribute('data-disabled'),
      },
    }))
  }
}

export function comboboxInit() {
  queryAll(document, COMBOBOX_ROOT_SELECTOR).forEach((rootEl) => {
    const combobox = new ZagCombobox(rootEl, {
      id: nanoid(),
    })
    combobox.init()
  })
}

if (typeof window !== 'undefined') {
  window.ZagCombobox = ZagCombobox
  window.comboboxInit = comboboxInit
}
