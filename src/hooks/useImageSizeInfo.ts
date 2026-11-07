import { useEffect, useState } from 'react'
import {
  fetchImageByteSize,
  loadImageDimensions,
} from '../utils/imageSize'

export interface ResolvedImageSizeInfo {
  width: number | null
  height: number | null
  bytes: number | null
}

export interface UseImageSizeInfoParams {
  src?: string
  file?: File | null
}

const EMPTY_SIZE_INFO: ResolvedImageSizeInfo = {
  width: null,
  height: null,
  bytes: null,
}

/**
 * Resolves display dimensions and byte size for a local File and/or remote URL.
 */
export const useImageSizeInfo = ({ src = '', file = null }: UseImageSizeInfoParams = {}): ResolvedImageSizeInfo => {
  const [info, setInfo] = useState<ResolvedImageSizeInfo>(EMPTY_SIZE_INFO)

  useEffect(() => {
    let cancelled = false
    let objectUrl = ''

    setInfo(EMPTY_SIZE_INFO)

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
