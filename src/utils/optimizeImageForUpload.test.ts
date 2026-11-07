import {
  OPTIMIZE_SKIP_UNDER_BYTES,
  buildOptimizedJpegFileName,
  computeTargetDimensions,
  getFileNameStem,
  shouldSkipOptimizeImage,
} from './optimizeImageForUpload'

describe('getFileNameStem', () => {
  it('strips extension from file name', () => {
    expect(getFileNameStem('photo.PNG')).toBe('photo')
    expect(getFileNameStem('a.b.c.jpeg')).toBe('a.b.c')
  })

  it('returns image when name is empty', () => {
    expect(getFileNameStem('')).toBe('image')
    expect(getFileNameStem()).toBe('image')
  })
})

describe('buildOptimizedJpegFileName', () => {
  it('preserves stem and uses jpg extension', () => {
    expect(buildOptimizedJpegFileName('vacation.heic')).toBe('vacation.jpg')
    expect(buildOptimizedJpegFileName('nest/photo.webp')).toBe('photo.jpg')
  })
})

describe('computeTargetDimensions', () => {
  it('keeps dimensions when within max side', () => {
    expect(computeTargetDimensions(1920, 1080, 2560)).toEqual({
      width: 1920,
      height: 1080,
    })
  })

  it('scales longest side down to max', () => {
    expect(computeTargetDimensions(5120, 2880, 2560)).toEqual({
      width: 2560,
      height: 1440,
    })
  })

  it('scales portrait images by height', () => {
    expect(computeTargetDimensions(2000, 4000, 2560)).toEqual({
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
    expect(shouldSkipOptimizeImage(makeFile(), { skipCompression: true })).toBe(true)
  })

  it('skips when file is already under size threshold', () => {
    expect(shouldSkipOptimizeImage(makeFile({ size: OPTIMIZE_SKIP_UNDER_BYTES - 1 }))).toBe(true)
  })

  it('skips non-raster and heic types', () => {
    expect(shouldSkipOptimizeImage(makeFile({ type: 'image/svg+xml' }))).toBe(true)
    expect(shouldSkipOptimizeImage(makeFile({ type: 'image/heic' }))).toBe(true)
    expect(shouldSkipOptimizeImage(makeFile({ type: 'application/pdf' }))).toBe(true)
  })

  it('does not skip large raster images', () => {
    expect(shouldSkipOptimizeImage(makeFile())).toBe(false)
    expect(shouldSkipOptimizeImage(makeFile({ type: 'image/png' }))).toBe(false)
  })
})
