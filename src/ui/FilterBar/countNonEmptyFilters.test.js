import assert from 'node:assert/strict'
import { describe, it } from 'node:test'
import { countNonEmptyFilters } from './countNonEmptyFilters.js'

describe('countNonEmptyFilters', () => {
  const initFilters = {
    titlePost: '',
    isPinned: 0,
    isHidden: 0,
    isContentLabels: false,
    startDate: null,
    endDate: null,
  }

  it('returns 0 for posts init defaults including false and 0', () => {
    assert.equal(countNonEmptyFilters(initFilters, initFilters), 0)
  })

  it('counts only values that differ from init', () => {
    assert.equal(
      countNonEmptyFilters({ ...initFilters, titlePost: 'hello' }, initFilters),
      1,
    )
    assert.equal(
      countNonEmptyFilters({ ...initFilters, isContentLabels: true }, initFilters),
      1,
    )
    assert.equal(
      countNonEmptyFilters({ ...initFilters, isPinned: 1, isHidden: 1 }, initFilters),
      2,
    )
  })

  it('ignores false when counting without init', () => {
    assert.equal(countNonEmptyFilters({ isContentLabels: false, titlePost: '' }), 0)
    assert.equal(countNonEmptyFilters({ isContentLabels: true, titlePost: 'x' }), 2)
  })
})
