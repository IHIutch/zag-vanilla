import pintInputBasic from './examples/basic.html?raw'
import pintInputMask from './examples/mask.html?raw'
import pintInputOtp from './examples/otp.html?raw'

export default {
  title: 'Pin Input',
}

export const Basic = {
  render: () => pintInputBasic,
}

export const Mask = {
  render: () => pintInputMask,
}

export const OTP = {
  render: () => pintInputOtp,
}
