import * as checkbox from '@zag-js/checkbox'
import { nanoid } from 'nanoid'
import { Component } from '../utils/component'
import { normalizeProps } from '../utils/normalize-props'
import { spreadProps } from '../utils/spread-props'

export class Checkbox extends Component<checkbox.Context, checkbox.Api> {
  initService(context: checkbox.Context) {
    return checkbox.machine({
      name: this.input.getAttribute('name') || undefined,
      checked: this.input.hasAttribute('indeterminate') ? 'indeterminate' : this.input.checked,
      disabled: this.input.disabled,
      ...context,
    })
  }

  initApi() {
    return checkbox.connect(this.service.state, this.service.send, normalizeProps)
  }

  render() {
    spreadProps(this.rootEl, this.api.getRootProps())
    this.renderItem(this.rootEl)
  }

  private get input() {
    const inputEl = this.rootEl.querySelector<HTMLInputElement>('[data-part="checkbox-input"]')
    if (!inputEl)
      throw new Error('Expected inputEl to be defined')
    return inputEl
  }

  private renderItem(rootEl: HTMLElement) {
    const labelEl = rootEl.querySelector<HTMLButtonElement>('[data-part="checkbox-label"]')
    const controlEl = rootEl.querySelector<HTMLElement>('[data-part="checkbox-control"]')
    if (!labelEl)
      throw new Error('Expected labelEl to be defined')
    if (!controlEl)
      throw new Error('Expected controlEl to be defined')
    spreadProps(labelEl, this.api.getLabelProps())
    spreadProps(controlEl, this.api.getControlProps())
    spreadProps(this.input, this.api.getHiddenInputProps())

    const indicatorEl = rootEl.querySelector<HTMLElement>('[data-part="checkbox-indicator"]')
    if (indicatorEl)
      spreadProps(indicatorEl, this.api.getIndicatorProps())
  }
}

export function checkboxInit() {
  document.querySelectorAll<HTMLElement>('[data-part="checkbox-root"]').forEach((rootEl) => {
    const checkbox = new Checkbox(rootEl, {
      id: nanoid(),
    })
    checkbox.init()
  })
}

if (typeof window !== 'undefined') {
  window.Checkbox = Checkbox
  window.checkboxInit = checkboxInit
}
