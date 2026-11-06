import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import {
  getAddImagesErrorMessage,
  isAppFileTooLargePayload,
} from './getAddImagesErrorMessage.js'

describe('isAppFileTooLargePayload', () => {
  it('detects multer JSON error text', () => {
    assert.equal(isAppFileTooLargePayload({ error: 'File too large (max 20MB)' }), true)
  })

  it('detects FILE_TOO_LARGE code', () => {
    assert.equal(isAppFileTooLargePayload({ code: 'FILE_TOO_LARGE' }), true)
  })

  it('returns false for plain proxy text', () => {
    assert.equal(isAppFileTooLargePayload('413 Request Entity Too Large'), false)
  })
})

describe('getAddImagesErrorMessage', () => {
  it('shows proxy guidance for plain 413 bodies', () => {
    const message = getAddImagesErrorMessage({
      status: 413,
      data: '413 Request Entity Too Large',
    })

    assert.match(message, /client_max_body_size/)
    assert.match(message, /256m/)
  })

  it('keeps app file-too-large message on 413 JSON', () => {
    const message = getAddImagesErrorMessage({
      status: 413,
      data: { error: 'File too large (max 20MB)' },
    })

    assert.equal(message, 'File too large (max 20MB)')
  })

  it('prefers data.message when present', () => {
    assert.equal(
      getAddImagesErrorMessage({ status: 400, data: { message: 'Bad request' } }),
      'Bad request',
    )
  })
})
