import { useCallback, useEffect, useRef, useState } from 'react'
import {
  clearListScrollTarget,
  getListItemDomId,
  readListPosition,
  writeListPosition,
} from '../utils/listPosition.js'

/**
 * Persists list page in sessionStorage across create/edit navigation.
 * @param {string} storageKey
 * @param {string | number} [resetKey] - When this changes (after first render), page resets to 1.
 * @returns {[number, function, function]} [page, setPage, setPageSilent]
 */
export const useListPosition = (storageKey, resetKey) => {
  const [page, setPageState] = useState(() => readListPosition(storageKey).page)
  const isFirstReset = useRef(true)

  useEffect(() => {
    writeListPosition(storageKey, { page })
  }, [page, storageKey])

  useEffect(() => {
    if (resetKey === undefined) {
      return
    }

    if (isFirstReset.current) {
      isFirstReset.current = false
      return
    }

    clearListScrollTarget(storageKey)
    setPageState(1)
  }, [resetKey, storageKey])

  const setPage = useCallback((nextPage) => {
    clearListScrollTarget(storageKey)
    setPageState(nextPage)
  }, [storageKey])

  return [page, setPage, setPageState]
}

/**
 * Clamps page to totalPages and restores scroll after mutations.
 * Call after the list query so pagination metadata is available.
 * @param {string} storageKey
 * @param {number} page
 * @param {function} setPageSilent - Page setter that does not clear scroll target.
 * @param {{ totalPages?: number, isReady?: boolean }} options
 */
export const useListPositionSync = (storageKey, page, setPageSilent, options = {}) => {
  const { totalPages, isReady = false } = options
  const didRestoreScroll = useRef(false)

  useEffect(() => {
    if (typeof totalPages !== 'number' || totalPages < 1) {
      return
    }

    if (page > totalPages) {
      setPageSilent(totalPages)
    }
  }, [page, setPageSilent, totalPages])

  useEffect(() => {
    if (!isReady || didRestoreScroll.current) {
      return
    }

    if (typeof totalPages === 'number' && totalPages >= 1 && page > totalPages) {
      return
    }

    const position = readListPosition(storageKey)

    if (!position.focusId && !position.scrollToEnd) {
      return
    }

    didRestoreScroll.current = true

    const timeoutId = window.setTimeout(() => {
      if (position.focusId) {
        const element = document.getElementById(getListItemDomId(position.focusId))
        element?.scrollIntoView({ block: 'center', behavior: 'smooth' })
      } else if (position.scrollToEnd) {
        const items = document.querySelectorAll('[data-list-item]')
        const last = items[items.length - 1]
        last?.scrollIntoView({ block: 'center', behavior: 'smooth' })
      }

      clearListScrollTarget(storageKey)
    }, 100)

    return () => window.clearTimeout(timeoutId)
  }, [isReady, page, storageKey, totalPages])

  useEffect(() => {
    if (!isReady) {
      didRestoreScroll.current = false
    }
  }, [isReady])
}
