/**
 * Deep-merges plain objects. Arrays and non-plain values are replaced, not concatenated.
 * @param {object} target
 * @param {object} source
 * @returns {object}
 */
export const deepMerge = (target, source) => {
  if (!source || typeof source !== 'object' || Array.isArray(source)) {
    return source
  }

  const output = { ...target }

  for (const key of Object.keys(source)) {
    const next = source[key]
    const prev = output[key]

    if (
      next
      && typeof next === 'object'
      && !Array.isArray(next)
      && prev
      && typeof prev === 'object'
      && !Array.isArray(prev)
    ) {
      output[key] = deepMerge(prev, next)
    } else {
      output[key] = next
    }
  }

  return output
}
