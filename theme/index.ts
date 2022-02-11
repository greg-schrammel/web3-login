import { ChakraTheme, extendTheme, theme as baseTheme } from '@chakra-ui/react'
import global from './global'
import colors from './colors'
import Button from './components/ButtonStyles'
import Tooltip from './components/TooltipStyles'
import Text from './components/TextStyles'
import { fonts, shadows } from './foundations'

const theme = extendTheme({
  config: { initialColorMode: 'light', cssVarPrefix: 'concave' },
  styles: global,
  fonts,
  colors,
  shadows,
  components: {
    Button,
    Tooltip,
    Text,
  },
}) as ChakraTheme

export type Theme = typeof theme
export default theme
