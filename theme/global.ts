import { mode, Styles } from '@chakra-ui/theme-tools'

const globalStyles: Styles = {
  global: (props) => ({
    html: {
      fontFamily: 'body',
      lineHeight: 'base',
    },
    body: {
      minHeight: '100vh', // temporary
    },
  }),
}

export default globalStyles
