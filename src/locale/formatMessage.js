/**
 * Replaces `${name}` placeholders in a template string.
 * @param {string} template
 * @param {Record<string, string | number | undefined | null>} [vars]
 * @returns {string}
 */
export const formatMessage = (template, vars = {}) => {
  if (typeof template !== 'string') {
    return ''
  }

  return template.replace(/\$\{(\w+)\}/g, (_, key) => {
    const value = vars[key]
    return value === undefined || value === null ? '' : String(value)
  })
}
