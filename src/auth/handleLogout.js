import { loggedOut } from './loginSlice.js'
import { getRequestLogout } from './runtimeHooks.js'

/**
 * Clears the client session.
 * When `revokeServer` is true (default) and `requestLogout` was registered via
 * `initAdminKitAuth`, also asks the backend to revoke the refresh cookie.
 * Local state is always cleared, even if the network call fails.
 *
 * Pass `{ revokeServer: false }` for login/2FA error paths so a failed attempt
 * does not destroy an existing refresh session in the same browser.
 *
 * @param {{ revokeServer?: boolean }} [options]
 * @returns {function(function): Promise<void>}
 */
export const handleLogout = ({ revokeServer = true } = {}) => async (dispatch) => {
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
}
