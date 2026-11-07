import { createSlice } from '@reduxjs/toolkit'

export interface ShowLoadingState {
  isShowLoading: boolean
}

export interface ShowLoadingRootState {
  showLoading: ShowLoadingState
}

const initialState: ShowLoadingState = {
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
export const showLoadingSelector = (state: ShowLoadingRootState): ShowLoadingState => state.showLoading
