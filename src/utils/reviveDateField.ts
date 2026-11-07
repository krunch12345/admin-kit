/**
 * Revives a Date field from stored draft JSON.
 */
export const reviveDateField = (raw: unknown): Date | null => {
  if (typeof raw === 'string') {
    const date = new Date(raw)
    return Number.isNaN(date.getTime()) ? null : date
  }

  if (raw instanceof Date || Object.prototype.toString.call(raw) === '[object Date]') {
    return raw as Date
  }

  return null
}
