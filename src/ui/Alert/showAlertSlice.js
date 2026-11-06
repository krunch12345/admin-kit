import { createSlice } from '@reduxjs/toolkit'

/**
 * @typedef {Object} ShowAlertState
 * @property {boolean} isShowAlert - Indicates if alert should be shown
 * @property {'success' | 'info' | 'warning' | 'error'} [severity] - Optional severity of the alert
 * @property {string} [message] - Optional message to display in the alert
 */

/**
 * Initial state for the alert slice
 * @type {ShowAlertState}
 */
const initialState = {
  isShowAlert: false,
}

export const showAlertSlice = createSlice({
  name: 'showAlert',

  initialState,

  reducers: {
    showAlert: (state, { payload }) => {
      state.isShowAlert = true
      state.severity = payload.severity
      state.message = payload.message
    },

    hideAlert: (state) => {
      state.isShowAlert = false
      state.severity = undefined
      state.message = undefined
    },
  },
})

export const { showAlert, hideAlert } = showAlertSlice.actions
export const showAlertSelector = state => state.showAlert
