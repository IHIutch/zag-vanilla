import type { Accordion } from './components/accordion'
import type { Avatar } from './components/avatar'
import type { Carousel } from './components/carousel'
import type { Checkbox } from './components/checkbox'
import type { Clipboard } from './components/clipboard'
import type { Collapsible } from './components/collapsible'
import type { Combobox } from './components/combobox'
import type { Dialog } from './components/dialog'
import type { Menu } from './components/menu'
import type { Splitter } from './components/splitter'

declare global {
  interface Window {
    Accordion: typeof Accordion
    accordionInit: () => void
    //
    Avatar: typeof Avatar
    avatarInit: () => void
    //
    Carousel: typeof Carousel
    carouselInit: () => void
    //
    Checkbox: typeof Checkbox
    checkboxInit: () => void
    //
    Clipboard: typeof Clipboard
    clipboardInit: () => void
    //
    Collapsible: typeof Collapsible
    collapsibleInit: () => void
    //
    Combobox: typeof Combobox
    comboboxInit: () => void
    //
    Dialog: typeof Dialog
    dialogInit: () => void
    //
    Menu: typeof Menu
    menuInit: () => void
    //
    Splitter: typeof Splitter
    splitterInit: () => void
  }
}
