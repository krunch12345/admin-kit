import type { ThunkAction, UnknownAction } from '@reduxjs/toolkit'
import { loggedOut } from './loginSlice'
import { getRequestLogout, getResetApiState } from './runtimeRegistry'

export interface HandleLogoutOptions {
  revokeServer?: boolean
}

export type HandleLogoutThunk = ThunkAction<Promise<void>, unknown, unknown, UnknownAction>

/**
 * Clears the client session.
 * When `revokeServer` is true (default) and `requestLogout` was registered via
 * AdminKitProvider, also asks the backend to revoke the refresh cookie.
 *
 * Pass `{ revokeServer: false }` for login/2FA error paths and session-expiry
 * handling so a failed attempt does not recurse through `/auth/logout`.
 */
export const handleLogout = ({ revokeServer = true }: HandleLogoutOptions = {}): HandleLogoutThunk => async (dispatch) => {
  if (revokeServer) {
    const requestLogout = getRequestLogout()

    if (requestLogout) {
      try {
        await requestLogout()
      } catch {
        // Always clear the client session after an explicit logout.
      }
    }
  }

  dispatch(loggedOut())

  const resetApiState = getResetApiState()
  if (resetApiState) {
    resetApiState()
  }
}
