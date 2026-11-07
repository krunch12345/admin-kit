import assert from 'node:assert/strict'
import { canCloseModal, canReplaceModal } from './modalOwnership'

describe('canCloseModal', () => {
  it('allows force-close when no owner id is requested', () => {
    assert.equal(canCloseModal('cover', undefined), true)
    assert.equal(canCloseModal('cover', null), true)
  })

  it('allows close when modal has no owner', () => {
    assert.equal(canCloseModal(null, 'cover'), true)
    assert.equal(canCloseModal(undefined, 'logo'), true)
  })

  it('allows close when requested owner matches', () => {
    assert.equal(canCloseModal('cover', 'cover'), true)
  })

  it('blocks close when requested owner does not match current owner', () => {
    assert.equal(canCloseModal('logo', 'cover'), false)
  })
})

describe('canReplaceModal', () => {
  it('allows opening when modal is closed', () => {
    assert.equal(
      canReplaceModal({ open: false }, { open: true, ownerId: 'logo' }),
      true,
    )
  })

  it('allows replace when owners match', () => {
    assert.equal(
      canReplaceModal(
        { open: true, ownerId: 'cover' },
        { open: true, ownerId: 'cover' },
      ),
      true,
    )
  })

  it('blocks replace when another owner holds the open modal', () => {
    assert.equal(
      canReplaceModal(
        { open: true, ownerId: 'logo' },
        { open: true, ownerId: 'cover' },
      ),
      false,
    )
  })

  it('allows legacy openers without owner id', () => {
    assert.equal(
      canReplaceModal(
        { open: true, ownerId: 'logo' },
        { open: true },
      ),
      true,
    )
  })
})
