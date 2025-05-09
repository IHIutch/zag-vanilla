import * as popover from '@zag-js/popover'
import { Component } from '../utils/component'
import { VanillaMachine } from '../utils/machine'
import { normalizeProps } from '../utils/normalize-props'
import { spreadProps } from '../utils/spread-props'

export class ZagPopover extends Component<popover.Props, popover.Api> {
  initMachine(context: popover.Props) {
    return new VanillaMachine(popover.machine, {
      ...context,
    })
  }

  initApi() {
    return popover.connect(this.machine.service, normalizeProps)
  }

  render() {
    spreadProps(this.rootEl, this.api.getTriggerProps())

    this.renderPositioner(this.positioner)
    this.renderContent(this.content)

    if (this.title)
      this.renderTitle(this.title)
    if (this.description)
      this.renderDescription(this.description)
    if (this.arrow)
      this.renderArrow(this.arrow)
    if (this.arrowTip)
      this.renderArrow(this.arrowTip)
    this.closeTriggers.forEach((closeTriggerEl) => {
      this.renderCloseTrigger(closeTriggerEl)
    })
  }

  private get positioner() {
    const value = this.rootEl.getAttribute('data-target')
    if (!value)
      throw new Error('Expected value to be defined')

    const positionerEl = document.querySelector<HTMLElement>(`[data-part="popover-positioner"][data-value="${value}"]`)
    if (!positionerEl)
      throw new Error('Expected positionerEl to be defined')
    return positionerEl
  }

  private get content() {
    const contentEl = this.positioner.querySelector<HTMLElement>(`[data-part="popover-content"]`)
    if (!contentEl)
      throw new Error('Expected contentEl to be defined')
    return contentEl
  }

  private get title() {
    return this.positioner.querySelector<HTMLElement>(`[data-part="popover-title"]`)
  }

  private get description() {
    return this.positioner.querySelector<HTMLElement>(`[data-part="popover-description"]`)
  }

  private get arrow() {
    return this.content.querySelector<HTMLElement>(`[data-part="popover-arrow"]`)
  }

  private get arrowTip() {
    return this.positioner.querySelector<HTMLElement>(`[data-part="popover-arrow-tip"]`)
  }

  private get closeTriggers() {
    return this.content.querySelectorAll<HTMLElement>(`[data-part="popover-close-trigger"]`)
  }

  private renderPositioner(positionerEl: HTMLElement) {
    document.body.appendChild(positionerEl)
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

  private renderArrow(arrowEl: HTMLElement) {
    spreadProps(arrowEl, this.api.getArrowProps())
  }

  private renderCloseTrigger(closeTriggerEl: HTMLElement) {
    spreadProps(closeTriggerEl, this.api.getCloseTriggerProps())
  }
}

export function popoverInit() {
  document.querySelectorAll<HTMLElement>('[data-part="popover-trigger"]').forEach((triggerEl) => {
    const value = triggerEl.getAttribute('data-target')
    if (!value)
      throw new Error('Expected [data-target] to be defined')

    const popover = new ZagPopover(triggerEl, {
      id: value,
    })
    popover.init()
  })
}

if (typeof window !== 'undefined') {
  window.ZagPopover = ZagPopover
  window.popoverInit = popoverInit
}
