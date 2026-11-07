import { fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import type {
  BaseQueryApi,
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
  FetchBaseQueryMeta,
} from '@reduxjs/toolkit/query/react'
import { Mutex } from 'async-mutex'
import { showAlert } from '../ui/Alert/showAlertSlice'
import { tokenReceived } from './loginSlice'
import type { LoginRootState, LoginState } from './loginSlice'
import { handleLogout } from './handleLogout'
import { deepTrimStrings } from './deepTrimStrings'
import { isRememberMeSession } from './sessionFlags'
import { getAdminKitMessages } from '../locale/runtime'

const AUTH_NO_REFRESH_PATHS = new Set([
  '/auth/loginAdmin',
  '/auth/verify2FACode',
  '/auth/logout',
  '/auth/refresh',
])

export interface AdminBaseQueryOptions {
  baseUrl?: string
}

export interface AdminKitExtraOptions {
  requiresAuth?: boolean
  silentAuthFailure?: boolean
  suppressGlobalError?: boolean
}

export type AdminBaseQueryFn = BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError,
  AdminKitExtraOptions,
  FetchBaseQueryMeta
>

type RequestResult = Awaited<ReturnType<AdminBaseQueryFn>>

const toRecord = (value: unknown): Record<string, unknown> => (
  value !== null && typeof value === 'object' ? value as Record<string, unknown> : {}
)

const getLoginState = (api: BaseQueryApi): LoginState => (api.getState() as LoginRootState).login

const handleSessionExpired = (api: BaseQueryApi): void => {
  api.dispatch(
    showAlert({
      isShowAlert: true,
      severity: 'warning',
      message: getAdminKitMessages().auth.sessionExpired,
    }),
  )
  api.dispatch(handleLogout({ revokeServer: false }))
}

const getRequestUrl = (args: FetchArgs): string => (
  typeof args.url === 'string' ? args.url : ''
)

const readCsrfCookie = (): string | undefined => {
  if (typeof document === 'undefined') return undefined

  const cookieVal = document.cookie
    .split('; ')
    .find((cookie) => cookie.startsWith('csrfToken='))

  if (!cookieVal) return undefined

  const rawValue = cookieVal.split('=').slice(1).join('=')

  try {
    return decodeURIComponent(rawValue)
  } catch {
    return rawValue
  }
}

/**
 * Creates a baseQuery with automatic token refresh, CSRF handling and session expiration.
 * Pass options via endpoint `extraOptions` (not `__meta` on the request body).
 */
export const createAdminBaseQuery = ({ baseUrl = '/api' }: AdminBaseQueryOptions = {}): AdminBaseQueryFn => {
  const mutex = new Mutex()
  let refreshPromise: Promise<boolean> | null = null

  const baseQuery = fetchBaseQuery({
    baseUrl,
    credentials: 'include',
  })

  const doRefresh = async (api: BaseQueryApi, extraOptions: AdminKitExtraOptions): Promise<boolean> => {
    if (refreshPromise) {
      return refreshPromise
    }

    refreshPromise = (async () => {
      const release = await mutex.acquire()
      try {
        const refreshResult = await baseQuery(
          { url: '/auth/refresh', method: 'POST' },
          api,
          extraOptions,
        )
        const refreshed = toRecord(refreshResult.data)

        if (typeof refreshed.accessToken === 'string' && refreshed.accessToken) {
          const currentState = getLoginState(api)

          api.dispatch(
            tokenReceived({
              accessToken: refreshed.accessToken,
              email: (refreshed.email as string | null | undefined) || currentState.email,
              nickname: (refreshed.nickname as string | null | undefined) || currentState.nickname,
              avatar: (refreshed.avatar as string | null | undefined) || currentState.avatar || '',
              is2FARequired: (refreshed.is2FARequired as boolean | undefined) ?? currentState.is2FARequired,
              id: (refreshed.id as string | null | undefined) || currentState.id,
              rememberMe: isRememberMeSession() || Boolean(currentState.rememberMe),
            }),
          )
          return true
        }

        return false
      } finally {
        release()
        refreshPromise = null
      }
    })()

    return refreshPromise
  }

  const fetchCsrfToken = async (
    api: BaseQueryApi,
    extraOptions: AdminKitExtraOptions,
    allowRefresh = true,
  ): Promise<string | null> => {
    const { accessToken } = getLoginState(api)
    if (!accessToken) return null

    const res = await baseQuery(
      {
        url: '/csrfToken',
        method: 'GET',
        headers: { Authorization: `Bearer ${accessToken}` },
      },
      api,
      extraOptions,
    )

    if (res.error?.status === 401) {
      if (!allowRefresh) return null
      const refreshed = await doRefresh(api, extraOptions)
      if (!refreshed) return null
      return fetchCsrfToken(api, extraOptions, false)
    }

    const csrfToken = toRecord(res.data).csrfToken
    return typeof csrfToken === 'string' && csrfToken ? csrfToken : null
  }

  return async (args, api, extraOptions = {}) => {
    await mutex.waitForUnlock()

    const requiresAuth = extraOptions.requiresAuth !== false
    const silentAuthFailure = extraOptions.silentAuthFailure === true
    const suppressGlobalError = extraOptions.suppressGlobalError === true

    const loginState = getLoginState(api)
    const hasCheckedAuth = loginState?.isAuthChecked
    const hasAccessToken = Boolean(loginState?.accessToken)

    if (requiresAuth && hasCheckedAuth && !hasAccessToken) {
      return {
        error: {
          status: 401,
          data: {
            message: getAdminKitMessages().auth.authorizationRequired,
          },
        },
      }
    }

    const normalizedArgs: FetchArgs & { __meta?: unknown } = typeof args === 'string'
      ? { url: args }
      : { ...args }

    // Strip legacy __meta if a consumer still sends it.
    if (normalizedArgs.__meta) {
      delete normalizedArgs.__meta
    }

    let modifiedArgs: FetchArgs = normalizedArgs
    if (modifiedArgs.body && !(modifiedArgs.body instanceof FormData)) {
      modifiedArgs = { ...modifiedArgs, body: deepTrimStrings(modifiedArgs.body) }
    }

    const requestUrl = getRequestUrl(modifiedArgs)
    const skipAuthRecovery = AUTH_NO_REFRESH_PATHS.has(requestUrl)
    const isFormData = modifiedArgs.body instanceof FormData
    const method = (modifiedArgs.method || 'GET').toUpperCase()
    const isStateChanging = ['POST', 'PUT', 'DELETE', 'PATCH'].includes(method)

    const handleExpired = (): void => {
      if (silentAuthFailure) {
        api.dispatch(handleLogout({ revokeServer: false }))
      } else {
        handleSessionExpired(api)
      }
    }

    const getHeaders = (csrfOverride?: string): Record<string, string> => {
      const currentToken = getLoginState(api).accessToken
      const headers: Record<string, string> = {
        ...(modifiedArgs.headers as Record<string, string> | undefined),
        ...(requiresAuth && currentToken ? { Authorization: `Bearer ${currentToken}` } : {}),
        ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
      }

      if (isStateChanging) {
        const csrfToken = csrfOverride || readCsrfCookie()
        if (csrfToken) headers['csrf-token'] = csrfToken
      }

      return headers
    }

    const authorizedQuery = async (csrfOverride?: string): Promise<RequestResult> => baseQuery(
      { ...modifiedArgs, headers: getHeaders(csrfOverride) },
      api,
      extraOptions,
    )

    const tokenAtRequestStart = getLoginState(api).accessToken
    let result = await authorizedQuery()

    if (
      result.error?.status === 401
      && requiresAuth
      && !skipAuthRecovery
    ) {
      const refreshed = await doRefresh(api, extraOptions)

      if (!refreshed) {
        const tokenNow = getLoginState(api).accessToken

        if (silentAuthFailure && tokenNow && tokenNow !== tokenAtRequestStart) {
          return result
        }

        handleExpired()
        return result
      }

      result = await authorizedQuery()
    }

    if (
      result.error?.status === 403
      && isStateChanging
      && requiresAuth
      && !skipAuthRecovery
    ) {
      const errorData = toRecord(result.error.data)
      const errorCode = errorData.code
      const looksLikeCsrf = errorCode === 'EBADCSRFTOKEN'
        || errorCode === 'csrf'
        || /csrf/i.test(String(errorData.message || ''))

      if (looksLikeCsrf || errorCode == null) {
        const newCsrf = await fetchCsrfToken(api, extraOptions)
        if (newCsrf) {
          result = await authorizedQuery(newCsrf)
        } else if (looksLikeCsrf) {
          handleExpired()
          return result
        }
      }
    }

    const resultData = toRecord(result.data)

    if (!suppressGlobalError && (result.error || resultData.error)) {
      const errorMessage = [toRecord(result.error?.data).message, resultData.message]
        .find((candidate): candidate is string => typeof candidate === 'string' && candidate.length > 0)
        ?? getAdminKitMessages().auth.authorizationRequired
      api.dispatch(showAlert({ isShowAlert: true, severity: 'error', message: errorMessage }))
    }

    return result
  }
}
