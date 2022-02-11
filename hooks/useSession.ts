import { useRouter } from 'next/router'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { SiweMessage } from 'siwe'
import useSWR from 'swr'
import { Connector, useAccount, useConnect, useNetwork, useSignMessage } from 'wagmi'

const sessionFetcher = (path, options = undefined) =>
  fetch(`/api/session/${path}`, options).then((res) => res.json())

const createSiweMessage = async ({ address, chainId }) => {
  const { nonce } = await sessionFetcher('nonce')
  return new SiweMessage({
    domain: window.location.host,
    address,
    statement: 'Sign in',
    uri: window.location.origin,
    version: '1',
    chainId,
    nonce,
  })
}

const getState = ({ user, error, loading }: ResponseType) => {
  if (!user && !error && !loading) return 'idle'
  if (loading) return 'loading'
  if (user) return 'succeded'
  if (error) return 'errored'
  return 'idle'
}

type User = {
  address: string
}

type ResponseType = {
  user?: User
  error?: Error
  loading?: boolean
}

export const useSession = ({ redirectIfNotLogged } = { redirectIfNotLogged: true }) => {
  const [account, disconnect] = useAccount()
  const [network] = useNetwork()
  const [state, setState] = useState<ResponseType>({})
  const [, signMessage] = useSignMessage()

  const signIn = useCallback(async () => {
    try {
      const address = account.data?.address
      const chainId = network.data?.chain?.id
      if (!address || !chainId) return

      setState((x) => ({ ...x, error: undefined, loading: true }))

      const message = await createSiweMessage({ address, chainId })
      const signRes = await signMessage({ message: message.prepareMessage() })
      if (signRes.error) throw signRes.error

      // Verify signature
      const verifyRes = await sessionFetcher('verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message, signature: signRes.data }),
      })
      if (!verifyRes.ok) throw new Error('Error verifying message')

      setState((x) => ({ ...x, user: { address }, loading: false }))
    } catch (error) {
      console.log(error)
      setState((x) => ({ ...x, error, loading: false }))
    }
  }, [account.data?.address, network.data?.chain?.id, signMessage])

  const signOut = useCallback(async () => {
    disconnect()
    await sessionFetcher('logout')
    router.replace('/connect')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [disconnect])

  const router = useRouter()
  useEffect(() => {
    if (redirectIfNotLogged && router.route !== '/connect') router.replace('/connect')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [redirectIfNotLogged])
  const { data: user, error } = useSWR('me', sessionFetcher, {
    revalidateOnFocus: true,
  })

  const _state = getState(state)
  const isIdle = _state === 'idle'
  const isLoading = _state === 'loading'
  const isErrored = _state === 'errored'
  const isSuccess = _state === 'succeded'

  return useMemo(
    () => ({
      signOut,
      signIn,
      user,
      error,
      state: _state,
      isLoading,
      isErrored,
      isSuccess,
      isIdle,
    }),
    [_state, error, isErrored, isIdle, isLoading, isSuccess, signIn, signOut, user],
  )
}
