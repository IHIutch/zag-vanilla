import * as accordion from '@zag-js/accordion'
import { nanoid } from 'nanoid'
import { Component } from '../utils/component'
import { normalizeProps } from '../utils/normalize-props'
import { spreadProps } from '../utils/spread-props'

export class Accordion extends Component<accordion.Context, accordion.Api> {
  initService(context: accordion.Context) {
    return accordion.machine({
      multiple: this.rootEl.hasAttribute('data-multiple'),
      ...context,
    })
  }

  initApi() {
    return accordion.connect(this.service.state, this.service.send, normalizeProps)
  }

  render() {
    spreadProps(this.rootEl, this.api.getRootProps())
    this.items.forEach((itemEl) => {
      this.renderItem(itemEl)
    })
  }

  private get items() {
    return Array.from(this.rootEl.querySelectorAll<HTMLElement>('[data-part="accordion-item"]'))
  }

  private renderItem(itemEl: HTMLElement) {
    const value = itemEl.getAttribute('data-value')
    if (!value)
      throw new Error('Expected value to be defined')
    const itemTriggerEl = itemEl.querySelector<HTMLButtonElement>('[data-part="accordion-trigger"]')
    const itemContentEl = itemEl.querySelector<HTMLElement>('[data-part="accordion-content"]')

    if (!itemTriggerEl)
      throw new Error('Expected triggerEl to be defined')
    if (!itemContentEl)
      throw new Error('Expected contentEl to be defined')
    spreadProps(itemEl, this.api.getItemProps({ value }))
    spreadProps(itemTriggerEl, this.api.getItemTriggerProps({ value }))
    spreadProps(itemContentEl, this.api.getItemContentProps({ value }))

    const itemIndicatorEl = itemEl.querySelector<HTMLElement>('[data-part="accordion-indicator"]')
    if (itemIndicatorEl) {
      spreadProps(itemIndicatorEl, this.api.getItemIndicatorProps({ value }))
    }
  }
}

export function accordionInit() {
  document.querySelectorAll<HTMLElement>('[data-part="accordion-root"]').forEach((rootEl) => {
    const accordion = new Accordion(rootEl, {
      id: nanoid(),
    })
    accordion.init()
  })
}

if (typeof window !== 'undefined') {
  window.Accordion = Accordion
  window.accordionInit = accordionInit
}
