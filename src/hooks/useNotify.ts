import { useCallback } from 'react'
import { useDispatch } from 'react-redux'
import { showAlert } from '../ui/Alert/showAlertSlice'
import type { AlertSeverity } from '../ui/Alert/showAlertSlice'

export interface UseNotifyResult {
  notify: (severity: AlertSeverity, message: string) => void
  notifySuccess: (message: string) => void
  notifyError: (message: string) => void
}

/**
 * Dispatches kit alert notifications.
 */
export const useNotify = (): UseNotifyResult => {
  const dispatch = useDispatch()

  const notify = useCallback((severity: AlertSeverity, message: string) => {
    dispatch(showAlert({
      isShowAlert: true,
      severity,
      message,
    }))
  }, [dispatch])

  const notifySuccess = useCallback((message: string) => {
    notify('success', message)
  }, [notify])

  const notifyError = useCallback((message: string) => {
    notify('error', message)
  }, [notify])

  return { notify, notifySuccess, notifyError }
}
