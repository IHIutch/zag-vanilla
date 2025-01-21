export type EventKey =
  | 'ArrowDown'
  | 'ArrowUp'
  | 'ArrowLeft'
  | 'ArrowRight'
  | 'Space'
  | 'Enter'
  | 'Comma'
  | 'Escape'
  | 'Backspace'
  | 'Delete'
  | 'Home'
  | 'End'
  | 'Tab'
  | 'PageUp'
  | 'PageDown'
  | (string & {})

export type EventKeyMap = {
  [key in EventKey]?: (event: KeyboardEvent) => void
}
