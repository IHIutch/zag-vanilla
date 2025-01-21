import * as avatar from '@zag-js/avatar'
import { nanoid } from 'nanoid'
import { Component } from '../utils/component'
import { normalizeProps } from '../utils/normalize-props'
import { spreadProps } from '../utils/spread-props'

export class Avatar extends Component<avatar.Context, avatar.Api> {
  initService(context: avatar.Context) {
    return avatar.machine(context)
  }

  initApi() {
    return avatar.connect(this.service.state, this.service.send, normalizeProps)
  }

  render() {
    const rootEl = this.rootEl
    spreadProps(this.rootEl, this.api.getRootProps())

    const imageEl = rootEl.querySelector<HTMLElement>('[data-part="avatar-image"]')
    if (imageEl)
      spreadProps(imageEl, this.api.getImageProps())
    const fallbackEl = rootEl.querySelector<HTMLElement>('[data-part="avatar-fallback"]')
    if (fallbackEl)
      spreadProps(fallbackEl, this.api.getFallbackProps())
  }
}

export function avatarInit() {
  document.querySelectorAll<HTMLElement>('[data-part="avatar-root"]').forEach((rootEl) => {
    const avatar = new Avatar(rootEl, {
      id: nanoid(),
    })
    avatar.init()
  })
}

if (typeof window !== 'undefined') {
  window.Avatar = Avatar
  window.avatarInit = avatarInit
}
