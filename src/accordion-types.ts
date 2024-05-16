declare const brand: unique symbol;
type Brand<T, TBrand extends string> = T & { [brand]: TBrand };

export type MachineId = Brand<HTMLElement['id'], "MachineId">;
export type MachineItemId = Brand<HTMLElement['id'], "MachineItemId">;

export type RootId = Brand<HTMLElement['id'], "RootId">;
export type ItemId = Brand<HTMLElement['id'], "ItemId">;
export type TriggerId = Brand<HTMLButtonElement['id'], "TriggerId">;
export type ContentId = Brand<HTMLElement['id'], "ContentId">;

type AccordionState = 'open' | 'closed'

export type RootAttributes = {
    'data-scope': 'accordion'
    'data-part': 'root'
    'id': RootId,
}

export type ItemAttributes = {
    'data-scope': 'accordion'
    'id': ItemId,
    'data-state': AccordionState
}

export type TriggerAttributes = {
    'data-scope': 'accordion'
    'type': Extract<HTMLButtonElement['type'], 'button'>
    'id': TriggerId
    'aria-controls': ContentId
    'aria-expanded': HTMLButtonElement['ariaExpanded']
    'aria-disabled': HTMLButtonElement['ariaDisabled']
    'data-state': AccordionState
    'data-ownedby': RootId
}

export type ContentAttributes = {
    'data-scope': 'accordion'
    'role': HTMLElement['role']
    'id': ContentId
    'aria-labelledby': TriggerId
    'data-state': AccordionState
    'hidden': HTMLElement['hidden'] | 'until-found'
}