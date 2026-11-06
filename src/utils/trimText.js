/**
 * Trims a string to a specified length and appends an ellipsis if necessary.
 *
 * @param {string} text - The text to be trimmed.
 * @param {number} [symbolsCount] - The maximum number of characters to keep.
 * @returns {string} The trimmed text with an ellipsis if it exceeds the specified length.
 */
export const trimText = (text, symbolsCount = 75) => text.length > symbolsCount
  ? `${text.substring(0, symbolsCount)}...`
  : text
