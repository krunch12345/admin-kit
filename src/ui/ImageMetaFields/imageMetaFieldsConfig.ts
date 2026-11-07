export type ImageMetaFieldKey = 'name' | 'description' | 'source' | 'comment'

export interface ImageMetaFieldDefinition {
  key: ImageMetaFieldKey
  label: string
  enLabel: string
}

export interface CopyableMetaField {
  key: ImageMetaFieldKey
  label: string
  ruKey: ImageMetaFieldKey
  enKey: `${ImageMetaFieldKey}EN`
  ruLabel: string
  enLabel: string
}

export type ImageMeta = {
  [Key in ImageMetaFieldKey | `${ImageMetaFieldKey}EN`]?: unknown
}

/**
 * Logical image meta fields; each one is stored as a primary value plus an EN value under `${key}EN`.
 */
export const IMAGE_META_FIELDS: ImageMetaFieldDefinition[] = [
  { key: 'name', label: 'Name', enLabel: 'Name EN' },
  { key: 'description', label: 'Description', enLabel: 'Description EN' },
  { key: 'source', label: 'Source', enLabel: 'Source EN' },
  { key: 'comment', label: 'Additional comment', enLabel: 'Comment EN' },
]

const toEnglishKey = (key: ImageMetaFieldKey): `${ImageMetaFieldKey}EN` => `${key}EN`

/**
 * Meta fields that are copied as primary+EN pairs between images (excludes the file name).
 */
export const COPYABLE_META_FIELDS: CopyableMetaField[] = IMAGE_META_FIELDS.map(({ key, label, enLabel }) => ({
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
export const DEFAULT_EMPTY_IMAGE_META: Record<string, string> = Object.fromEntries(
  COPYABLE_META_FIELDS.flatMap(({ ruKey, enKey }) => [[ruKey, ''], [enKey, '']]),
)

export interface ImageMetaTemplate {
  /** Chip / checkbox label. */
  label: string
  /** Primary locale value. */
  ru: string
  /** English value. */
  en: string
}

export interface ImageMetaTemplates {
  description?: ImageMetaTemplate[]
  source?: ImageMetaTemplate[]
}

export const isMetaValueFilled = (value: unknown): boolean => (
  typeof value === 'string' && value.trim().length > 0
)

export const isCopyableFieldFilled = (
  image: ImageMeta | null | undefined,
  field: Pick<CopyableMetaField, 'ruKey' | 'enKey'>,
): boolean => (
  isMetaValueFilled(image?.[field.ruKey]) || isMetaValueFilled(image?.[field.enKey])
)
