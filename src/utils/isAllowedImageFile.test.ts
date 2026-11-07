import { isAllowedImageFile } from './isAllowedImageFile'

describe('isAllowedImageFile', () => {
  it('allows common raster image MIME types', () => {
    expect(isAllowedImageFile({ type: 'image/jpeg' })).toBe(true)
    expect(isAllowedImageFile({ type: 'image/png' })).toBe(true)
    expect(isAllowedImageFile({ type: 'image/webp' })).toBe(true)
  })

  it('rejects SVG and non-image types', () => {
    expect(isAllowedImageFile({ type: 'image/svg+xml' })).toBe(false)
    expect(isAllowedImageFile({ type: 'image/svg' })).toBe(false)
    expect(isAllowedImageFile({ type: 'application/pdf' })).toBe(false)
    expect(isAllowedImageFile({ type: '' })).toBe(false)
    expect(isAllowedImageFile(null)).toBe(false)
  })
})
