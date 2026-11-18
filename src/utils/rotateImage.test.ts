import { afterEach, describe, expect, it, vi } from 'vitest'
import { rotateImage90 } from './rotateImage'

describe('rotateImage90', () => {
  const originalImage = globalThis.Image

  afterEach(() => {
    globalThis.Image = originalImage
    vi.restoreAllMocks()
  })

  it('returns a jpeg blob when canvas pipeline succeeds', async () => {
    class MockImage {
      naturalWidth = 100

      naturalHeight = 50

      onload: ((event: Event) => void) | null = null

      onerror: ((event: Event) => void) | null = null

      set src(_value: string) {
        queueMicrotask(() => {
          this.onload?.(new Event('load'))
        })
      }
    }

    globalThis.Image = MockImage as unknown as typeof Image

    const translate = vi.fn()
    const rotate = vi.fn()
    const drawImage = vi.fn()

    vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue({
      translate,
      rotate,
      drawImage,
    } as unknown as CanvasRenderingContext2D)

    vi.spyOn(HTMLCanvasElement.prototype, 'toBlob').mockImplementation((
      callback,
    ) => {
      callback?.(new Blob(['jpeg'], { type: 'image/jpeg' }))
    })

    const { blob } = await rotateImage90('data:image/png;base64,abc', 'clockwise')

    expect(blob.type).toBe('image/jpeg')
    expect(translate).toHaveBeenCalled()
    expect(rotate).toHaveBeenCalledWith(Math.PI / 2)
  })

  it('throws when image fails to load', async () => {
    class MockImage {
      onload: ((event: Event) => void) | null = null

      onerror: ((event: Event) => void) | null = null

      set src(_value: string) {
        queueMicrotask(() => {
          this.onerror?.(new Event('error'))
        })
      }
    }

    globalThis.Image = MockImage as unknown as typeof Image

    await expect(rotateImage90('bad', 'clockwise')).rejects.toThrow('Failed to load image for rotation')
  })
})