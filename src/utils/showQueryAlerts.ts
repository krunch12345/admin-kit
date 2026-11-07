import { showAlert } from '../ui/Alert/showAlertSlice'
import { sanitizeAppPath } from './sanitizeAppPath'

type NavigateFn = (path: string) => void
type DispatchFn = (action: ReturnType<typeof showAlert>) => unknown

/**
 * Displays alerts based on the success or error state of a query.
 *
 * @param isSuccess - Indicates if the query was successful.
 * @param isError - Indicates if there was an error with the query.
 * @param data - The data returned from the query, expected to contain a message.
 * @param error - The error object returned from the query, expected to contain a message.
 * @param navigate - A function to navigate to a different route.
 * @param dispatch - A function to dispatch actions to the store.
 * @param path - The path for navigate if isSuccess.
 */
export const showQueryAlerts = (
  isSuccess: boolean,
  isError: boolean,
  data?: { message?: string } | null,
  error?: { data?: { message?: string } } | null,
  navigate?: NavigateFn,
  dispatch?: DispatchFn,
  path?: string,
): void => {
  if (isSuccess) {
    if (path && typeof navigate === 'function') {
      navigate(sanitizeAppPath(path, '/'))
    }

    if (typeof dispatch === 'function') {
      dispatch(
        showAlert({
          isShowAlert: true,
          severity: 'success',
          message: data?.message,
        }),
      )
    }
  } else if (isError && typeof dispatch === 'function') {
    dispatch(
      showAlert({
        isShowAlert: true,
        severity: 'error',
        message: error?.data?.message || 'Request failed',
      }),
    )
  }
}
