import type { Accordion } from './components/accordion'
import type { Avatar } from './components/avatar'
import type { Checkbox } from './components/checkbox'
import type { Dialog } from './components/dialog'
import type { Splitter } from './components/splitter'

declare global {
  interface Window {
    Accordion: typeof Accordion
    accordionInit: () => void
    //
    Avatar: typeof Avatar
    avatarInit: () => void
    //
    Checkbox: typeof Checkbox
    checkboxInit: () => void
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
