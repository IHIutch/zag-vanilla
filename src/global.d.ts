import type { Accordion } from './accordion'
import type { Checkbox } from './checkbox'
import type { Dialog } from './dialog'
import type { Splitter } from './splitter'

declare global {
  interface Window {
    Accordion: typeof Accordion
    accordionInit: () => void
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
