import { configureStore } from '@reduxjs/toolkit'
import type { Middleware, UnknownAction } from '@reduxjs/toolkit'
import { loginSlice, tokenReceived } from '../src/auth/loginSlice'
import type { LoginState, TokenReceivedPayload } from '../src/auth/loginSlice'
import { showAlertSlice } from '../src/ui/Alert/showAlertSlice'
import { showLoadingSlice } from '../src/ui/Loading/showLoadingSlice'

const LOGGED_OUT = `${loginSlice.name}/loggedOut`

/**
 * Storybook-only: after Sign out, restore the demo session so shell stories stay usable.
 */
const createRestoreDemoUserMiddleware = (demoUser: TokenReceivedPayload): Middleware => (
  (store) => (next) => (action) => {
    const result = next(action)

    if ((action as UnknownAction).type === LOGGED_OUT) {
      store.dispatch(tokenReceived({
        ...demoUser,
        is2FARequired: false,
      }))
    }

    return result
  }
)

export const createStoryStore = (
  preloadedState?: Record<string, unknown>,
  options?: { restoreDemoUserAfterLogout?: boolean },
) => {
  const loginState = preloadedState?.login as LoginState | undefined
  const restoreDemoUser = Boolean(options?.restoreDemoUserAfterLogout && loginState?.nickname)

  return configureStore({
    reducer: {
      [loginSlice.name]: loginSlice.reducer,
      [showAlertSlice.name]: showAlertSlice.reducer,
      [showLoadingSlice.name]: showLoadingSlice.reducer,
    },
    preloadedState,
    middleware: (getDefaultMiddleware) => {
      if (!restoreDemoUser || !loginState) {
        return getDefaultMiddleware()
      }

      return getDefaultMiddleware().concat(
        createRestoreDemoUserMiddleware({
          accessToken: loginState.accessToken,
          email: loginState.email,
          nickname: loginState.nickname,
          avatar: loginState.avatar,
          id: loginState.id,
          rememberMe: loginState.rememberMe,
          is2FARequired: false,
        }),
      )
    },
  })
}

export type StoryStore = ReturnType<typeof createStoryStore>
