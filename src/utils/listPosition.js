/**
 * @typedef {object} ListPosition
 * @property {number} page
 * @property {string | null} focusId - Item to scroll to after return.
 * @property {string | null} neighborId - Fallback focus after delete.
 * @property {boolean} scrollToEnd - Scroll to last item (empty last page after delete).
 */

/**
 * @param {string | number} itemId
 * @returns {string}
 */
export const getListItemDomId = (itemId) => `list-item-${itemId}`

/**
 * @param {string} storageKey
 * @returns {ListPosition}
 */
export const readListPosition = (storageKey) => {
  try {
    const raw = sessionStorage.getItem(storageKey)

    if (!raw) {
      return { page: 1, focusId: null, neighborId: null, scrollToEnd: false }
    }

    const parsed = JSON.parse(raw)
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
    return { page: 1, focusId: null, neighborId: null, scrollToEnd: false }
  }
}

/**
 * @param {string} storageKey
 * @param {Partial<ListPosition>} next
 */
export const writeListPosition = (storageKey, next) => {
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
 * @param {string} storageKey
 */
export const clearListScrollTarget = (storageKey) => {
  writeListPosition(storageKey, {
    focusId: null,
    neighborId: null,
    scrollToEnd: false,
  })
}

/**
 * @param {Array<{ id: string | number }>} items
 * @param {string | number} itemId
 * @returns {string | number | null}
 */
export const getListNeighborId = (items, itemId) => {
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
 * @param {string} storageKey
 * @param {{ page: number, itemId: string | number, items: Array<{ id: string | number }> }} params
 */
export const rememberListOpen = (storageKey, { page, itemId, items }) => {
  const neighborId = getListNeighborId(items, itemId)

  writeListPosition(storageKey, {
    page,
    focusId: String(itemId),
    neighborId: neighborId !== undefined && neighborId !== null ? String(neighborId) : null,
    scrollToEnd: false,
  })
}

/**
 * After create — return to page 1 without a scroll target.
 * @param {string} storageKey
 */
export const prepareListReturnAfterCreate = (storageKey) => {
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
 * @param {string} storageKey
 */
export const prepareListReturnAfterDelete = (storageKey) => {
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
