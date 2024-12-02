import * as menu from "@zag-js/menu"
import { Component } from "./utils/component";
import { normalizeProps } from "./utils/normalize-props";
import { spreadProps } from "./utils/spread-props";

export class Menu extends Component<menu.Context, menu.Api> {

  private checkedState: Map<string, boolean> = new Map();

  initService(context: menu.Context) {
    return menu.machine(context)
  }

  initApi() {
    return menu.connect(this.service.state, this.service.send, normalizeProps)
  }

  render() {
    spreadProps(this.rootEl, this.api.getTriggerProps())

    this.renderPositioner(this.positioner)
    this.renderContent(this.content)
    this.items.forEach((itemEl) => {
      this.renderItem(itemEl)
    })
  }

  private get positioner() {
    const value = this.rootEl.getAttribute('data-target')
    if (!value) throw new Error("Expected value to be defined")

    const positionerEl = document.querySelector<HTMLElement>(`[data-part="menu-positioner"][data-value="${value}"]`)
    if (!positionerEl) throw new Error("Expected positionerEl to be defined")
    return positionerEl
  }

  private get content() {
    const contentEl = this.positioner.querySelector<HTMLElement>(`[data-part="menu-content"]`)
    if (!contentEl) throw new Error("Expected contentEl to be defined")
    return contentEl
  }

  private get items() {
    return Array.from(this.content.querySelectorAll<HTMLElement>('[data-part="menu-item"]'))
  }

  private renderPositioner(positionerEl: HTMLElement) {
    spreadProps(positionerEl, this.api.getPositionerProps())
  }

  private renderContent(contentEl: HTMLElement) {
    spreadProps(contentEl, this.api.getContentProps())
  }

  private renderItem(itemEl: HTMLElement) {
    const value = itemEl.getAttribute('data-value')
    if (!value) throw new Error("Expected value to be defined")

    const checked = this.checkedState.get(value) || false
    const disabled = itemEl.hasAttribute('disabled') || itemEl.hasAttribute('data-disabled')
    const valueText = itemEl.getAttribute('data-valueText') || undefined
    const closeOnSelect = itemEl.hasAttribute('data-closeOnSelect')

    const type = itemEl.getAttribute('data-type');
    if (type === 'checkbox' || type === 'radio') {
      spreadProps(itemEl, this.api.getOptionItemProps({
        type,
        value,
        disabled,
        valueText,
        closeOnSelect,
        checked,
        onCheckedChange: (checked) => {
          if (type === 'radio') {
            this.checkedState.clear();
          }
          this.checkedState.set(value, checked);
        },
      }))

      const itemIndicatorEl = itemEl.querySelector<HTMLElement>('[data-part="menu-item-indicator"]')
      if (itemIndicatorEl) spreadProps(itemIndicatorEl, this.api.getItemIndicatorProps({
        checked,
        type,
        value
      }))

      const itemTextEl = itemEl.querySelector<HTMLElement>('[data-part="menu-item-text"]')
      if (itemTextEl) spreadProps(itemTextEl, this.api.getItemTextProps({
        checked,
        type,
        value
      }))

    } else {
      spreadProps(itemEl, this.api.getItemProps({
        value,
        disabled,
        valueText,
        closeOnSelect,
      }))
    }

  }
}

export function menuInit() {
  document.querySelectorAll<HTMLElement>('[data-part="menu-trigger"]').forEach((targetEl) => {
    const menu = new Menu(targetEl, {
      id: crypto.randomUUID(),
    })
    menu.init()
  })
}

if (typeof window !== 'undefined') {
  window.Menu = Menu
  window.menuInit = menuInit
}
