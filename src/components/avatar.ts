import * as avatar from '@zag-js/avatar'
import { nanoid } from 'nanoid'
import { Component } from '../utils/component'
import { VanillaMachine } from '../utils/machine'
import { normalizeProps } from '../utils/normalize-props'
import { spreadProps } from '../utils/spread-props'

export class ZagAvatar extends Component<avatar.Props, avatar.Api> {
  initMachine(context: avatar.Props) {
    return new VanillaMachine(avatar.machine, {
      ...context,
    })
  }

  initApi() {
    return avatar.connect(this.machine.service, normalizeProps)
  }

  render() {
    spreadProps(this.rootEl, this.api.getRootProps())

    const imageEl = this.rootEl.querySelector<HTMLElement>('[data-part="avatar-image"]')
    if (imageEl)
      spreadProps(imageEl, this.api.getImageProps())
    const fallbackEl = this.rootEl.querySelector<HTMLElement>('[data-part="avatar-fallback"]')
    if (fallbackEl)
      spreadProps(fallbackEl, this.api.getFallbackProps())
  }
}

export function avatarInit() {
  document.querySelectorAll<HTMLElement>('[data-part="avatar-root"]').forEach((rootEl) => {
    const avatar = new ZagAvatar(rootEl, {
      id: nanoid(),
    })
    avatar.init()
  })
}

if (typeof window !== 'undefined') {
  window.ZagAvatar = ZagAvatar
  window.avatarInit = avatarInit
}
