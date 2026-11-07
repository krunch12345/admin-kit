import { useCallback, useEffect, useRef, useState } from 'react'
import type { Dispatch, SetStateAction } from 'react'
import {
  clearListScrollTarget,
  getListItemDomId,
  readListPosition,
  writeListPosition,
} from '../utils/listPosition'

export interface UseListPositionSyncOptions {
  totalPages?: number
  isReady?: boolean
}

/**
 * Centers an element in the viewport without scrolling past document bounds.
 */
const scrollElementToCenter = (element: Element): void => {
  const rect = element.getBoundingClientRect()
  const absoluteTop = window.scrollY + rect.top
  const target = absoluteTop - (window.innerHeight / 2) + (rect.height / 2)
  const maxScroll = Math.max(0, document.documentElement.scrollHeight - window.innerHeight)

  window.scrollTo({
    top: Math.min(Math.max(0, target), maxScroll),
    behavior: 'smooth',
  })
}

/**
 * Persists list page in sessionStorage across create/edit navigation.
 * @returns Tuple of current page, setter that clears scroll target, and silent setter.
 */
export const useListPosition = (
  storageKey: string,
  resetKey?: string | number,
): [number, (nextPage: number) => void, Dispatch<SetStateAction<number>>] => {
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

  const setPage = useCallback((nextPage: number) => {
    clearListScrollTarget(storageKey)
    setPageState(nextPage)
  }, [storageKey])

  return [page, setPage, setPageState]
}

/**
 * Clamps page to totalPages and restores scroll after mutations.
 */
export const useListPositionSync = (
  storageKey: string,
  page: number,
  setPageSilent: (page: number) => void,
  options: UseListPositionSyncOptions = {},
): void => {
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

    const timeoutId = window.setTimeout(() => {
      if (position.focusId) {
        const element = document.getElementById(getListItemDomId(position.focusId))
        if (element) {
          scrollElementToCenter(element)
        }
      } else if (position.scrollToEnd) {
        const items = document.querySelectorAll('[data-list-item]')
        const last = items[items.length - 1]
        if (last) {
          scrollElementToCenter(last)
        }
      }

      clearListScrollTarget(storageKey)
      didRestoreScroll.current = true
    }, 100)

    // StrictMode remount cancels the timeout; allow a retry on the next effect run.
    return () => {
      window.clearTimeout(timeoutId)
    }
  }, [isReady, page, storageKey, totalPages])

  useEffect(() => {
    if (!isReady) {
      didRestoreScroll.current = false
    }
  }, [isReady])
}
