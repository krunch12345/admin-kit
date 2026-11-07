export const CROP_TOLERANCE = 2
export const JPEG_QUALITY = 0.95

export type PixelCrop = {
  unit?: string
  x: number
  y: number
  width: number
  height: number
}

export const toNaturalCrop = (crop: PixelCrop, image: HTMLImageElement) => {
  if (crop.unit === '%') {
    return {
      x: (crop.x / 100) * image.naturalWidth,
      y: (crop.y / 100) * image.naturalHeight,
      width: (crop.width / 100) * image.naturalWidth,
      height: (crop.height / 100) * image.naturalHeight,
    }
  }

  const scaleX = image.naturalWidth / image.width
  const scaleY = image.naturalHeight / image.height

  return {
    x: crop.x * scaleX,
    y: crop.y * scaleY,
    width: crop.width * scaleX,
    height: crop.height * scaleY,
  }
}

export const isCropChanged = (
  crop: PixelCrop | null | undefined,
  image: HTMLImageElement | null | undefined,
): boolean => {
  if (!crop?.width || !crop?.height || !image) return false

  const { x, y, width, height } = toNaturalCrop(crop, image)
  const coversFullWidth = x <= CROP_TOLERANCE
    && Math.abs(width + x - image.naturalWidth) <= CROP_TOLERANCE
  const coversFullHeight = y <= CROP_TOLERANCE
    && Math.abs(height + y - image.naturalHeight) <= CROP_TOLERANCE

  return !(coversFullWidth && coversFullHeight)
}

export const getCroppedImg = (
  image: HTMLImageElement,
  crop: PixelCrop,
): Promise<{ blob: Blob & { name?: string }, fileUrl: string }> => {
  const { x, y, width, height } = toNaturalCrop(crop, image)

  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height

  const ctx = canvas.getContext('2d')
  if (!ctx) {
    return Promise.reject(new Error('Canvas 2D context unavailable'))
  }

  ctx.drawImage(
    image,
    x,
    y,
    width,
    height,
    0,
    0,
    width,
    height,
  )

  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (!blob) {
        reject(new Error('Failed to create cropped image blob'))
        return
      }

      const namedBlob = blob as Blob & { name?: string }
      namedBlob.name = 'cropped.jpg'
      const fileUrl = URL.createObjectURL(blob)
      resolve({ blob: namedBlob, fileUrl })
    }, 'image/jpeg', JPEG_QUALITY)
  })
}
