import { Accordion } from './accordion.ts'
import { Splitter } from './splitter.ts'

document.querySelectorAll<HTMLElement>('[data-part="accordion-root"]').forEach((rootEl) => {
    const accordion = new Accordion(rootEl, {
        id: crypto.randomUUID(),
        multiple: rootEl.hasAttribute('data-multiple'),
    })
    accordion.init()
})

document.querySelectorAll<HTMLElement>('[data-part="splitter-root"]').forEach((rootEl) => {
    const splitter = new Splitter(rootEl, {
        id: crypto.randomUUID(),
        orientation: rootEl.getAttribute('data-orientation') === 'vertical' ? 'vertical' : 'horizontal'
    })
    splitter.init()
})
