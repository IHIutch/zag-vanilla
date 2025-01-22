import * as collapsible from '@zag-js/collapsible'
import { query, queryAll } from '@zag-js/dom-query'
import { nanoid } from 'nanoid'
import { Component } from '../utils/component'
import { normalizeProps } from '../utils/normalize-props'
import { spreadProps } from '../utils/spread-props'

export class Collapsible extends Component<collapsible.Context, collapsible.Api> {
  initService(context: collapsible.Context) {
    Collapsible.instances.push(this)

    return collapsible.machine({
      disabled: this.rootEl.hasAttribute('disabled') || this.rootEl.hasAttribute('data-disabled'),
      dir: this.rootEl.getAttribute('data-dir') === 'rtl' ? 'rtl' : 'ltr',
      open: this.rootEl.hasAttribute('data-open'),
      onOpenChange: (details) => {
        const event = new CustomEvent('onOpenChange', {
          detail: details,
        })
        this.rootEl.dispatchEvent(event)
      },
      onExitComplete: () => {
        const event = new CustomEvent('onExitComplete')
        this.rootEl.dispatchEvent(event)
      },
      ...context,
    })
  }

  initApi() {
    return collapsible.connect(this.service.state, this.service.send, normalizeProps)
  }

  render() {
    spreadProps(this.rootEl, this.api.getTriggerProps())
    this.renderContent(this.content)
  }

  private get content() {
    const value = this.rootEl.getAttribute('data-target')
    if (!value)
      throw new Error('Expected value to be defined')

    const contentEl = query(document, `[data-part="collapsible-content"][data-value="${value}"]`)
    if (!contentEl)
      throw new Error('Expected contentEl to be defined')
    return contentEl
  }

  private renderContent(contentEl: HTMLElement) {
    spreadProps(contentEl, this.api.getContentProps())
  }

  static instances: Collapsible[] = []

  static getInstance(element: HTMLElement) {
    return Collapsible.instances.find(instance => instance.rootEl === element)
  }

  show() {
    this.api.setOpen(true)
  }

  hide() {
    this.api.setOpen(false)
  }

  toggle() {
    this.api.setOpen(!this.api.open)
  }
}

export function collapsibleInit() {
  queryAll(document, '[data-part="collapsible-trigger"]').forEach((rootEl) => {
    const collapsible = new Collapsible(rootEl, {
      id: rootEl.id || nanoid(),
    })
    collapsible.init()
  })
}

if (typeof window !== 'undefined') {
  window.Collapsible = Collapsible
  window.collapsibleInit = collapsibleInit
}
