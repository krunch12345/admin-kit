import { describe, expect, it } from 'vitest'
import { normalizeUploadResult, toUploadedImagePayload } from './uploadHelpers'

describe('normalizeUploadResult', () => {
  it('returns array result as succeeded items', () => {
    expect(normalizeUploadResult([{ url: 'a' }])).toEqual({
      succeeded: [{ url: 'a' }],
      failed: [],
    })
  })

  it('reads succeeded and failed from object result', () => {
    expect(normalizeUploadResult({
      succeeded: [{ url: 'a' }],
      failed: [{ clientIndex: 1, message: 'nope' }],
    })).toEqual({
      succeeded: [{ url: 'a' }],
      failed: [{ clientIndex: 1, message: 'nope' }],
    })
  })

  it('returns empty succeeded when object has no succeeded array', () => {
    expect(normalizeUploadResult({ url: 'https://example.com/x.jpg' })).toEqual({
      succeeded: [],
      failed: [],
    })
  })
})

describe('toUploadedImagePayload', () => {
  it('strips clientIndex and keeps remaining fields', () => {
    expect(toUploadedImagePayload({
      clientIndex: 0,
      url: 'https://example.com/x.jpg',
      id: '1',
    })).toEqual({
      url: 'https://example.com/x.jpg',
      id: '1',
    })
  })
})
