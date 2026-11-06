import { showAlert } from '../ui/Alert/showAlertSlice.js'

/**
 * Displays alerts based on the success or error state of a query.
 *
 * @param {boolean} isSuccess - Indicates if the query was successful.
 * @param {boolean} isError - Indicates if there was an error with the query.
 * @param {Object} data - The data returned from the query, expected to contain a message.
 * @param {Object} error - The error object returned from the query, expected to contain a message.
 * @param {any} [navigate] - A function to navigate to a different route.
 * @param {any} [dispatch] - A function to dispatch actions to the store.
 * @param {string} [path] - The path for navigate if isSuccess.
 */
export const showQueryAlerts = (isSuccess, isError, data, error, navigate, dispatch, path) => {
  if (isSuccess) {
    path && navigate(path)

    dispatch(
      showAlert({
        isShowAlert: true,
        severity: 'success',
        message: data?.message,
      }),
    )
  } else if (isError) {
    dispatch(
      showAlert({
        isShowAlert: true,
        severity: 'error',
        message: error?.data?.message || JSON.stringify(error),
      }),
    )
  }
}
