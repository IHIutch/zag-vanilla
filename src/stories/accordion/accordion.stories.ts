import accordionMultiple from './examples/multiple.html?raw'
import accordionSingle from './examples/single.html?raw'

export default {
  title: 'Accordion',
}

export const Single = {
  render: () => accordionSingle,
}

export const Multiple = {
  render: () => accordionMultiple,
}
