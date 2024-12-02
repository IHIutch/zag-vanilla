import { Accordion, initAccordions } from "./accordion";
import { Checkbox } from "./checkbox";
import { Dialog } from "./dialog";
import { Splitter } from "./splitter";

declare global {
  interface Window {
    Accordion: typeof Accordion
    accordionInit: () => void;
    //
    Checkbox: typeof Checkbox
    checkboxInit: () => void;
    //
    Dialog: typeof Dialog
    dialogInit: () => void;
    //
    Menu: typeof Menu
    menuInit: () => void;
    //
    Splitter: typeof Splitter
    splitterInit: () => void;
  }
}
