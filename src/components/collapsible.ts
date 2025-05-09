import * as collapsible from '@zag-js/collapsible'
import { query, queryAll } from '@zag-js/dom-query'
import { nanoid } from 'nanoid'
import { Component } from '../utils/component'
import { VanillaMachine } from '../utils/machine'
import { normalizeProps } from '../utils/normalize-props'
import { spreadProps } from '../utils/spread-props'

export class ZagCollapsible extends Component<collapsible.Props, collapsible.Api> {
  static instances: Map<string, ZagCollapsible> = new Map()

  static getInstance(id: string) {
    return ZagCollapsible.instances.get(id)
  }

  initMachine(context: collapsible.Props) {
    ZagCollapsible.instances.set(context.id, this)

    return new VanillaMachine(collapsible.machine, {
      ...context,
      disabled: this.rootEl.hasAttribute('disabled') || this.rootEl.hasAttribute('data-disabled'),
      dir: this.rootEl.getAttribute('data-dir') === 'rtl' ? 'rtl' : 'ltr',
      open: this.rootEl.hasAttribute('data-open'),
      onOpenChange: (detail) => {
        const event = new CustomEvent('onOpenChange', {
          detail,
        })
        this.rootEl.dispatchEvent(event)
      },
      onExitComplete: () => {
        const event = new CustomEvent('onExitComplete')
        this.rootEl.dispatchEvent(event)
      },
    })
  }

  initApi() {
    return collapsible.connect(this.machine.service, normalizeProps)
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
    const collapsible = new ZagCollapsible(rootEl, {
      id: rootEl.id || nanoid(),
    })
    collapsible.init()
  })
}

if (typeof window !== 'undefined') {
  window.ZagCollapsible = ZagCollapsible
  window.collapsibleInit = collapsibleInit
}
