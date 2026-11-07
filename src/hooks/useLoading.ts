import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { hideLoading, showLoading } from '../ui/Loading/showLoadingSlice'

/**
 * Custom hook for displaying download status.
 * @param isFetching - The loading status.
 */
export const useLoading = (isFetching: boolean): void => {
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(isFetching ? showLoading() : hideLoading())
  }, [dispatch, isFetching])
}
