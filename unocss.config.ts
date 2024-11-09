import { defineConfig, presetIcons, presetUno, presetWind } from 'unocss'

export default defineConfig({
  content: {
    filesystem: [
      "./src/**/*.html",
    ],
  },
  presets: [
    presetUno(),
    // presetWind(),
    presetIcons({
      /* options */
    }),
  ],
})
