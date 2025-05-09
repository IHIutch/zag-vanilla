import * as splitter from '@zag-js/splitter'
import { nanoid } from 'nanoid'
import { Component } from '../utils/component'
import { VanillaMachine } from '../utils/machine'
import { normalizeProps } from '../utils/normalize-props'
import { spreadProps } from '../utils/spread-props'

export class ZagSplitter extends Component<splitter.Props, splitter.Api> {
  initMachine(context: splitter.Props) {
    return new VanillaMachine(splitter.machine, {
      ...context,
      size: this.panels.map(panelEl => Number(panelEl.getAttribute('data-size') || 50)),
      orientation: this.rootEl.getAttribute('data-orientation') === 'vertical' ? 'vertical' : 'horizontal',
      panels: this.panels.map(panelEl => ({
        id: this.rootEl.getAttribute('data-value') || '',
        size: Number(panelEl.getAttribute('data-size') || 50),
      })),
    })
  }

  initApi() {
    return splitter.connect(this.machine.service, normalizeProps)
  }

  render() {
    spreadProps(this.rootEl, this.api.getRootProps())
    this.resizers.forEach((panelEl) => {
      this.renderResizer(panelEl)
    })
    this.panels.forEach((panelEl) => {
      this.renderPanel(panelEl)
    })
  }

  private get resizers() {
    return Array.from(this.rootEl.querySelectorAll<HTMLElement>('[data-part="splitter-resizer"]'))
  }

  private get panels() {
    return Array.from(this.rootEl.querySelectorAll<HTMLElement>('[data-part="splitter-panel"]'))
  }

  private renderResizer(resizerEl: HTMLElement) {
    const value = resizerEl.getAttribute('data-value')
    if (!value)
      throw new Error('Expected value to be defined')
    if (!/^[^:]+:[^:]+$/.test(value))
      throw new Error('Resizer value must be in format \'panelA:panelB\'')
    spreadProps(resizerEl, this.api.getResizeTriggerProps({ id: value as `${string}:${string}` }))
  }

  private renderPanel(panelEl: HTMLElement) {
    const value = panelEl.getAttribute('data-value')
    if (!value)
      throw new Error('Expected value to be defined')

    spreadProps(panelEl, this.api.getPanelProps({ id: value }))
  }
}

export function splitterInit() {
  document.querySelectorAll<HTMLElement>('[data-part="splitter-root"]').forEach((rootEl) => {
    const panelEls = Array.from(rootEl.querySelectorAll<HTMLElement>('[data-part="splitter-panel"]'))
    const splitter = new ZagSplitter(rootEl, {
      id: nanoid(),
      panels: panelEls.map(panelEl => ({
        id: panelEl.getAttribute('data-value') || '',
      })),
    })
    splitter.init()
  })
}

if (typeof window !== 'undefined') {
  window.ZagSplitter = ZagSplitter
  window.splitterInit = splitterInit
}
