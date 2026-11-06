import { createSlice } from '@reduxjs/toolkit'

/**
 * @typedef {Object} ShowLoadingState
 * @property {boolean} isShowLoading - Indicates if loading should be shown
 */

/**
 * Initial state for the loading slice
 * @type {ShowLoadingState}
 */
const initialState = {
  isShowLoading: false,
}

export const showLoadingSlice = createSlice({
  name: 'showLoading',

  initialState,

  reducers: {
    showLoading: (state) => {
      state.isShowLoading = true
    },

    hideLoading: (state) => {
      state.isShowLoading = false
    },
  },
})

export const { showLoading, hideLoading } = showLoadingSlice.actions
export const showLoadingSelector = state => state.showLoading
