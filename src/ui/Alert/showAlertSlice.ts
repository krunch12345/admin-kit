import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

export type AlertSeverity = 'success' | 'info' | 'warning' | 'error'

export interface ShowAlertState {
  isShowAlert: boolean
  severity?: AlertSeverity
  message?: string
}

export interface ShowAlertPayload {
  isShowAlert?: boolean
  severity?: AlertSeverity
  message?: string
}

export interface ShowAlertRootState {
  showAlert: ShowAlertState
}

const initialState: ShowAlertState = {
  isShowAlert: false,
}

export const showAlertSlice = createSlice({
  name: 'showAlert',

  initialState,

  reducers: {
    showAlert: (state, { payload }: PayloadAction<ShowAlertPayload>) => {
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
export const showAlertSelector = (state: ShowAlertRootState): ShowAlertState => state.showAlert
