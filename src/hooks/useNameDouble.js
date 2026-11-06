import { useMemo } from 'react'

/**
 * Custom hook for check double name in.
 * @param {Object[]} data - The array of objects.
 * @param {string} name - The name of object.
 * @param {string} [key] - The name of checking field.
 * @returns {boolean}
 */
export const useNameDouble = (data, name, key= 'name') => {
  return useMemo(() => {
    if (data?.length === 1) {
      return !!data.find(user => user[key].toLowerCase() === name.toLowerCase())
    }
  }, [data, key, name])
}
