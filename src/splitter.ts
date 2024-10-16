import * as splitter from '@zag-js/splitter';
import { normalizeProps } from './utils';
import { Component } from './component';
import { spreadProps } from './spread-props';

export class Splitter extends Component<splitter.Context, splitter.Api> {
  initService(context: splitter.Context) {
    return splitter.machine({
      id: context.id,
      orientation: context.orientation,
      size: this.panels.map((panelEl) => ({
        id: panelEl.getAttribute('data-value') || '',
        size: Number(panelEl.getAttribute('data-size') || 50),
      }))
    })
  }

  initApi() {
    return splitter.connect(this.service.state, this.service.send, normalizeProps)
  }

  render = () => {
    spreadProps(this.rootEl, this.api.getRootProps())
    this.resizers.forEach((panelEl) => {
      this.renderResizer(panelEl)
    })
    this.panels.forEach((panelEl) => {
      this.renderPanel(panelEl)
    })
  }

  private get resizers() {
    return Array.from(this.rootEl!.querySelectorAll<HTMLElement>('[data-part="splitter-resizer"'))
  }
  private get panels() {
    return Array.from(this.rootEl!.querySelectorAll<HTMLElement>('[data-part="splitter-panel"]'))
  }

  private renderResizer = (resizerEl: HTMLElement) => {
    const value = resizerEl.dataset.value
    if (!value) throw new Error("Expected value to be defined")
    spreadProps(resizerEl, this.api.getResizeTriggerProps({ id: value as `${string}:${string}` }))
  }

  private renderPanel = (panelEl: HTMLElement) => {
    const value = panelEl.dataset.value
    if (!value) throw new Error("Expected value to be defined")

    spreadProps(panelEl, this.api.getPanelProps({ id: value }))
  }
}