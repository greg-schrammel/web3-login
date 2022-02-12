import React from 'react'
import { Button, Text, Stack, Image, Box } from '@chakra-ui/react'
import { Layout } from '../components/Layout'
import { withIronSessionSsr } from 'iron-session/next'
import { sessionOptions } from 'lib/session'
import { useSession } from 'hooks/useSession'
import { getEnsData } from 'lib/ens'
import Blockies from 'react-blockies'
import { useRouter } from 'next/router'

const miniAddress = (address) =>
  `${address.substr(0, 6)}...${address.substr(address.length - 6, address.length)}`

const UserInfo = ({ user }) => (
  <Stack direction="row" align="center" w="full" spacing={4}>
    {user.ens.avatar ? (
      <Image src={user.ens.avatar} alt="" h="40px" w="40px" />
    ) : (
      <Box sx={{ overflow: 'hidden', borderRadius: 'full' }}>
        <Blockies
          seed={user.address}
          style={{ borderRadius: '50%' }}
          size={10}
          color="#dfe"
          spotColor="#000"
        />
      </Box>
    )}
    <Stack spacing={0}>
      {user.ens.name && <Text>{user.ens.name}</Text>}
      <Text color={user.ens.name ? 'text.medium' : 'text.high'}>{miniAddress(user.address)}</Text>
    </Stack>
  </Stack>
)

function Web3Login({ user }) {
  const { signOut } = useSession()
  const router = useRouter()
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
        <UserInfo user={user} />
        <Button
          size="large"
          w="full"
          variant="primary"
          onClick={() => signOut().then(() => router.replace('/connect'))}
        >
          Disconnect
        </Button>
      </Stack>
    </Layout>
  )
}

export const getServerSideProps = withIronSessionSsr(async ({ req, res }) => {
  const siwe = req.session.siwe

  if (!siwe)
    return {
      redirect: {
        statusCode: 302,
        destination: '/connect',
      },
    }

  const ens = await getEnsData(siwe.address)

  return {
    props: { user: { ...siwe, ens } },
  }
}, sessionOptions)

export default Web3Login
