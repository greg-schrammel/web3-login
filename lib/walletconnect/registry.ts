const API_URL = 'https://registry.walletconnect.org'

export const walletRegistryURL = `${API_URL}/data/wallets.json`
export const dappRegistryURL = `${API_URL}/data/dapps.json`
export const appLogoURL = (id) => `${API_URL}/logo/sm/${id}.jpeg`

export function formatRegistry(registry, platform: 'mobile' | 'desktop' = 'mobile') {
  return Object.values<any>(registry)
    .filter((entry) => !!entry[platform].universal || !!entry[platform].native)
    .map((entry) => ({
      name: entry.name || '',
      shortName: entry.metadata.shortName || '',
      color: entry.metadata.colors.primary || '',
      colors: entry.metadata.colors || {},
      logo: entry.id ? appLogoURL(entry.id) : '',
      universalLink: entry[platform].universal || '',
      deepLink: entry[platform].native || '',
    }))
}
