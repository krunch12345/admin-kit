const CYRILLIC_TO_LATIN = {
  а: 'a',
  б: 'b',
  в: 'v',
  г: 'g',
  д: 'd',
  е: 'e',
  ё: 'e',
  ж: 'zh',
  з: 'z',
  и: 'i',
  й: 'y',
  к: 'k',
  л: 'l',
  м: 'm',
  н: 'n',
  о: 'o',
  п: 'p',
  р: 'r',
  с: 's',
  т: 't',
  у: 'u',
  ф: 'f',
  х: 'h',
  ц: 'ts',
  ч: 'ch',
  ш: 'sh',
  щ: 'sch',
  ъ: '',
  ы: 'y',
  ь: '',
  э: 'e',
  ю: 'yu',
  я: 'ya',
}

/**
 * Builds a URL-safe slug from display text (lowercases, replaces non-alphanumerics;
 * Cyrillic is transliterated when present).
 * @param {string} [value] - Source text.
 * @returns {string}
 */
export const slugify = (value) => {
  if (!value || typeof value !== 'string') {
    return ''
  }

  const transliterated = value
    .trim()
    .toLowerCase()
    .split('')
    .map((char) => (char in CYRILLIC_TO_LATIN ? CYRILLIC_TO_LATIN[char] : char))
    .join('')

  return transliterated
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}
