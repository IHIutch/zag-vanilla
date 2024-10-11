import { nanoid } from 'nanoid'
import { Accordion } from './accordion.ts'
import { initSplitter } from './splitter.ts'

document.querySelectorAll<HTMLElement>('[data-part="accordion-root"]').forEach((rootEl) => {
    const accordion = new Accordion(rootEl, {
        id: nanoid(),
        multiple: rootEl.hasAttribute('data-multiple'),
    })
    accordion.init()
})

initSplitter()