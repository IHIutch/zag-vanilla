import { variantGetBracket } from '@unocss/rule-utils'
import { defineConfig, presetIcons, presetMini, presetUno } from 'unocss'

export default defineConfig({
  content: {
    filesystem: [
      './src/**/*.html',
    ],
  },
  presets: [
    presetUno(),
    presetMini(),
    presetIcons({
      /* options */
    }),
  ],
  variants: [
    (matcher, ctx) => {
      const startingStr = 'group-state-'
      if (!matcher.startsWith(startingStr))
        return matcher
      const variant = variantGetBracket(startingStr, matcher, ctx.generator.config.separators)
      if (variant) {
        // eslint-disable-next-line prefer-const
        let [match, rest] = variant
        if (match.startsWith('[') && match.endsWith(']')) {
          match = match.slice(1, -1)

          return {
            matcher: `group-[[data-state="${match}"]]:${rest}`,
          }
        }
      }
    },
    (matcher, ctx) => {
      const startingStr = 'state-'
      if (!matcher.startsWith(startingStr))
        return matcher

      const variant = variantGetBracket(startingStr, matcher, ctx.generator.config.separators)
      if (variant) {
        // eslint-disable-next-line prefer-const
        let [match, rest] = variant
        if (match.startsWith('[') && match.endsWith(']')) {
          match = match.slice(1, -1)

          return {
            matcher: `data-[state="${match}"]:${rest}`,
          }
        }
      }
    },
    (matcher, _ctx) => {
      if (!matcher.startsWith('highlighted:'))
        return matcher

      return {
        matcher: matcher.slice(12),
        selector: s => `${s}[data-highlighted]`,
      }
    },
  ],
})
