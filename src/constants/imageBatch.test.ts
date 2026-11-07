import {
  BATCH_IMAGE_HARD_LIMIT,
  BATCH_IMAGE_MAX_BYTES,
  chunkArray,
  chunkFilesByCountAndBytes,
  getUploadItemByteSize,
} from './imageBatch'

describe('chunkArray', () => {
  it('returns empty array when items are empty', () => {
    expect(chunkArray([])).toEqual([])
    expect(chunkArray(null)).toEqual([])
  })

  it('splits items by count', () => {
    const items = [1, 2, 3, 4, 5]
    expect(chunkArray(items, 2)).toEqual([[1, 2], [3, 4], [5]])
  })
})

describe('getUploadItemByteSize', () => {
  it('reads size from file-like item', () => {
    expect(getUploadItemByteSize({ size: 12 })).toBe(12)
  })

  it('reads size from nested file', () => {
    expect(getUploadItemByteSize({ file: { size: 34 } })).toBe(34)
  })

  it('returns 0 when size is missing', () => {
    expect(getUploadItemByteSize({})).toBe(0)
    expect(getUploadItemByteSize(null)).toBe(0)
  })
})

describe('chunkFilesByCountAndBytes', () => {
  it('returns empty array when items are empty', () => {
    expect(chunkFilesByCountAndBytes([])).toEqual([])
    expect(chunkFilesByCountAndBytes(null)).toEqual([])
  })

  it('packs by count without exceeding maxCount', () => {
    const items = [
      { id: 'a', size: 1 },
      { id: 'b', size: 1 },
      { id: 'c', size: 1 },
    ]

    expect(chunkFilesByCountAndBytes(items, { maxCount: 2, maxBytes: 1000 })).toEqual([
      [{ id: 'a', size: 1 }, { id: 'b', size: 1 }],
      [{ id: 'c', size: 1 }],
    ])
  })

  it('starts a new chunk when adding would exceed maxBytes', () => {
    const items = [
      { id: 'a', size: 8 },
      { id: 'b', size: 8 },
      { id: 'c', size: 1 },
    ]

    expect(chunkFilesByCountAndBytes(items, { maxCount: 25, maxBytes: 10 })).toEqual([
      [{ id: 'a', size: 8 }],
      [{ id: 'b', size: 8 }, { id: 'c', size: 1 }],
    ])
  })

  it('keeps a single oversized file as its own chunk', () => {
    const items = [
      { id: 'huge', size: 50 },
      { id: 'small', size: 1 },
    ]

    expect(chunkFilesByCountAndBytes(items, { maxCount: 25, maxBytes: 10 })).toEqual([
      [{ id: 'huge', size: 50 }],
      [{ id: 'small', size: 1 }],
    ])
  })

  it('uses nested file size by default', () => {
    const items = [
      { id: 'a', file: { size: 6 } },
      { id: 'b', file: { size: 6 } },
    ]

    expect(chunkFilesByCountAndBytes(items, { maxCount: 25, maxBytes: 10 })).toEqual([
      [{ id: 'a', file: { size: 6 } }],
      [{ id: 'b', file: { size: 6 } }],
    ])
  })

  it('respects default hard limit constants', () => {
    expect(BATCH_IMAGE_HARD_LIMIT).toBe(25)
    expect(BATCH_IMAGE_MAX_BYTES).toBe(18 * 1024 * 1024)

    const items = Array.from({ length: 26 }, (_, index) => ({
      id: String(index),
      size: 1,
    }))

    const chunks = chunkFilesByCountAndBytes(items)
    expect(chunks).toHaveLength(2)
    expect(chunks[0]).toHaveLength(25)
    expect(chunks[1]).toHaveLength(1)
  })

  it('uses custom getSize when provided', () => {
    const items = [{ n: 4 }, { n: 4 }, { n: 1 }]

    expect(chunkFilesByCountAndBytes(items, {
      maxCount: 10,
      maxBytes: 5,
      getSize: (item) => item.n,
    })).toEqual([[{ n: 4 }], [{ n: 4 }, { n: 1 }]])
  })
})
