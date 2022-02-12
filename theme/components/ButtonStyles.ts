import { ComponentSingleStyleConfig } from '@chakra-ui/react'

export const ButtonStyles: ComponentSingleStyleConfig = {
  baseStyle: {
    fontSize: '14px',
    lineHeight: 'initial',
    width: 'auto',
    borderRadius: 0,
    maxHeight: 'unset',
    outlineOffset: '2px',
    _active: {
      transform: 'scale(0.96)',
      outlineColor: 'outline',
    },
    _focus: {
      outlineColor: 'outline',
    },
  },
  sizes: {
    large: {
      height: 50,
      px: 8,
      borderRadius: '2xl',
      fontSize: '18px',
      fontWeight: 'bold',
    },
  },
  variants: {
    primary: {
      bg: 'black',
      color: 'white',
      _hover: {
        boxShadow: '0px 0px 0px 2px #000000',
      },
      _loading: {
        _hover: {
          bg: 'black',
        },
      },
    },
    unstyled: {
      h: 'unset',
      color: 'text.low',
      _focus: {
        outline: 'none',
        color: 'text.medium',
      },
      _hover: {
        color: 'text.medium',
      },
      _active: {
        color: 'text.high',
        outlineColor: 'none',
      },
    },
  },
  defaultProps: {},
}

export default ButtonStyles
