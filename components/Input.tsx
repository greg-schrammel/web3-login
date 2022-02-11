import { ChevronDownIcon } from '@chakra-ui/icons'
import { Button, Input, InputProps, Skeleton } from '@chakra-ui/react'
import React from 'react'
import NumberFormat, { NumberFormatProps } from 'react-number-format'

export const BaseInput = (props: InputProps & NumberFormatProps) => (
  <Input
    as={NumberFormat}
    thousandSeparator
    isNumericString
    variant="unstyled"
    placeholder="0.0"
    fontFamily="heading"
    fontWeight={700}
    fontSize={24}
    _placeholder={{ color: 'text.low' }}
    {...props}
  />
)

export const MaxBalance = ({ tokenName, balance, currentValue, ...props }) => (
  <Button
    borderRadius="md"
    py={0.2}
    px={2}
    bg="none"
    _hover={{ bg: 'bg.medium' }}
    _active={{ transform: 'scale(0.98)' }}
    gap={1}
    fontSize={12}
    transform={`scale(${currentValue > balance ? 1.1 : 1})`}
    fontWeight={currentValue > balance ? 'extrabold' : 'bold'}
    textColor={currentValue > balance ? 'text.high' : 'text.low'}
    height="auto"
    whiteSpace="nowrap"
    w="min"
    isDisabled={!balance}
    {...props}
  >
    <Skeleton isLoaded={balance} startColor="bg.light" endColor="bg.medium" textAlign="start">
      Your balance: <br />
      {Number(balance).toFixed(2)}
    </Skeleton>
  </Button>
)
