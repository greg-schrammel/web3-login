import { spoonProvider } from 'lib/providers'

export const getEnsData = async (address) => {
  const name = await spoonProvider(1).lookupAddress(address)
  const avatar = name && (await spoonProvider(1).getAvatar(name))

  return { avatar, name }
}
