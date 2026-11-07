export type ListItemId = string | number

export interface ListPosition {
  page: number
  /** Item to scroll to after return. */
  focusId: string | null
  /** Fallback focus after delete. */
  neighborId: string | null
  /** Scroll to last item (empty last page after delete). */
  scrollToEnd: boolean
}

export interface ListItemRef {
  id: ListItemId
}

export interface RememberListOpenParams {
  page: number
  itemId: ListItemId
  items: readonly ListItemRef[]
}

const createDefaultPosition = (): ListPosition => ({
  page: 1,
  focusId: null,
  neighborId: null,
  scrollToEnd: false,
})

export const getListItemDomId = (itemId: ListItemId): string => `list-item-${itemId}`

export const readListPosition = (storageKey: string): ListPosition => {
  try {
    const raw = sessionStorage.getItem(storageKey)

    if (!raw) {
      return createDefaultPosition()
    }

    const parsed: Partial<Record<keyof ListPosition, unknown>> | null = JSON.parse(raw)
    const page = Number(parsed?.page)

    return {
      page: Number.isFinite(page) && page >= 1 ? page : 1,
      focusId: parsed?.focusId !== undefined && parsed?.focusId !== null
        ? String(parsed.focusId)
        : null,
      neighborId: parsed?.neighborId !== undefined && parsed?.neighborId !== null
        ? String(parsed.neighborId)
        : null,
      scrollToEnd: Boolean(parsed?.scrollToEnd),
    }
  } catch {
    return createDefaultPosition()
  }
}

export const writeListPosition = (storageKey: string, next: Partial<ListPosition>): void => {
  try {
    const current = readListPosition(storageKey)
    sessionStorage.setItem(storageKey, JSON.stringify({
      page: next.page ?? current.page,
      focusId: next.focusId !== undefined ? next.focusId : current.focusId,
      neighborId: next.neighborId !== undefined ? next.neighborId : current.neighborId,
      scrollToEnd: next.scrollToEnd !== undefined ? next.scrollToEnd : current.scrollToEnd,
    }))
  } catch {
    // Ignore quota / private mode write failures.
  }
}

/**
 * Clears scroll target flags but keeps the page number.
 */
export const clearListScrollTarget = (storageKey: string): void => {
  writeListPosition(storageKey, {
    focusId: null,
    neighborId: null,
    scrollToEnd: false,
  })
}

export const getListNeighborId = (
  items: readonly ListItemRef[] | null | undefined,
  itemId: ListItemId,
): ListItemId | null => {
  if (!items?.length) {
    return null
  }

  const index = items.findIndex((item) => String(item.id) === String(itemId))

  if (index < 0) {
    return null
  }

  const neighbor = items[index - 1] ?? items[index + 1]

  return neighbor?.id ?? null
}

/**
 * Remembers page and focus/neighbor before opening an item for edit.
 */
export const rememberListOpen = (
  storageKey: string,
  { page, itemId, items }: RememberListOpenParams,
): void => {
  const neighborId = getListNeighborId(items, itemId)

  writeListPosition(storageKey, {
    page,
    focusId: String(itemId),
    neighborId: neighborId !== null ? String(neighborId) : null,
    scrollToEnd: false,
  })
}

/**
 * After create — return to page 1 without a scroll target.
 */
export const prepareListReturnAfterCreate = (storageKey: string): void => {
  writeListPosition(storageKey, {
    page: 1,
    focusId: null,
    neighborId: null,
    scrollToEnd: false,
  })
}

/**
 * After delete — focus neighbor, or end of previous page if none.
 * No-op when the item was not opened from a remembered list position (e.g. draft).
 */
export const prepareListReturnAfterDelete = (storageKey: string): void => {
  const position = readListPosition(storageKey)

  if (!position.focusId && !position.neighborId) {
    return
  }

  writeListPosition(storageKey, {
    page: position.page,
    focusId: position.neighborId,
    neighborId: null,
    scrollToEnd: !position.neighborId,
  })
}
