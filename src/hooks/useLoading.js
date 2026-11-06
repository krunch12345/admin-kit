import { useEffect } from 'react'
import { hideLoading, showLoading } from '../ui/Loading/showLoadingSlice.js'
import { useDispatch } from 'react-redux'

/**
 * Custom hook for displaying download status.
 * @param {boolean} isFetching - The loading status.
 * @returns {void}
 */
export const useLoading = (isFetching) => {
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(isFetching ? showLoading() : hideLoading())
  }, [dispatch, isFetching])
}