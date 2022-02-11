import { ChevronDownIcon } from '@chakra-ui/icons'
import { Button, Menu, MenuButton, MenuItem, MenuItemProps, MenuList, Text } from '@chakra-ui/react'
import React from 'react'

const selectItemStyles = {
  borderRadius: 'xl',
  py: 1,
  px: 2,
  height: 'auto',
  fontWeight: 600,
  borderColor: 'bg.medium',
  bgColor: 'transparent',
  _hover: { bgColor: 'bg.medium' },
  _active: { bgColor: 'bg.medium' },
  _focus: { bgColor: 'bg.medium' },
}

const SelectItem = ({
  name,
  leftIcon,
  ...props
}: { name: string; leftIcon: JSX.Element } & MenuItemProps) => (
  <MenuItem sx={{ ...selectItemStyles, py: 2, px: 3 }} {...props}>
    {leftIcon}
    <Text ml={2}>{name}</Text>
  </MenuItem>
)

const bringToBeginning = (arr, elem) => arr.sort((x, y) => (x == elem ? -1 : y == elem ? 1 : 0))

interface SelectProps {
  options: string[]
  selected: string
  onSelect: (selected: string) => void
  optionIcon: React.FC<{ name: string }>
  size?: 'large'
}

export const Select = ({
  options,
  selected,
  onSelect,
  optionIcon: OptionIcon,
  size,
}: SelectProps) => {
  return (
    <Menu placement="bottom-end" autoSelect>
      <MenuButton
        as={Button}
        bgColor={'white'}
        sx={{
          ...selectItemStyles,
          ...(size === 'large' && {
            borderRadius: 'full',
            fontSize: '24px',
            px: 4,
          }),
        }}
        leftIcon={<OptionIcon name={selected} />}
        // rightIcon={<ChevronDownIcon />}
        minW="max"
        maxW="min"
        _hover={{ bgColor: 'bg.medium' }}
        _active={{ bgColor: 'bg.medium' }}
      >
        <Text minW="min" fontWeight={size === 'large' ? 'extrabold' : 'bold'}>
          {selected}
        </Text>
      </MenuButton>
      <MenuList bg="bg.light" borderRadius="2xl" minW="min" px={1}>
        {bringToBeginning(options, selected).map((name) => (
          <SelectItem
            key={name}
            name={name}
            leftIcon={<OptionIcon name={name} />}
            onClick={() => onSelect(name)}
          />
        ))}
      </MenuList>
    </Menu>
  )
}
