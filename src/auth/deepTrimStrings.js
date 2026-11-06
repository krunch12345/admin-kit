/**
 * Recursively trims leading and trailing whitespace from all string values
 * within an object, array, or nested structure.
 *
 * - If the input is a string, returns the trimmed string.
 * - If the input is an object, returns a new object with all string values trimmed.
 * - If the input is an array, returns a new array with all string values trimmed.
 * - If the input is FormData, it is returned unchanged.
 * - For all other types, the value is returned as is.
 *
 * @param {any} obj - The value to process. Can be a string, array, object, or any other type.
 * @returns {any} - A new value with all strings trimmed, preserving the original structure.
 */
export const deepTrimStrings = (obj) => {
  if (Array.isArray(obj)) {
    return obj.map(deepTrimStrings)
  }
  if (obj !== null && typeof obj === 'object' && !(obj instanceof FormData)) {
    return Object.fromEntries(
      Object.entries(obj).map(([k, v]) => [k, deepTrimStrings(v)])
    )
  }
  return typeof obj === 'string' ? obj.trim() : obj
}
