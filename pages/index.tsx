import React, { useState } from 'react'
import {
  Flex,
  Button,
  Text,
  Heading,
  HStack,
  Stack,
  Image,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
} from '@chakra-ui/react'
import { Layout } from '../components/Layout'
import { useAccount, useBalance, useNetwork } from 'wagmi'
import { Select } from 'components/Select'
import { BaseInput, MaxBalance } from 'components/Input'
import { addresses } from 'eth-sdk/addresses'
import { withIronSessionSsr } from 'iron-session/next'
import { sessionOptions } from 'lib/session'
import { useSession } from 'hooks/useSession'
import { NetworkID } from '@dethcrypto/eth-sdk/dist/abi-management/networks'

const miniAddress = (address) =>
  `${address.substr(0, 6)}...${address.substr(address.length - 6, address.length)}`

const networks = ['ethereum', 'fantom', 'binance', 'avalanche', 'arbitrum']
const NetworkIcon = ({ name }) => (
  <Image src={`/assets/networks/${name}.png`} width="18px" height="18px" alt="" />
)

const tokens = ['DAI', 'FRAX']
const TokenIcon = ({ name, size = '24px', ...props }) => (
  <Image
    src={`/assets/tokens/${name.toLowerCase()}.svg`}
    width={size}
    height={size}
    alt=""
    display="inline"
    {...props}
  />
)

const DisconnectButton = () => {
  const { user, signOut, isLoading } = useSession()
  return !user?.address ? null : (
    <Menu placement="bottom-end">
      <MenuButton as={Button} isLoading={isLoading} variant="unstyled">
        {miniAddress(user.address)}
      </MenuButton>
      <MenuList bg="bg.light" borderRadius="xl" px={1}>
        <MenuItem
          color="text.high"
          fontWeight="bold"
          borderRadius="lg"
          _hover={{
            bg: 'bg.medium',
          }}
          _active={{
            bg: 'bg.medium',
            outlineColor: 'none',
          }}
          _focus={{
            bg: 'bg.medium',
          }}
          onClick={signOut}
        >
          Disconnect
        </MenuItem>
      </MenuList>
    </Menu>
  )
}

function ImBridginn({ user }) {
  const [n1, sn1] = useState<typeof networks[number]>('ethereum')
  const [n2, sn2] = useState<typeof networks[number]>('fantom')
  const [token, setToken] = useState<typeof tokens[number]>('DAI')
  const [amount, onChangeAmount] = useState<string>()

  const [account] = useAccount()
  const [network] = useNetwork()
  const [{ data: inputTokenBalance }] = useBalance({
    addressOrName: account.data?.address,
    token: addresses[NetworkID.MAINNET]?.[token.toLowerCase()],
    formatUnits: 18,
  })

  return (
    <Layout>
      <Stack
        mt={100}
        mx="auto"
        gap={6}
        align="center"
        maxW={400}
        borderRadius="3xl"
        bg="bg.light"
        p={8}
      >
        <HStack justify="space-between" w="100%">
          <Heading fontSize="24px" fontWeight="extrabold">
            Bridginn
          </Heading>
          <DisconnectButton />
        </HStack>
        <HStack w="full">
          <Flex flex={1} justify="right">
            <Select options={networks} optionIcon={NetworkIcon} selected={n1} onSelect={sn1} />
          </Flex>
          <Text textColor="text.medium">to</Text>
          <Flex flex={1} justify="left">
            <Select options={networks} optionIcon={NetworkIcon} selected={n2} onSelect={sn2} />
          </Flex>
        </HStack>
        <Stack direction="row">
          <BaseInput
            value={amount}
            onValueChange={({ value }) => {
              onChangeAmount(value)
            }}
            fontSize="96px"
            textAlign="right"
          />
          <Stack justify="center" spacing={1}>
            <Select
              size="large"
              options={tokens}
              optionIcon={TokenIcon}
              selected={token}
              onSelect={setToken}
            />
            <MaxBalance
              tokenName={token}
              balance={inputTokenBalance?.formatted}
              currentValue={amount}
            />
          </Stack>
        </Stack>
        <Stack align="center" w="full">
          <Text textColor="text.medium">
            {`you'll`} receive{' '}
            <Text as="span" color="black">
              0.998 <TokenIcon name={token} size="18px" verticalAlign="sub" />
            </Text>{' '}
            on {n2}
          </Text>
          <Button variant="primary" size="large" w="full">{`Let's bridge!!`}</Button>
        </Stack>
      </Stack>
    </Layout>
  )
}

export const getServerSideProps = withIronSessionSsr(async ({ req, res }) => {
  const user = req.session.siwe

  if (!user)
    return {
      redirect: {
        statusCode: 302,
        destination: '/connect',
      },
    }

  return {
    props: { user },
  }
}, sessionOptions)

export default ImBridginn
