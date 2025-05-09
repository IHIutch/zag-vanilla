import { Component } from "../utils/component"
import { VanillaMachine } from "../utils/machine"
import * as pinInput from '@zag-js/pin-input'
import { spreadProps } from "../utils/spread-props"
import { normalizeProps } from "../utils/normalize-props"
import { nanoid } from "nanoid"
import * as z from "zod"

const schema = z.object({
  // id: z.string(),
  // name: z.string().optional(),
  // value: z.array(z.string()).optional(),
  mask: z.boolean(),
  otp: z.boolean(),
  type: z.enum(["alphanumeric", "numeric", "alphabetic"]).optional(),
  // autoFocus: z.boolean().optional(),
  // disabled: z.boolean().optional(),
  // readOnly: z.boolean().optional(),
  // required: z.boolean().optional(),
  // autoComplete: z.string().optional(),
})

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

    const parsed = schema.safeParse({
      mask: this.rootEl.hasAttribute('data-mask'),
      type: this.rootEl.getAttribute('data-type') ?? undefined,
      otp: this.rootEl.hasAttribute('data-otp')
    });

    if (!parsed.success) {
      throw new Error(`ZagPinInput: ${parsed.error.message}`);
    }

    return new VanillaMachine(pinInput.machine, {
      ...context,
      defaultValue: this.inputs.map((inputEl) => inputEl.value),
      mask: parsed.data.mask,
      type: parsed.data.type,
      otp: parsed.data.otp,
      // count: this.inputs.length,
      onValueChange: (detail) => {
        const event = new CustomEvent('onValueChange', {
          detail,
        })
        this.rootEl.dispatchEvent(event)
      },
      onValueComplete: (detail) => {
        const event = new CustomEvent('onValueComplete', {
          detail,
        })
        this.rootEl.dispatchEvent(event)
      },
      onValueInvalid: (detail) => {
        const event = new CustomEvent('onValueInvalid', {
          detail,
        })
        this.rootEl.dispatchEvent(event)
      },
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

  getRoot() {
    return this.rootEl
  }
}

export function pinInputInit() {
  document.querySelectorAll<HTMLElement>('[data-part="pin-input-root"]').forEach((rootEl) => {
    const dataId = rootEl.getAttribute('data-id')

    const pinInput = new ZagPinInput(rootEl, {
      id: dataId || nanoid(),
    })
    pinInput.init()
  })
}

if (typeof window !== 'undefined') {
  window.ZagPinInput = ZagPinInput
  window.pinInputInit = pinInputInit
}
