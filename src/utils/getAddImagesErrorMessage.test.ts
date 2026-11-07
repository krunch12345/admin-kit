import {
  getAddImagesErrorMessage,
  isAppFileTooLargePayload,
} from './getAddImagesErrorMessage'

describe('isAppFileTooLargePayload', () => {
  it('detects multer JSON error text', () => {
    expect(isAppFileTooLargePayload({ error: 'File too large (max 20MB)' })).toBe(true)
  })

  it('detects FILE_TOO_LARGE code', () => {
    expect(isAppFileTooLargePayload({ code: 'FILE_TOO_LARGE' })).toBe(true)
  })

  it('returns false for plain proxy text', () => {
    expect(isAppFileTooLargePayload('413 Request Entity Too Large')).toBe(false)
  })
})

describe('getAddImagesErrorMessage', () => {
  it('shows proxy guidance for plain 413 bodies', () => {
    const message = getAddImagesErrorMessage({
      status: 413,
      data: '413 Request Entity Too Large',
    })

    expect(message).toMatch(/client_max_body_size/)
    expect(message).toMatch(/256m/)
  })

  it('keeps app file-too-large message on 413 JSON', () => {
    const message = getAddImagesErrorMessage({
      status: 413,
      data: { error: 'File too large (max 20MB)' },
    })

    expect(message).toBe('File too large (max 20MB)')
  })

  it('prefers data.message when present', () => {
    expect(getAddImagesErrorMessage({ status: 400, data: { message: 'Bad request' } })).toBe('Bad request')
  })
})
