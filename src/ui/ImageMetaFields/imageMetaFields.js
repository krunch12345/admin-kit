/**
 * Logical image meta fields; each one is stored as a primary value plus an EN value under `${key}EN`.
 */
export const IMAGE_META_FIELDS = [
  { key: 'name', label: 'Name', enLabel: 'Name EN' },
  { key: 'description', label: 'Description', enLabel: 'Description EN' },
  { key: 'source', label: 'Source', enLabel: 'Source EN' },
  { key: 'comment', label: 'Additional comment', enLabel: 'Comment EN' },
]

const toEnglishKey = (key) => `${key}EN`

/**
 * Meta fields that are copied as primary+EN pairs between images (excludes the file name).
 */
export const COPYABLE_META_FIELDS = IMAGE_META_FIELDS.map(({ key, label, enLabel }) => ({
  key,
  label,
  ruKey: key,
  enKey: toEnglishKey(key),
  ruLabel: label,
  enLabel,
}))

/**
 * Default empty meta object: name, nameEN, description, descriptionEN, source, sourceEN, comment, commentEN.
 */
export const DEFAULT_EMPTY_IMAGE_META = Object.fromEntries(
  COPYABLE_META_FIELDS.flatMap(({ ruKey, enKey }) => [[ruKey, ''], [enKey, '']]),
)

/**
 * @typedef {object} ImageMetaTemplate
 * @property {string} label - Chip / checkbox label.
 * @property {string} ru - Primary locale value.
 * @property {string} en - English value.
 */

/**
 * @typedef {object} ImageMetaTemplates
 * @property {ImageMetaTemplate[]} [description]
 * @property {ImageMetaTemplate[]} [source]
 */

/**
 * @param {unknown} value
 * @returns {boolean}
 */
export const isMetaValueFilled = (value) => (
  typeof value === 'string' && value.trim().length > 0
)

/**
 * @param {object} image
 * @param {{ ruKey: string, enKey: string }} field
 * @returns {boolean}
 */
export const isCopyableFieldFilled = (image, field) => (
  isMetaValueFilled(image?.[field.ruKey]) || isMetaValueFilled(image?.[field.enKey])
)
