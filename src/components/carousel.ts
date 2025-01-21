import * as carousel from '@zag-js/carousel'
import { query, queryAll } from '@zag-js/dom-query'
import { nanoid } from 'nanoid'
import { Component } from '../utils/component'
import { normalizeProps } from '../utils/normalize-props'
import { spreadProps } from '../utils/spread-props'

export class Carousel extends Component<carousel.Context, carousel.Api> {
  initService(context: carousel.Context) {
    return carousel.machine({
      slideCount: this.items.length,
      loop: this.rootEl.hasAttribute('data-loop') || false,
      spacing: this.rootEl.getAttribute('data-spacing') || undefined,
      allowMouseDrag: this.rootEl.hasAttribute('data-allowMouseDrag') || false,
      ...context,
    })
  }

  initApi() {
    return carousel.connect(this.service.state, this.service.send, normalizeProps)
  }

  render() {
    spreadProps(this.rootEl, this.api.getRootProps())

    if (this.itemGroup) {
      spreadProps(this.itemGroup, this.api.getItemGroupProps())

      this.items.forEach((itemEl, index) => {
        this.renderItem(itemEl, index)
      })
    }

    if (this.control) {
      spreadProps(this.control, this.api.getControlProps())

      if (this.prevTrigger) {
        spreadProps(this.prevTrigger, this.api.getPrevTriggerProps())
      }
      if (this.nextTrigger) {
        spreadProps(this.nextTrigger, this.api.getNextTriggerProps())
      }
      if (this.indicatorGroup) {
        spreadProps(this.indicatorGroup, this.api.getIndicatorGroupProps())

        this.indicators.forEach((indicatorEl, index) => {
          this.renderIndicator(indicatorEl, index)
        })
      }
    }
  }

  private get itemGroup() {
    return query(this.rootEl, '[data-part="carousel-item-group"]')
  }

  private get items() {
    if (!this.itemGroup) {
      throw new Error('Expected itemGroup to be defined')
    }
    return queryAll(this.itemGroup, '[data-part="item"]')
  }

  private get control() {
    return query(this.rootEl, '[data-part="carousel-control"]')
  }

  private get prevTrigger() {
    if (!this.control) {
      throw new Error('Expected control to be defined')
    }
    return query(this.control, '[data-part="carousel-prev-trigger"]')
  }

  private get nextTrigger() {
    if (!this.control) {
      throw new Error('Expected control to be defined')
    }
    return query(this.control, '[data-part="carousel-next-trigger"]')
  }

  private get indicatorGroup() {
    if (!this.control) {
      throw new Error('Expected control to be defined')
    }
    return query(this.control, '[data-part="carousel-indicator-group"]')
  }

  private get indicators() {
    if (!this.indicatorGroup) {
      throw new Error('Expected indicatorGroup to be defined')
    }
    return queryAll(this.indicatorGroup, '[data-part="carousel-indicator"]')
  }

  // private get autoplayTrigger() {}

  private renderItem(itemEl: HTMLElement, index: number) {
    spreadProps(itemEl, this.api.getItemProps({
      index,
      // snapAlign
    }))
  }

  private renderIndicator(indicatorEl: HTMLElement, index: number) {
    spreadProps(indicatorEl, this.api.getIndicatorProps({
      index,
      // readOnly
    }))
  }
}

export function carouselInit() {
  queryAll(document, '[data-part="carousel-root"]').forEach((rootEl) => {
    const carousel = new Carousel(rootEl, {
      id: nanoid(),
    })
    carousel.init()
  })
}

if (typeof window !== 'undefined') {
  window.Carousel = Carousel
  window.carouselInit = carouselInit
}
