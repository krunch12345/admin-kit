/**
 * Imperative registry for logout helpers used outside React (baseQuery / thunks).
 * Populated by AdminKitProvider; replaces the old initAdminKitAuth singletons for hooks.
 */

export type RequestLogoutHandler = () => Promise<unknown>
export type ResetApiStateHandler = () => void

export interface AuthRuntimeHandlers {
  requestLogout?: RequestLogoutHandler | null
  resetApiState?: ResetApiStateHandler | null
}

let requestLogout: RequestLogoutHandler | null = null
let resetApiState: ResetApiStateHandler | null = null

export const registerAuthRuntimeHandlers = ({
  requestLogout: nextRequestLogout = null,
  resetApiState: nextResetApiState = null,
}: AuthRuntimeHandlers = {}): void => {
  requestLogout = nextRequestLogout
  resetApiState = nextResetApiState
}

export const getRequestLogout = (): RequestLogoutHandler | null => requestLogout

export const getResetApiState = (): ResetApiStateHandler | null => resetApiState
