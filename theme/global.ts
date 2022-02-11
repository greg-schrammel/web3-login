import { mode, Styles } from '@chakra-ui/theme-tools'

const globalStyles: Styles = {
  global: (props) => ({
    html: {
      fontFamily: 'body',
      lineHeight: 'base',
    },
    body: {
      minHeight: '140vh', // temporary
    },
  }),
}

export default globalStyles
