/**
 * Revives a Date field from stored draft JSON.
 * @param {unknown} raw
 * @returns {Date | null}
 */
export const reviveDateField = (raw) => {
  if (typeof raw === 'string') {
    const date = new Date(raw)
    return Number.isNaN(date.getTime()) ? null : date
  }

  if (Object.prototype.toString.call(raw) === '[object Date]') {
    return raw
  }

  return null
}
