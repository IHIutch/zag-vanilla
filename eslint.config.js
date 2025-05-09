import antfu from '@antfu/eslint-config'

export default antfu({
  formatters: {
    html: true,
    prettierOptions: {
      singleAttributePerLine: true,
    },
  },
  unocss: true,
})
