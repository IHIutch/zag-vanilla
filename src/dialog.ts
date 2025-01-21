import * as dialog from '@zag-js/dialog'
import { nanoid } from 'nanoid'
import { Component } from './utils/component'
import { normalizeProps } from './utils/normalize-props'
import { spreadProps } from './utils/spread-props'

export class Dialog extends Component<dialog.Context, dialog.Api> {
  initService(context: dialog.Context) {
    return dialog.machine({
      role: this.content.getAttribute('role') === 'alertdialog' ? 'alertdialog' : 'dialog',
      closeOnEscape: !this.content.hasAttribute('data-static'),
      closeOnInteractOutside: !this.content.hasAttribute('data-static'),
      ...context,
    })
  }

  initApi() {
    return dialog.connect(this.service.state, this.service.send, normalizeProps)
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
}

export function dialogInit() {
  document.querySelectorAll<HTMLElement>('[data-part="dialog-trigger"]').forEach((targetEl) => {
    const dialog = new Dialog(targetEl, {
      id: nanoid(),
    })
    dialog.init()
  })
}

if (typeof window !== 'undefined') {
  window.Dialog = Dialog
  window.dialogInit = dialogInit
}
