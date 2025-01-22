import { accordionInit } from './components/accordion.ts'
import { avatarInit } from './components/avatar.ts'
import { carouselInit } from './components/carousel.ts'
import { checkboxInit } from './components/checkbox.ts'
import { collapsibleInit } from './components/collapsible.ts'
import { dialogInit } from './components/dialog.ts'
import { menuInit } from './components/menu.ts'
import { splitterInit } from './components/splitter.ts'

document.addEventListener('DOMContentLoaded', () => {
  accordionInit()
  checkboxInit()
  menuInit()
  splitterInit()
  dialogInit()
  avatarInit()
  carouselInit()
  collapsibleInit()
})
