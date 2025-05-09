import type { ZagAccordion } from './components/accordion'
import type { ZagAvatar } from './components/avatar'
import type { ZagCarousel } from './components/carousel'
import type { ZagCheckbox } from './components/checkbox'
import type { ZagClipboard } from './components/clipboard'
import type { ZagCollapsible } from './components/collapsible'
import type { ZagCombobox } from './components/combobox'
import type { ZagDialog } from './components/dialog'
import type { ZagMenu } from './components/menu'
import type { ZagSplitter } from './components/splitter'

declare global {
  interface Window {
    ZagAccordion: typeof ZagAccordion
    accordionInit: () => void
    //
    ZagAvatar: typeof ZagAvatar
    avatarInit: () => void
    //
    ZagCarousel: typeof ZagCarousel
    carouselInit: () => void
    //
    ZagCheckbox: typeof ZagCheckbox
    checkboxInit: () => void
    //
    ZagClipboard: typeof ZagClipboard
    clipboardInit: () => void
    //
    ZagCollapsible: typeof ZagCollapsible
    collapsibleInit: () => void
    //
    ZagCombobox: typeof ZagCombobox
    comboboxInit: () => void
    //
    ZagDialog: typeof ZagDialog
    dialogInit: () => void
    //
    ZagMenu: typeof ZagMenu
    menuInit: () => void
    //
    ZagSplitter: typeof ZagSplitter
    splitterInit: () => void
  }
}
