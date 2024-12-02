import { accordionInit } from './accordion.ts';
import { checkboxInit } from './checkbox.ts'
import { dialogInit } from './dialog.ts';
import { menuInit } from './menu.ts'
import { splitterInit } from './splitter.ts'


document.addEventListener('DOMContentLoaded', () => {

  accordionInit()
  checkboxInit()
  menuInit()
  splitterInit()
  dialogInit()

});
