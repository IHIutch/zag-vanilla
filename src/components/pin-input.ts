import { Component } from "../utils/component"
import { VanillaMachine } from "../utils/machine"
import * as pinInput from '@zag-js/pin-input'
import { spreadProps } from "../utils/spread-props"
import { normalizeProps } from "../utils/normalize-props"
import { nanoid } from "nanoid"


export class ZagPinInput extends Component<pinInput.Props, pinInput.Api> {
  static instances: Map<string, ZagPinInput> = new Map()

  static getInstance(id: string) {
    const instance = ZagPinInput.instances.get(id)
    if (!instance) {
      console.error(`ZagPinInput instance with id "${id}" not found`)
    }
    return instance
  }

  initMachine(context: pinInput.Props) {
    ZagPinInput.instances.set(context.id, this)

    return new VanillaMachine(pinInput.machine, {
      ...context,
      defaultValue: this.inputs.map((inputEl) => inputEl.value),
    })
  }

  initApi() {
    return pinInput.connect(this.machine.service, normalizeProps)
  }

  render() {
    spreadProps(this.rootEl, this.api.getRootProps())
    this.inputs.forEach((inputEl, index) => {
      this.renderInput(inputEl, index)
    })
  }

  private get inputs() {
    return Array.from(this.rootEl.querySelectorAll<HTMLInputElement>('[data-part="pin-input"]'))
  }

  private renderInput(inputEl: HTMLInputElement, index: number) {
    spreadProps(inputEl, this.api.getInputProps({
      index: index,
    }))
  }

  public clearValue() {
    this.api.clearValue()
  }
}

export function pinInputInit() {
  document.querySelectorAll<HTMLElement>('[data-part="pin-input-root"]').forEach((rootEl) => {
    const pinInput = new ZagPinInput(rootEl, {
      id: rootEl.id || nanoid(),
    })
    pinInput.init()
  })
}

if (typeof window !== 'undefined') {
  window.ZagPinInput = ZagPinInput
  window.pinInputInit = pinInputInit
}
