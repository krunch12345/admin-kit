export type MessageVars = Record<string, string | number | null | undefined>

/**
 * Replaces `${name}` placeholders in a template string.
 */
export const formatMessage = (template: string, vars: MessageVars = {}): string => {
  if (typeof template !== 'string') {
    return ''
  }

  return template.replace(/\$\{(\w+)\}/g, (_, key: string) => {
    const value = vars[key]
    return value === undefined || value === null ? '' : String(value)
  })
}
