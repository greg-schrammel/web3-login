import React, { useEffect, useState } from 'react'
import { Button, Text, Heading, Stack, Image, SimpleGrid } from '@chakra-ui/react'
import { useAccount, useConnect } from 'wagmi'
import { Layout } from 'components/Layout'
import QRCode from 'components/qrCode'
import { useSession } from 'hooks/useSession'
import { useIsMounted } from 'hooks/useIsMounted'
import { withIronSessionSsr } from 'iron-session/next'
import { sessionOptions } from 'lib/session'
import { useRouter } from 'next/router'
import { formatRegistry, walletRegistryURL } from 'lib/walletconnect/registry'
import useSWRImmutable from 'swr/immutable'
import { isMobile } from 'lib/walletconnect/env'
import { formatIOSMobile, getMobileLinkRegistry } from 'lib/walletconnect/mobile'
import { ButtonLink } from 'components/ButtonLink'

const fetchWalletConnectLinks = async () => {
  const registry = await fetch(walletRegistryURL).then((x) => x.json())
  return getMobileLinkRegistry(formatRegistry(registry)).slice(0, 5)
}

const walletImgSize = '32px'

const WalletConnect = () => {
  const [{ data: connectData }, connect] = useConnect()
  const wcConnector = connectData.connectors.find((c) => c.id === 'walletConnect')
  const provider = wcConnector.getProvider()

  const { data: links = [] } = useSWRImmutable(isMobile() && 'registry', fetchWalletConnectLinks)

  const [uri, setUri] = useState<string>()
  useEffect(() => {
    ;(async () => {
      if (provider.connector.key) {
        if (!uri) setUri(provider.connector.uri)
        return
      }
      await provider.connector.createSession({ chainId: 1 })
      if (!provider.connector.uri.endsWith('key=')) setUri(provider.connector.uri)
      connect(wcConnector)
    })()
  }, [connect, connectData.connectors, provider.connector, wcConnector, uri])

  if (!uri) return null

  return isMobile() ? (
    <SimpleGrid columns={3} gap={4}>
      {links.map((wallet) => (
        <ButtonLink
          key={wallet.name}
          href={formatIOSMobile(uri, wallet)}
          bg="none"
          flexDirection="column"
          color="black"
          variant="primary"
          size="large"
          _hover={{ bg: 'bg.medium' }}
          p={2}
          gap={2}
          h="auto"
        >
          <Image
            src={wallet.logo}
            alt=""
            minH={walletImgSize}
            minW={walletImgSize}
            w={walletImgSize}
            h={walletImgSize}
            borderRadius="lg"
          />
          <Text fontSize="14px">{wallet.shortName}</Text>
        </ButtonLink>
      ))}
    </SimpleGrid>
  ) : (
    <QRCode logoSize={75} size={336} value={uri} logoSrc="/assets/concave-logo.png" />
  )
}

function Connect() {
  const [{ data: connectData }, connect] = useConnect()
  const injectedConnector = connectData.connectors.find((c) => c.id === 'injected')

  return (
    <>
      {injectedConnector.ready && (
        <>
          <Button
            variant="primary"
            size="large"
            w="full"
            onClick={() => connect(injectedConnector)}
          >
            Connect Wallet
          </Button>
        </>
      )}
      <Text color="text.medium">{injectedConnector.ready && 'or'} Login with Wallet Connect</Text>
      <WalletConnect />
    </>
  )
}

function SignIn() {
  const { signIn, user, isLoading } = useSession()
  const [, disconnect] = useAccount()

  const router = useRouter()
  useEffect(() => {
    signIn()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (user) router.replace('/')
  }, [user]) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
      <Button
        isLoading={isLoading}
        loadingText="waiting for wallet sign"
        variant="primary"
        size="large"
        w="full"
        onClick={() => signIn().then(() => router.replace('/'))}
      >
        Sign in to continue
      </Button>
      <Button variant="unstyled" onClick={disconnect}>
        Disconnect
      </Button>
    </>
  )
}

function Login() {
  const [{ data: connectData }] = useConnect()
  const isMounted = useIsMounted()

  return (
    <Layout>
      <Stack
        mt={100}
        mx="auto"
        gap={3}
        // borderWidth={4}
        borderColor="bg.medium"
        align="center"
        maxW={400}
        borderRadius="3xl"
        bg="bg.light"
        p={8}
      >
        <Heading fontSize="24px" fontWeight="extrabold" w="full" mb={3}>
          Web3 Login
        </Heading>
        {isMounted && !connectData.connected ? <Connect /> : <SignIn />}
      </Stack>
    </Layout>
  )
}

export const getServerSideProps = withIronSessionSsr(async ({ req, res }) => {
  const user = req.session.siwe

  if (user)
    return {
      redirect: {
        statusCode: 302,
        destination: '/',
      },
    }

  return { props: {} }
}, sessionOptions)

export default Login
