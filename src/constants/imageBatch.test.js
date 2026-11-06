import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import {
  BATCH_IMAGE_HARD_LIMIT,
  BATCH_IMAGE_MAX_BYTES,
  chunkArray,
  chunkFilesByCountAndBytes,
  getUploadItemByteSize,
} from './imageBatch.js'

describe('chunkArray', () => {
  it('returns empty array when items are empty', () => {
    assert.deepEqual(chunkArray([]), [])
    assert.deepEqual(chunkArray(null), [])
  })

  it('splits items by count', () => {
    const items = [1, 2, 3, 4, 5]
    assert.deepEqual(chunkArray(items, 2), [[1, 2], [3, 4], [5]])
  })
})

describe('getUploadItemByteSize', () => {
  it('reads size from file-like item', () => {
    assert.equal(getUploadItemByteSize({ size: 12 }), 12)
  })

  it('reads size from nested file', () => {
    assert.equal(getUploadItemByteSize({ file: { size: 34 } }), 34)
  })

  it('returns 0 when size is missing', () => {
    assert.equal(getUploadItemByteSize({}), 0)
    assert.equal(getUploadItemByteSize(null), 0)
  })
})

describe('chunkFilesByCountAndBytes', () => {
  it('returns empty array when items are empty', () => {
    assert.deepEqual(chunkFilesByCountAndBytes([]), [])
    assert.deepEqual(chunkFilesByCountAndBytes(null), [])
  })

  it('packs by count without exceeding maxCount', () => {
    const items = [
      { id: 'a', size: 1 },
      { id: 'b', size: 1 },
      { id: 'c', size: 1 },
    ]

    assert.deepEqual(
      chunkFilesByCountAndBytes(items, { maxCount: 2, maxBytes: 1000 }),
      [
        [{ id: 'a', size: 1 }, { id: 'b', size: 1 }],
        [{ id: 'c', size: 1 }],
      ],
    )
  })

  it('starts a new chunk when adding would exceed maxBytes', () => {
    const items = [
      { id: 'a', size: 8 },
      { id: 'b', size: 8 },
      { id: 'c', size: 1 },
    ]

    assert.deepEqual(
      chunkFilesByCountAndBytes(items, { maxCount: 25, maxBytes: 10 }),
      [
        [{ id: 'a', size: 8 }],
        [{ id: 'b', size: 8 }, { id: 'c', size: 1 }],
      ],
    )
  })

  it('keeps a single oversized file as its own chunk', () => {
    const items = [
      { id: 'huge', size: 50 },
      { id: 'small', size: 1 },
    ]

    assert.deepEqual(
      chunkFilesByCountAndBytes(items, { maxCount: 25, maxBytes: 10 }),
      [
        [{ id: 'huge', size: 50 }],
        [{ id: 'small', size: 1 }],
      ],
    )
  })

  it('uses nested file size by default', () => {
    const items = [
      { id: 'a', file: { size: 6 } },
      { id: 'b', file: { size: 6 } },
    ]

    assert.deepEqual(
      chunkFilesByCountAndBytes(items, { maxCount: 25, maxBytes: 10 }),
      [
        [{ id: 'a', file: { size: 6 } }],
        [{ id: 'b', file: { size: 6 } }],
      ],
    )
  })

  it('respects default hard limit constants', () => {
    assert.equal(BATCH_IMAGE_HARD_LIMIT, 25)
    assert.equal(BATCH_IMAGE_MAX_BYTES, 18 * 1024 * 1024)

    const items = Array.from({ length: 26 }, (_, index) => ({
      id: String(index),
      size: 1,
    }))

    const chunks = chunkFilesByCountAndBytes(items)
    assert.equal(chunks.length, 2)
    assert.equal(chunks[0].length, 25)
    assert.equal(chunks[1].length, 1)
  })

  it('uses custom getSize when provided', () => {
    const items = [{ n: 4 }, { n: 4 }, { n: 1 }]

    assert.deepEqual(
      chunkFilesByCountAndBytes(items, {
        maxCount: 10,
        maxBytes: 5,
        getSize: (item) => item.n,
      }),
      [[{ n: 4 }], [{ n: 4 }, { n: 1 }]],
    )
  })
})
