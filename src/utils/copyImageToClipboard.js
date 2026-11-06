import { getImageFetchAttempts } from './getProxiedImageFetchUrl.js'

/**
 * Converts a loaded image element to a PNG blob.
 * @param {HTMLImageElement} img
 * @returns {Promise<Blob>}
 */
const imageToPngBlob = (img) => new Promise((resolve, reject) => {
  const canvas = document.createElement('canvas')
  canvas.width = img.naturalWidth
  canvas.height = img.naturalHeight
  canvas.getContext('2d').drawImage(img, 0, 0)

  canvas.toBlob((blob) => {
    if (blob) {
      resolve(blob)
      return
    }

    reject(new Error('Failed to create image blob'))
  }, 'image/png')
})

/**
 * Converts a fetched blob to PNG via object URL (same-origin blob, no taint).
 * @param {Blob} blob
 * @returns {Promise<Blob>}
 */
const blobToPngBlob = (blob) => {
  if (blob.type === 'image/png') {
    return Promise.resolve(blob)
  }

  const objectUrl = URL.createObjectURL(blob)

  return new Promise((resolve, reject) => {
    const img = new Image()

    img.onload = () => {
      URL.revokeObjectURL(objectUrl)
      imageToPngBlob(img).then(resolve).catch(reject)
    }

    img.onerror = () => {
      URL.revokeObjectURL(objectUrl)
      reject(new Error('Failed to decode image'))
    }

    img.src = objectUrl
  })
}

/**
 * Fetches image bytes and converts them to PNG.
 * @param {string} url
 * @returns {Promise<Blob>}
 */
const fetchImageAsPngBlob = async (url) => {
  let lastError = new Error('Failed to fetch image')

  for (const attemptUrl of getImageFetchAttempts(url)) {
    try {
      const response = await fetch(attemptUrl)

      if (!response.ok) {
        throw new Error('Failed to fetch image')
      }

      return await blobToPngBlob(await response.blob())
    } catch (error) {
      lastError = error
    }
  }

  throw lastError
}

/**
 * Checks whether URL points to the current origin.
 * @param {string} url
 * @returns {boolean}
 */
const isSameOriginUrl = (url) => {
  try {
    return new URL(url, window.location.origin).origin === window.location.origin
  } catch {
    return false
  }
}

/**
 * Resolves image bytes as PNG for clipboard write.
 * @param {object} params
 * @param {string} params.url
 * @param {HTMLImageElement} [params.imgElement]
 * @returns {Promise<Blob>}
 */
const resolvePngBlob = async ({ url, imgElement }) => {
  if (isSameOriginUrl(url) && imgElement?.complete && imgElement.naturalWidth > 0) {
    try {
      return await imageToPngBlob(imgElement)
    } catch {
      // Fall through to network loading.
    }
  }

  return fetchImageAsPngBlob(url)
}

/**
 * Legacy fallback: copy image as HTML (data URL) via execCommand.
 * Used when ClipboardItem image write is unavailable (e.g. some Firefox builds).
 * @param {Blob} blob
 * @returns {Promise<void>}
 */
const copyImageViaExecCommand = (blob) => new Promise((resolve, reject) => {
  const reader = new FileReader()

  reader.onload = () => {
    const container = document.createElement('div')
    container.contentEditable = 'true'
    container.style.cssText = 'position:fixed;left:-9999px;top:0;'

    const img = document.createElement('img')
    img.src = String(reader.result)
    container.appendChild(img)
    document.body.appendChild(container)

    const selection = window.getSelection()
    const range = document.createRange()
    range.selectNode(img)
    selection.removeAllRanges()
    selection.addRange(range)

    try {
      const ok = document.execCommand('copy')
      selection.removeAllRanges()
      container.remove()

      if (ok) {
        resolve()
        return
      }

      reject(new Error('execCommand copy failed'))
    } catch (error) {
      selection.removeAllRanges()
      container.remove()
      reject(error)
    }
  }

  reader.onerror = () => reject(new Error('Failed to read image blob'))
  reader.readAsDataURL(blob)
})

/**
 * Writes a PNG blob to the clipboard using a resolved Blob (Firefox/Safari).
 * @param {Blob} blob
 * @returns {Promise<void>}
 */
const writePngBlobToClipboard = async (blob) => {
  await navigator.clipboard.write([
    new ClipboardItem({
      'image/png': blob,
    }),
  ])
}

/**
 * Copies an image from URL to the system clipboard.
 * Chrome needs ClipboardItem created synchronously with a Promise to keep user activation.
 * Firefox/Safari reject Promise values — fall back to a resolved Blob, then execCommand.
 * @param {object} params
 * @param {string} params.url
 * @param {HTMLImageElement} [params.imgElement]
 * @returns {Promise<void>}
 */
export const copyImageToClipboard = ({ url, imgElement }) => {
  if (typeof ClipboardItem === 'undefined' || !navigator.clipboard?.write) {
    return Promise.reject(new Error('Clipboard API not supported'))
  }

  const pngBlobPromise = resolvePngBlob({ url, imgElement })

  let writePromise

  try {
    writePromise = navigator.clipboard.write([
      new ClipboardItem({
        'image/png': pngBlobPromise,
      }),
    ])
  } catch {
    writePromise = pngBlobPromise.then(writePngBlobToClipboard)
  }

  return writePromise.catch(async (error) => {
    const blob = await pngBlobPromise

    try {
      await writePngBlobToClipboard(blob)
    } catch {
      try {
        await copyImageViaExecCommand(blob)
      } catch {
        throw error
      }
    }
  })
}
