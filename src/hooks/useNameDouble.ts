import { useMemo } from 'react'

/**
 * Custom hook for check double name in.
 * @param data - The array of objects.
 * @param name - The name of object.
 * @param key - The name of checking field.
 */
export const useNameDouble = <T extends Record<string, unknown>>(
  data: readonly T[] | null | undefined,
  name: string,
  key: keyof T & string = 'name',
): boolean | undefined => (
    useMemo(() => {
      if (data?.length === 1) {
        return data.some((item) => String(item[key]).toLowerCase() === name.toLowerCase())
      }

      return undefined
    }, [data, key, name])
  )
