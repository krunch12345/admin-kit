const DEFAULT_IMAGE_PROXY_PREFIX = '/image-proxy'

const imageProxyConfig = {
  prefix: DEFAULT_IMAGE_PROXY_PREFIX,
  hosts: new Set(),
}

/**
 * Configures same-origin proxying for hosts that block direct fetch via CORS.
 * @param {{ prefix?: string, hosts?: string[] }} [config]
 */
export const configureImageProxy = ({ prefix = DEFAULT_IMAGE_PROXY_PREFIX, hosts = [] } = {}) => {
  imageProxyConfig.prefix = prefix
  imageProxyConfig.hosts = new Set(hosts)
}

/**
 * Returns a same-origin proxy URL for configured CDN hosts.
 * @param {string} url
 * @returns {string|null}
 */
export const getProxiedImageFetchUrl = (url) => {
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
 * @param {string} url
 * @returns {string[]}
 */
export const getImageFetchAttempts = (url) => {
  const attempts = []
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
