export function formatIOSMobile(uri: string, entry) {
  const encodedUri: string = encodeURIComponent(uri)
  return entry.universalLink
    ? `${entry.universalLink}/wc?uri=${encodedUri}`
    : entry.deepLink
    ? `${entry.deepLink}${entry.deepLink.endsWith(':') ? '//' : '/'}wc?uri=${encodedUri}`
    : ''
}

export function getMobileRegistryEntry(registry, name: string) {
  return registry.filter((entry) => entry.name.toLowerCase().includes(name.toLowerCase()))[0]
}

export function getMobileLinkRegistry(registry, whitelist?: string[]) {
  let links = registry
  if (whitelist) {
    links = whitelist.map((name: string) => getMobileRegistryEntry(registry, name)).filter(Boolean)
  }
  return links
}
