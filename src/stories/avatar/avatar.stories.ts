import avatarBasic from './examples/basic.html?raw'
import avatarFallback from './examples/fallback.html?raw'

export default {
  title: 'Avatar',
}

export const Basic = {
  render: () => avatarBasic,
}

export const Fallback = {
  render: () => avatarFallback,
}
