import { JPEG_QUALITY } from './cropImage'

export type RotateDirection = 'clockwise' | 'counterClockwise'

const loadImage = (src: string): Promise<HTMLImageElement> => (
  new Promise((resolve, reject) => {
    const image = new Image()
    image.onload = () => resolve(image)
    image.onerror = () => reject(new Error('Failed to load image for rotation'))
    image.src = src
  })
)

/**
 * Rotates an image 90° and returns a JPEG blob plus object URL preview.
 */
export const rotateImage90 = async (
  source: string,
  direction: RotateDirection,
): Promise<{ blob: Blob; fileUrl: string }> => {
  const image = await loadImage(source)
  const { naturalWidth, naturalHeight } = image

  if (!naturalWidth || !naturalHeight) {
    throw new Error('Image has no dimensions')
  }

  const canvas = document.createElement('canvas')
  const context = canvas.getContext('2d')

  if (!context) {
    throw new Error('Canvas 2D context unavailable')
  }

  const clockwise = direction === 'clockwise'
  canvas.width = naturalHeight
  canvas.height = naturalWidth

  if (clockwise) {
    context.translate(canvas.width, 0)
    context.rotate(Math.PI / 2)
  } else {
    context.translate(0, canvas.height)
    context.rotate(-Math.PI / 2)
  }

  context.drawImage(image, 0, 0)

  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (!blob) {
        reject(new Error('Failed to create rotated image blob'))
        return
      }

      resolve({
        blob,
        fileUrl: URL.createObjectURL(blob),
      })
    }, 'image/jpeg', JPEG_QUALITY)
  })
}