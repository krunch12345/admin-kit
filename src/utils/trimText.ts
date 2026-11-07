/**
 * Trims a string to a specified length and appends an ellipsis if necessary.
 *
 * @param text - The text to be trimmed.
 * @param symbolsCount - The maximum number of characters to keep.
 * @returns The trimmed text with an ellipsis if it exceeds the specified length.
 */
export const trimText = (text: string, symbolsCount = 75): string => text.length > symbolsCount
  ? `${text.substring(0, symbolsCount)}...`
  : text
