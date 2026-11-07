import { createListenerMiddleware } from '@reduxjs/toolkit'
import type { ListenerMiddlewareInstance, UnknownAction } from '@reduxjs/toolkit'
import {
  loggedOut,
  tokenReceived,
} from './loginSlice'
import type { LoginRootState } from './loginSlice'
import {
  clearLegacyUserKeys,
  clearSessionFlags,
  persistSessionFlag,
} from './sessionFlags'

const AUTH_MUTATION_ENDPOINTS = new Set(['loginAdmin', 'verify2FA'])

const isAuthMutationFulfilled = (action: UnknownAction): boolean => {
  const { meta } = action as { meta?: { arg?: { endpointName?: string } } }

  return action.type.endsWith('/executeMutation/fulfilled')
    && AUTH_MUTATION_ENDPOINTS.has(meta?.arg?.endpointName ?? '')
}

/**
 * Side-effect listeners for auth storage. Keeps loginSlice reducers pure.
 */
export const createAuthListenerMiddleware = (): ListenerMiddlewareInstance => {
  const middleware = createListenerMiddleware()

  middleware.startListening({
    actionCreator: loggedOut,
    effect: () => {
      clearSessionFlags()
      clearLegacyUserKeys()
    },
  })

  middleware.startListening({
    actionCreator: tokenReceived,
    effect: (action) => {
      clearLegacyUserKeys()
      const rememberMe = Boolean(action.payload?.rememberMe)
      if (action.payload?.accessToken) {
        persistSessionFlag(rememberMe)
      }
    },
  })

  middleware.startListening({
    predicate: isAuthMutationFulfilled,
    effect: (_action, api) => {
      clearLegacyUserKeys()
      const state = (api.getState() as LoginRootState).login
      if (state?.accessToken) {
        persistSessionFlag(Boolean(state.rememberMe))
      }
    },
  })

  return middleware
}
