import * as dialog from '@zag-js/dialog'
import { Component } from '../utils/component'
import { VanillaMachine } from '../utils/machine'
import { normalizeProps } from '../utils/normalize-props'
import { spreadProps } from '../utils/spread-props'

export class ZagDialog extends Component<dialog.Props, dialog.Api> {
  static instances: Map<string, ZagDialog> = new Map()

  static getInstance(id: string) {
    const instance = ZagDialog.instances.get(id)
    if (!instance) {
      console.error(`ZagDialog instance with id "${id}" not found`)
    }
    return instance
  }

  initMachine(context: dialog.Props) {
    ZagDialog.instances.set(context.id, this)

    return new VanillaMachine(dialog.machine, {
      ...context,
      role: this.content.getAttribute('role') === 'alertdialog' ? 'alertdialog' : 'dialog',
      closeOnEscape: !this.content.hasAttribute('data-static'),
      closeOnInteractOutside: !this.content.hasAttribute('data-static'),
    })
  }

  initApi() {
    return dialog.connect(this.machine.service, normalizeProps)
  }

  render() {
    spreadProps(this.rootEl, this.api.getTriggerProps())

    this.renderPositioner(this.positioner)
    this.renderBackdrop(this.backdrop)
    this.renderContent(this.content)

    if (this.title)
      this.renderTitle(this.title)
    if (this.description)
      this.renderDescription(this.description)
    this.closeTriggers.forEach((closeTriggerEl) => {
      this.renderCloseTrigger(closeTriggerEl)
    })
  }

  private get backdrop() {
    const value = this.rootEl.getAttribute('data-target')
    if (!value)
      throw new Error('Expected value to be defined')

    const backdropEl = document.querySelector<HTMLElement>(`[data-part="dialog-backdrop"][data-value="${value}"]`)
    if (!backdropEl)
      throw new Error('Expected backdropEl to be defined')
    return backdropEl
  }

  private get positioner() {
    const value = this.rootEl.getAttribute('data-target')
    if (!value)
      throw new Error('Expected value to be defined')

    const positionerEl = document.querySelector<HTMLElement>(`[data-part="dialog-positioner"][data-value="${value}"]`)
    if (!positionerEl)
      throw new Error('Expected positionerEl to be defined')
    return positionerEl
  }

  private get content() {
    const contentEl = this.positioner.querySelector<HTMLElement>(`[data-part="dialog-content"]`)
    if (!contentEl)
      throw new Error('Expected contentEl to be defined')
    return contentEl
  }

  private get title() {
    return this.positioner.querySelector<HTMLElement>(`[data-part="dialog-title"]`)
  }

  private get description() {
    return this.positioner.querySelector<HTMLElement>(`[data-part="dialog-description"]`)
  }

  private get closeTriggers() {
    return Array.from(this.content.querySelectorAll<HTMLButtonElement>(`[data-part="dialog-close-trigger"]`))
  }

  private renderBackdrop(backdropEl: HTMLElement) {
    spreadProps(backdropEl, this.api.getBackdropProps())
  }

  private renderPositioner(positionerEl: HTMLElement) {
    spreadProps(positionerEl, this.api.getPositionerProps())
  }

  private renderContent(contentEl: HTMLElement) {
    spreadProps(contentEl, this.api.getContentProps())
  }

  private renderTitle(titleEl: HTMLElement) {
    spreadProps(titleEl, this.api.getTitleProps())
  }

  private renderDescription(descriptionEl: HTMLElement) {
    spreadProps(descriptionEl, this.api.getDescriptionProps())
  }

  private renderCloseTrigger(closeTriggerEl: HTMLButtonElement) {
    spreadProps(closeTriggerEl, this.api.getCloseTriggerProps())
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

export function dialogInit() {
  document.querySelectorAll<HTMLElement>('[data-part="dialog-trigger"]').forEach((targetEl) => {
    const value = targetEl.getAttribute('data-target')
    if (!value)
      throw new Error('Expected [data-target] to be defined')

    const dialog = new ZagDialog(targetEl, {
      id: value,
    })
    dialog.init()
  })
}

if (typeof window !== 'undefined') {
  window.ZagDialog = ZagDialog
  window.dialogInit = dialogInit
}
