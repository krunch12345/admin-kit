import { createSlice, isFulfilled } from '@reduxjs/toolkit'
import type { PayloadAction, UnknownAction } from '@reduxjs/toolkit'

export interface LoginState {
  email: string | null
  nickname: string | null
  avatar: string
  is2FARequired: boolean
  accessToken: string | null
  rememberMe: boolean
  id: string | null
  role: string | null
  isAuthChecked: boolean
}

export interface LoginRootState {
  login: LoginState
}

export interface TokenReceivedPayload {
  accessToken?: string | null
  email?: string | null
  nickname?: string | null
  avatar?: string | null
  id?: string | null
  role?: string | null
  rememberMe?: boolean
  is2FARequired?: boolean
}

export interface LoginAdminResponse {
  email: string | null
  nickname: string | null
  avatar?: string | null
  is2FARequired: boolean
  id: string | null
  accessToken: string | null
  role?: string | null
}

export type Verify2FAResponse = Partial<Omit<LoginAdminResponse, 'is2FARequired'>> | undefined

type EndpointFulfilledAction<Payload> = PayloadAction<Payload, string, { arg: { endpointName: string } }>

const getEndpointName = (action: UnknownAction): unknown => {
  const { meta } = action as { meta?: { arg?: { endpointName?: unknown } } }
  return meta?.arg?.endpointName
}

/**
 * Matches a fulfilled RTK Query action by endpoint name, independent of the app's api instance.
 */
const matchEndpointFulfilled = <Payload>(endpointName: string) => (
  action: UnknownAction,
): action is EndpointFulfilledAction<Payload> => (
  isFulfilled(action) && getEndpointName(action) === endpointName
)

const initialState: LoginState = {
  email: null,
  nickname: null,
  avatar: '',
  is2FARequired: false,
  accessToken: null,
  rememberMe: false,
  id: null,
  role: null,
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
      state.role = null
      state.isAuthChecked = true
    },

    doRememberMe: (state) => {
      state.rememberMe = true
    },

    tokenReceived: (state, action: PayloadAction<TokenReceivedPayload>) => {
      const {
        accessToken,
        email,
        nickname,
        avatar,
        id,
        role,
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
      if (role !== undefined) {
        state.role = role
      }
      if (rememberMe !== undefined) {
        state.rememberMe = rememberMe
      }
      if (is2FARequired !== undefined) {
        state.is2FARequired = is2FARequired
      }
      state.isAuthChecked = true
    },

    authChecked: (state) => {
      state.isAuthChecked = true
    },
  },

  extraReducers: (builder) => {
    builder
      .addMatcher(
        matchEndpointFulfilled<LoginAdminResponse>('loginAdmin'),
        (state, { payload }) => {
          state.email = payload.email
          state.nickname = payload.nickname
          state.avatar = payload.avatar || ''
          state.is2FARequired = payload.is2FARequired
          state.id = payload.id
          state.isAuthChecked = true

          if (payload.role !== undefined) {
            state.role = payload.role
          }

          if (payload.is2FARequired) {
            state.accessToken = null
            return
          }

          state.accessToken = payload.accessToken
        },
      )
      .addMatcher(
        matchEndpointFulfilled<Verify2FAResponse>('verify2FA'),
        (state, { payload }) => {
          state.isAuthChecked = true
          // Successful verify means 2FA is active (login challenge or pending setup).
          state.is2FARequired = true

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
          if (payload.role !== undefined) {
            state.role = payload.role
          }
        },
      )
      .addMatcher(
        matchEndpointFulfilled<unknown>('disable2FA'),
        (state) => {
          state.is2FARequired = false
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

export const loginSelector = (state: LoginRootState): LoginState => state.login
