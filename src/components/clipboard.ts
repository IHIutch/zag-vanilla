import * as clipboard from '@zag-js/clipboard'
import { query } from '@zag-js/dom-query'
import { nanoid } from 'nanoid'
import { Component } from '../utils/component'
import { VanillaMachine } from '../utils/machine'
import { normalizeProps } from '../utils/normalize-props'
import { spreadProps } from '../utils/spread-props'

export class ZagClipboard extends Component<clipboard.Props, clipboard.Api> {
  static instances: Map<string, ZagClipboard> = new Map()

  static getInstance(id: string) {
    return ZagClipboard.instances.get(id)
  }

  initMachine(context: clipboard.Props) {
    ZagClipboard.instances.set(context.id, this)

    return new VanillaMachine(clipboard.machine, {
      ...context,
      value: this.rootEl.getAttribute('data-value') || '',
      timeout: Number(this.rootEl.getAttribute('data-timeout') || 3000),
    })
  }

  initApi() {
    return clipboard.connect(this.machine.service, normalizeProps)
  }

  render() {
    spreadProps(this.rootEl, this.api.getRootProps())
    spreadProps(this.trigger, this.api.getTriggerProps())

    if (this.control) {
      spreadProps(this.control, this.api.getControlProps())
    }
    if (this.input) {
      this.renderInput(this.input)
    }
    if (this.label) {
      spreadProps(this.label, this.api.getLabelProps())
    }
  }

  private get trigger() {
    const triggerEl = query(this.rootEl, ('[data-part="clipboard-trigger"]'))
    if (!triggerEl)
      throw new Error('Expected triggerEl to be defined')
    return triggerEl
  }

  private get input() {
    return query(this.rootEl, ('[data-part="clipboard-input"]')) as HTMLInputElement | null
  }

  private get control() {
    return query(this.rootEl, ('[data-part="clipboard-control"]'))
  }

  private get label() {
    return query(this.rootEl, ('[data-part="clipboard-label"]'))
  }

  private renderInput(inputEl: HTMLInputElement) {
    spreadProps(inputEl, {
      ...this.api.getInputProps(),
      value: this.api.value,
    })
  }

  setValue(value: any) {
    this.api.setValue(String(value))
  }
}

export function clipboardInit() {
  document.querySelectorAll<HTMLElement>('[data-part="clipboard-root"]').forEach((rootEl) => {
    const clipboard = new ZagClipboard(rootEl, {
      id: rootEl.id || nanoid(),
    })
    clipboard.init()
  })
}

if (typeof window !== 'undefined') {
  window.ZagClipboard = ZagClipboard
  window.clipboardInit = clipboardInit
}
