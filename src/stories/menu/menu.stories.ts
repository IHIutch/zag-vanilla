import menuBasic from './examples/basic.html?raw'
import menuCheckbox from './examples/checkbox.html?raw'
import menuRadio from './examples/radio.html?raw'

export default {
  title: 'Menu',
}

export const Basic = {
  render: () => menuBasic,
};

export const Checkbox = {
  render: () => menuCheckbox,
};

export const Radio = {
  render: () => menuRadio,
};

