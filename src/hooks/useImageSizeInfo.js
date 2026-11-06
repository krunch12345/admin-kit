import { useEffect, useState } from 'react'
import {
  fetchImageByteSize,
  loadImageDimensions,
} from '../utils/imageSize.js'

/**
 * @typedef {object} ImageSizeInfo
 * @property {number|null} width
 * @property {number|null} height
 * @property {number|null} bytes
 */

/**
 * Resolves display dimensions and byte size for a local File and/or remote URL.
 * @param {{ src?: string, file?: File|null }} params
 * @returns {ImageSizeInfo}
 */
export const useImageSizeInfo = ({ src = '', file = null } = {}) => {
  const [info, setInfo] = useState(/** @type {ImageSizeInfo} */ ({
    width: null,
    height: null,
    bytes: null,
  }))

  useEffect(() => {
    let cancelled = false
    let objectUrl = ''

    setInfo({ width: null, height: null, bytes: null })

    const resolve = async () => {
      if (file) {
        const nextBytes = file.size
        objectUrl = URL.createObjectURL(file)
        const dimensions = await loadImageDimensions(objectUrl)

        if (!cancelled) {
          setInfo({
            width: dimensions?.width ?? null,
            height: dimensions?.height ?? null,
            bytes: nextBytes,
          })
        }

        return
      }

      if (!src) {
        return
      }

      const [dimensions, bytes] = await Promise.all([
        loadImageDimensions(src),
        fetchImageByteSize(src),
      ])

      if (!cancelled) {
        setInfo({
          width: dimensions?.width ?? null,
          height: dimensions?.height ?? null,
          bytes,
        })
      }
    }

    resolve()

    return () => {
      cancelled = true

      if (objectUrl) {
        URL.revokeObjectURL(objectUrl)
      }
    }
  }, [file, src])

  return info
}
