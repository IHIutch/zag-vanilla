import { accordionInit } from './components/accordion.ts'
import { avatarInit } from './components/avatar.ts'
import { carouselInit } from './components/carousel.ts'
import { checkboxInit } from './components/checkbox.ts'
import { clipboardInit } from './components/clipboard.ts'
import { collapsibleInit } from './components/collapsible.ts'
import { comboboxInit } from './components/combobox.ts'
import { dialogInit } from './components/dialog.ts'
import { menuInit } from './components/menu.ts'
import { pinInputInit } from './components/pin-input.ts'
import { splitterInit } from './components/splitter.ts'

document.addEventListener('DOMContentLoaded', () => {
  accordionInit()
  avatarInit()
  carouselInit()
  checkboxInit()
  clipboardInit()
  collapsibleInit()
  comboboxInit()
  dialogInit()
  menuInit()
  splitterInit()
  pinInputInit()
})
