import { createSlice, isFulfilled } from '@reduxjs/toolkit'
import { clearSessionFlags, persistSessionFlag } from './sessionFlags.js'

/**
 * Matches a fulfilled RTK Query action by endpoint name, independent of the app's api instance.
 * @param {string} endpointName
 * @returns {function(object): boolean}
 */
const matchEndpointFulfilled = (endpointName) => (action) =>
  isFulfilled(action) && action.meta?.arg?.endpointName === endpointName

const initialState = {
  email: null,
  nickname: null,
  avatar: '',
  is2FARequired: false,
  accessToken: null,
  rememberMe: false,
  id: null,
  isAuthChecked: false,
}

export const loginSlice = createSlice({
  name: 'login',

  initialState,

  reducers: {
    loggedOut: (state) => {
      state.rememberMe = false
      state.email = null
      state.nickname = null
      state.avatar = ''
      state.is2FARequired = false
      state.accessToken = null
      state.id = null
      state.isAuthChecked = true
      localStorage.removeItem('user')
      sessionStorage.removeItem('user')
      clearSessionFlags()
    },

    doRememberMe: (state) => {
      state.rememberMe = true
    },

    tokenReceived: (state, action) => {
      const {
        accessToken,
        email,
        nickname,
        avatar,
        id,
        rememberMe,
        is2FARequired,
      } = action.payload

      if (accessToken !== undefined) {
        state.accessToken = accessToken
      }
      if (email !== undefined) {
        state.email = email
      }
      if (nickname !== undefined) {
        state.nickname = nickname
      }
      if (avatar !== undefined) {
        state.avatar = avatar || ''
      }
      if (id !== undefined) {
        state.id = id
      }
      if (rememberMe !== undefined) {
        state.rememberMe = rememberMe
      }
      if (is2FARequired !== undefined) {
        state.is2FARequired = is2FARequired
      }
      state.isAuthChecked = true

      if (state.accessToken) {
        localStorage.removeItem('user')
        sessionStorage.removeItem('user')
        persistSessionFlag(Boolean(state.rememberMe))
      }
    },

    authChecked: (state) => {
      state.isAuthChecked = true
    },
  },

  extraReducers(builder) {
    builder
      .addMatcher(
        matchEndpointFulfilled('loginAdmin'),
        (state, { payload }) => {
          state.email = payload.email
          state.nickname = payload.nickname
          state.avatar = payload.avatar || ''
          state.is2FARequired = payload.is2FARequired
          state.id = payload.id
          state.isAuthChecked = true

          if (payload.is2FARequired) {
            state.accessToken = null
            return
          }

          state.accessToken = payload.accessToken

          if (payload.accessToken && typeof window !== 'undefined') {
            localStorage.removeItem('user')
            sessionStorage.removeItem('user')
            persistSessionFlag(Boolean(state.rememberMe))
          }
        },
      )
      .addMatcher(
        matchEndpointFulfilled('verify2FA'),
        (state, { payload }) => {
          state.is2FARequired = false
          state.isAuthChecked = true

          if (!payload?.accessToken) {
            return
          }

          state.accessToken = payload.accessToken

          if (payload.email) {
            state.email = payload.email
          }
          if (payload.nickname) {
            state.nickname = payload.nickname
          }
          if (payload.avatar) {
            state.avatar = payload.avatar
          }
          if (payload.id) {
            state.id = payload.id
          }

          if (typeof window !== 'undefined') {
            localStorage.removeItem('user')
            sessionStorage.removeItem('user')
            persistSessionFlag(Boolean(state.rememberMe))
          }
        },
      )
  },
})

export const {
  loggedOut,
  doRememberMe,
  tokenReceived,
  authChecked,
} = loginSlice.actions

export const loginSelector = (state) => state.login
