import { Provider, defaultChains, chain } from 'wagmi'
import { InjectedConnector } from 'wagmi/connectors/injected'
import { WalletConnectConnector } from 'wagmi/connectors/walletConnect'
import { ReactNode } from 'react'
import { infuraId, spoonWSProvider, spoonProvider } from 'lib/providers'

export const appNetwork =
  process.env.NEXT_PUBLIC_VERCEL_ENV !== 'production' ? chain.ropsten : chain.mainnet

const connectors = [
  new InjectedConnector({ chains: [appNetwork] }),
  new WalletConnectConnector({
    chains: [appNetwork],
    options: { infuraId, qrcode: false },
  }),
]

const isChainSupported = (chainId?: number) => defaultChains.some((x) => x.id === chainId)

const provider = ({ chainId }) => spoonProvider(isChainSupported(chainId) ? chainId : appNetwork.id)
const webSocketProvider = ({ chainId }) =>
  spoonWSProvider(isChainSupported(chainId) ? chainId : appNetwork.id)

export const WagmiProvider = ({ children }: { children: ReactNode }) => (
  <Provider
    autoConnect
    connectorStorageKey="connectcave"
    connectors={connectors}
    provider={provider}
    webSocketProvider={webSocketProvider}
  >
    {children}
  </Provider>
)
