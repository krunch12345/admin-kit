import { useParams } from 'react-router'

/**
 * Custom hook for determine ID object.
 * @returns {Record<string, any>}
 */
export const useId = () => {
  const { id } = useParams()

  const isAddNew = id === 'add-new'

  const skip = !id || isAddNew

  return {
    id,
    isAddNew,
    skip,
  }
}