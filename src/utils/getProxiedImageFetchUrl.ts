const DEFAULT_IMAGE_PROXY_PREFIX = '/image-proxy'

export interface ImageProxyConfig {
  prefix?: string
  hosts?: string[]
}

const imageProxyConfig = {
  prefix: DEFAULT_IMAGE_PROXY_PREFIX,
  hosts: new Set<string>(),
}

/**
 * Configures same-origin proxying for hosts that block direct fetch via CORS.
 */
export const configureImageProxy = ({
  prefix = DEFAULT_IMAGE_PROXY_PREFIX,
  hosts = [],
}: ImageProxyConfig = {}): void => {
  imageProxyConfig.prefix = prefix
  imageProxyConfig.hosts = new Set(hosts)
}

/**
 * Returns a same-origin proxy URL for configured CDN hosts.
 */
export const getProxiedImageFetchUrl = (url: string): string | null => {
  try {
    const parsed = new URL(url, window.location.origin)

    if (!imageProxyConfig.hosts.has(parsed.hostname)) {
      return null
    }

    return `${imageProxyConfig.prefix}${parsed.pathname}${parsed.search}`
  } catch {
    return null
  }
}

/**
 * Builds fetch URL candidates for clipboard copy.
 * For proxied hosts, only same-origin proxy is used (direct fetch is blocked by CORS).
 */
export const getImageFetchAttempts = (url: string): string[] => {
  const attempts: string[] = []
  const proxiedUrl = getProxiedImageFetchUrl(url)

  if (proxiedUrl) {
    attempts.push(proxiedUrl)
    return attempts
  }

  try {
    const parsed = new URL(url, window.location.origin)

    if (parsed.origin === window.location.origin) {
      attempts.push(parsed.href)
    } else {
      attempts.push(url)
    }
  } catch {
    attempts.push(url)
  }

  return [...new Set(attempts)]
}
