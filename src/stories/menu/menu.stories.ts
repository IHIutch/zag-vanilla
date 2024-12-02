import menuBasic from './examples/basic.html?raw'
import menuCheckbox from './examples/checkbox.html?raw'
import menuRadio from './examples/radio.html?raw'
import menuGrouped from './examples/grouped.html?raw'
import menuIcons from './examples/with-icons.html?raw'
import menuShortcuts from './examples/shortcuts.html?raw'
// import menuSubmenu from './examples/submenu.html?raw'

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

export const Grouped = {
  render: () => menuGrouped,
};

export const WithIcons = {
  render: () => menuIcons,
};

export const WithShortcuts = {
  render: () => menuShortcuts,
};

// export const Submenu = {
//   render: () => menuSubmenu,
// };
