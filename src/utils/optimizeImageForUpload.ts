/** Longest side cap; matches backend gentle compress profile. */
export const OPTIMIZE_MAX_SIDE = 2560

/** JPEG encode quality for client-side pre-upload optimize. */
export const OPTIMIZE_JPEG_QUALITY = 0.82

/** Skip optimize when the original is already this small (bytes). */
export const OPTIMIZE_SKIP_UNDER_BYTES = 1.5 * 1024 * 1024

const RASTER_MIME_PREFIX = 'image/'
const NON_RASTER_OR_UNSAFE = new Set([
  'image/svg+xml',
  'image/heic',
  'image/heif',
  'image/heic-sequence',
  'image/heif-sequence',
])

export interface ImageDimensions {
  width: number
  height: number
}

export interface ShouldSkipOptimizeOptions {
  skipCompression?: boolean
}

export interface OptimizeImageOptions extends ShouldSkipOptimizeOptions {
  maxSide?: number
  quality?: number
}

export interface OptimizableFile {
  name?: string
  type?: string
  size?: number
}

export const getFileNameStem = (fileName = ''): string => {
  const base = String(fileName || 'image').split(/[/\\]/).pop() || 'image'
  const withoutExt = base.replace(/\.[^.]+$/, '')
  return withoutExt || 'image'
}

export const buildOptimizedJpegFileName = (fileName?: string): string => `${getFileNameStem(fileName)}.jpg`

export const computeTargetDimensions = (
  width: number,
  height: number,
  maxSide: number = OPTIMIZE_MAX_SIDE,
): ImageDimensions => {
  const w = Math.max(0, Number(width) || 0)
  const h = Math.max(0, Number(height) || 0)

  if (!w || !h) {
    return { width: w, height: h }
  }

  const longest = Math.max(w, h)

  if (longest <= maxSide) {
    return { width: w, height: h }
  }

  const scale = maxSide / longest

  return {
    width: Math.max(1, Math.round(w * scale)),
    height: Math.max(1, Math.round(h * scale)),
  }
}

export const shouldSkipOptimizeImage = (
  file: OptimizableFile | null | undefined,
  options: ShouldSkipOptimizeOptions = {},
): boolean => {
  if (!file || options.skipCompression) {
    return true
  }

  const type = String(file.type || '').toLowerCase()

  if (!type.startsWith(RASTER_MIME_PREFIX) || NON_RASTER_OR_UNSAFE.has(type)) {
    return true
  }

  if (typeof file.size === 'number' && file.size > 0 && file.size < OPTIMIZE_SKIP_UNDER_BYTES) {
    return true
  }

  return false
}

/**
 * Loads an image via object URL. Rejects if the browser cannot decode the file.
 */
const loadImageElement = (file: File): Promise<HTMLImageElement> => new Promise((resolve, reject) => {
  const url = URL.createObjectURL(file)
  const image = new Image()

  const cleanup = (): void => {
    URL.revokeObjectURL(url)
  }

  image.onload = () => {
    cleanup()
    resolve(image)
  }

  image.onerror = () => {
    cleanup()
    reject(new Error('Image decode failed'))
  }

  image.src = url
})

const canvasToJpegBlob = (canvas: HTMLCanvasElement, quality: number): Promise<Blob> => new Promise((resolve, reject) => {
  canvas.toBlob(
    (blob) => {
      if (!blob) {
        reject(new Error('Canvas encode failed'))
        return
      }

      resolve(blob)
    },
    'image/jpeg',
    quality,
  )
})

/**
 * Client-side resize + JPEG encode before upload.
 * Returns the original file when skip rules apply or decode/encode fails (e.g. HEIC).
 */
export const optimizeImageForUpload = async (
  file: File,
  options: OptimizeImageOptions = {},
): Promise<File> => {
  if (shouldSkipOptimizeImage(file, options)) {
    return file
  }

  const maxSide = options.maxSide !== undefined && options.maxSide > 0
    ? options.maxSide
    : OPTIMIZE_MAX_SIDE
  const quality = typeof options.quality === 'number'
    ? options.quality
    : OPTIMIZE_JPEG_QUALITY

  try {
    const image = await loadImageElement(file)
    const { width, height } = computeTargetDimensions(
      image.naturalWidth || image.width,
      image.naturalHeight || image.height,
      maxSide,
    )

    if (!width || !height) {
      return file
    }

    const canvas = document.createElement('canvas')
    canvas.width = width
    canvas.height = height

    const ctx = canvas.getContext('2d')

    if (!ctx) {
      return file
    }

    ctx.drawImage(image, 0, 0, width, height)

    const blob = await canvasToJpegBlob(canvas, quality)

    if (typeof file.size === 'number' && blob.size >= file.size) {
      return file
    }

    return new File([blob], buildOptimizedJpegFileName(file.name), {
      type: 'image/jpeg',
      lastModified: Date.now(),
    })
  } catch {
    return file
  }
}
