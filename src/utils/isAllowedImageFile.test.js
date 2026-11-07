import assert from 'node:assert/strict'
import { describe, it } from 'node:test'
import { isAllowedImageFile } from './isAllowedImageFile.js'

describe('isAllowedImageFile', () => {
  it('allows common raster image MIME types', () => {
    assert.equal(isAllowedImageFile({ type: 'image/jpeg' }), true)
    assert.equal(isAllowedImageFile({ type: 'image/png' }), true)
    assert.equal(isAllowedImageFile({ type: 'image/webp' }), true)
  })

  it('rejects SVG and non-image types', () => {
    assert.equal(isAllowedImageFile({ type: 'image/svg+xml' }), false)
    assert.equal(isAllowedImageFile({ type: 'image/svg' }), false)
    assert.equal(isAllowedImageFile({ type: 'application/pdf' }), false)
    assert.equal(isAllowedImageFile({ type: '' }), false)
    assert.equal(isAllowedImageFile(null), false)
  })
})
