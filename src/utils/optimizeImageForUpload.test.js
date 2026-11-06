import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import {
  OPTIMIZE_SKIP_UNDER_BYTES,
  buildOptimizedJpegFileName,
  computeTargetDimensions,
  getFileNameStem,
  shouldSkipOptimizeImage,
} from './optimizeImageForUpload.js'

describe('getFileNameStem', () => {
  it('strips extension from file name', () => {
    assert.equal(getFileNameStem('photo.PNG'), 'photo')
    assert.equal(getFileNameStem('a.b.c.jpeg'), 'a.b.c')
  })

  it('returns image when name is empty', () => {
    assert.equal(getFileNameStem(''), 'image')
    assert.equal(getFileNameStem(), 'image')
  })
})

describe('buildOptimizedJpegFileName', () => {
  it('preserves stem and uses jpg extension', () => {
    assert.equal(buildOptimizedJpegFileName('vacation.heic'), 'vacation.jpg')
    assert.equal(buildOptimizedJpegFileName('nest/photo.webp'), 'photo.jpg')
  })
})

describe('computeTargetDimensions', () => {
  it('keeps dimensions when within max side', () => {
    assert.deepEqual(computeTargetDimensions(1920, 1080, 2560), {
      width: 1920,
      height: 1080,
    })
  })

  it('scales longest side down to max', () => {
    assert.deepEqual(computeTargetDimensions(5120, 2880, 2560), {
      width: 2560,
      height: 1440,
    })
  })

  it('scales portrait images by height', () => {
    assert.deepEqual(computeTargetDimensions(2000, 4000, 2560), {
      width: 1280,
      height: 2560,
    })
  })
})

describe('shouldSkipOptimizeImage', () => {
  const makeFile = (overrides = {}) => ({
    name: 'a.jpg',
    type: 'image/jpeg',
    size: OPTIMIZE_SKIP_UNDER_BYTES + 1,
    ...overrides,
  })

  it('skips when skipCompression is true', () => {
    assert.equal(shouldSkipOptimizeImage(makeFile(), { skipCompression: true }), true)
  })

  it('skips when file is already under size threshold', () => {
    assert.equal(
      shouldSkipOptimizeImage(makeFile({ size: OPTIMIZE_SKIP_UNDER_BYTES - 1 })),
      true,
    )
  })

  it('skips non-raster and heic types', () => {
    assert.equal(shouldSkipOptimizeImage(makeFile({ type: 'image/svg+xml' })), true)
    assert.equal(shouldSkipOptimizeImage(makeFile({ type: 'image/heic' })), true)
    assert.equal(shouldSkipOptimizeImage(makeFile({ type: 'application/pdf' })), true)
  })

  it('does not skip large raster images', () => {
    assert.equal(shouldSkipOptimizeImage(makeFile()), false)
    assert.equal(shouldSkipOptimizeImage(makeFile({ type: 'image/png' })), false)
  })
})
