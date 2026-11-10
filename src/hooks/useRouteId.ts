import { useParams } from 'react-router-dom'

export interface UseRouteIdResult {
  id: string | undefined
  isAddNew: boolean
  skip: boolean
}

/**
 * Reads the route `:id` param and whether the current page is the create flow.
 */
export const useRouteId = (addNewSegment = 'add-new'): UseRouteIdResult => {
  const { id } = useParams()

  const isAddNew = id === addNewSegment
  const skip = !id || isAddNew

  return {
    id,
    isAddNew,
    skip,
  }
}
