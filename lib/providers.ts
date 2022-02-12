import { providers } from 'ethers'

export const alchemy = process.env.NEXT_PUBLIC_ALCHEMY_ID as string
export const etherscan = process.env.NEXT_PUBLIC_ETHERSCAN_API_KEY as string
export const infuraId = process.env.NEXT_PUBLIC_INFURA_ID as string

export const concaveRPC = 'https://api.concave.lol/'

export const spoonProvider = (chainId: number) =>
  new providers.FallbackProvider([
    new providers.JsonRpcProvider(concaveRPC, chainId),
    providers.getDefaultProvider(chainId, { alchemy, etherscan, infuraId }),
  ])

export const spoonWSProvider = (chainId: number) =>
  new providers.InfuraWebSocketProvider(chainId, infuraId)
