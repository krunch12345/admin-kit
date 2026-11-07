import { fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { Mutex } from 'async-mutex'
import { showAlert } from '../ui/Alert/showAlertSlice.js'
import { tokenReceived } from './loginSlice.js'
import { handleLogout } from './handleLogout.js'
import { deepTrimStrings } from './deepTrimStrings.js'
import { extractMeta } from './extractMeta.js'
import { isRememberMeSession } from './sessionFlags.js'
import { getAdminKitMessages } from '../locale/runtime.js'

/**
 * @description Handles session expiration: shows alert and logs out user
 * @param {object} api - Redux Toolkit query API object
 */
const handleSessionExpired = (api) => {
  api.dispatch(
    showAlert({
      isShowAlert: true,
      severity: 'warning',
      message: getAdminKitMessages().auth.sessionExpired,
    })
  )
  api.dispatch(handleLogout())
}

/**
 * @typedef {object} AdminBaseQueryOptions
 * @property {string} [baseUrl] - API base url, defaults to '/api'.
 */

/**
 * @description Creates a baseQuery with automatic token refresh, CSRF handling and session expiration.
 * Requests may carry `__meta: { requiresAuth, silentAuthFailure, suppressGlobalError }`.
 * @param {AdminBaseQueryOptions} [options]
 * @returns {import('@reduxjs/toolkit/query').BaseQueryFn} - Upgraded baseQuery for createApi.
 */
export const createAdminBaseQuery = ({ baseUrl = '/api' } = {}) => {
  const mutex = new Mutex()

  const baseQuery = fetchBaseQuery({
    baseUrl,
    credentials: 'include',
  })

  /**
   * @description Refreshes the access token using the refresh token stored in httpOnly cookies
   * Uses a mutex to prevent concurrent refreshes.
   * @param {object} api - Redux Toolkit query API object
   * @param {object} extraOptions - Extra options for fetchBaseQuery
   * @returns {Promise<boolean>} - True if token refreshed successfully
   */
  const doRefresh = async (api, extraOptions) => {
    if (mutex.isLocked()) {
      await mutex.waitForUnlock()
      return Boolean(api.getState().login.accessToken)
    }

    const release = await mutex.acquire()
    try {
      const refreshResult = await baseQuery(
        { url: '/auth/refresh', method: 'POST' },
        api,
        extraOptions
      )

      if (refreshResult?.data?.accessToken) {
        const currentState = api.getState().login

        api.dispatch(
          tokenReceived({
            accessToken: refreshResult.data.accessToken,
            email: refreshResult.data.email || currentState.email,
            nickname: refreshResult.data.nickname || currentState.nickname,
            avatar: refreshResult.data.avatar || currentState.avatar || '',
            is2FARequired: refreshResult.data.is2FARequired ?? currentState.is2FARequired,
            id: refreshResult.data.id || currentState.id,
            rememberMe: isRememberMeSession() || Boolean(currentState.rememberMe),
          })
        )
        return true
      }

      return false
    } finally {
      release()
    }
  }

  /**
   * @description Fetches CSRF token, refreshes access token if expired
   * @param {object} api - Redux Toolkit query API object
   * @param {object} extraOptions - Extra options
   * @returns {Promise<string|null>} - CSRF token or null
   */
  const fetchCsrfToken = async (api, extraOptions) => {
    const accessToken = api.getState().login.accessToken
    if (!accessToken) return null

    const res = await baseQuery(
      {
        url: '/csrfToken',
        method: 'GET',
        headers: { Authorization: `Bearer ${accessToken}` },
      },
      api,
      extraOptions
    )

    if (res?.error?.status === 401) {
      const refreshed = await doRefresh(api, extraOptions)
      if (!refreshed) return null
      return fetchCsrfToken(api, extraOptions)
    }

    return res?.data?.csrfToken || null
  }

  return async (args, api, extraOptions) => {
    await mutex.waitForUnlock()

    const { meta, cleanArgs } = extractMeta(args)
    const requiresAuth = meta?.requiresAuth !== false
    const silentAuthFailure = meta?.silentAuthFailure === true
    const suppressGlobalError = meta?.suppressGlobalError === true

    const loginState = api.getState().login
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

    let modifiedArgs = { ...cleanArgs }
    if (modifiedArgs.body && !(modifiedArgs.body instanceof FormData)) {
      modifiedArgs = { ...modifiedArgs, body: deepTrimStrings(modifiedArgs.body) }
    }

    const isFormData = modifiedArgs.body instanceof FormData
    const method =
      typeof modifiedArgs === 'string' ? 'GET' : (modifiedArgs.method || 'GET').toUpperCase()
    const isStateChanging = ['POST', 'PUT', 'DELETE', 'PATCH'].includes(method)

    const handleExpired = () => {
      if (silentAuthFailure) {
        api.dispatch(handleLogout())
      } else {
        handleSessionExpired(api)
      }
    }

    /**
     * @description Reads the double-submit CSRF value from the readable cookie.
     * @returns {string|undefined}
     */
    const readCsrfCookie = () => {
      const cookieVal = document.cookie
        .split('; ')
        .find((c) => c.startsWith('csrfToken='))
      return cookieVal ? cookieVal.split('=').slice(1).join('=') : undefined
    }

    /**
     * @description Builds headers including Authorization and CSRF token
     * @param {string} [csrfOverride] - Prefer this token (e.g. fresh body from /csrfToken)
     */
    const getHeaders = (csrfOverride) => {
      const headers = {
        ...modifiedArgs.headers,
        Authorization: requiresAuth && api.getState().login.accessToken
          ? `Bearer ${api.getState().login.accessToken}`
          : undefined,
        ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
      }

      if (isStateChanging) {
        const csrfToken = csrfOverride || readCsrfCookie()
        if (csrfToken) headers['csrf-token'] = csrfToken
      }

      return headers
    }

    const authorizedQuery = (csrfOverride) => baseQuery(
      { ...modifiedArgs, headers: getHeaders(csrfOverride) },
      api,
      extraOptions,
    )

    const tokenAtRequestStart = api.getState().login.accessToken
    let result = await authorizedQuery()

    /**
     * @description Handle 401: always try refresh, logout if failed
     */
    if (result?.error?.status === 401) {
      const refreshed = await doRefresh(api, extraOptions)

      if (!refreshed) {
        const tokenNow = api.getState().login.accessToken

        // Login (or another flow) may have established a newer session while this
        // request — e.g. /auth/me restore without Authorization — was failing.
        if (silentAuthFailure && tokenNow && tokenNow !== tokenAtRequestStart) {
          return result
        }

        handleExpired()
        return result
      }

      result = await authorizedQuery()
    }

    /**
     * @description Handle 403 on state-changing requests: try refresh CSRF once, logout if failed
     */
    if (result?.error?.status === 403 && isStateChanging) {
      const newCsrf = await fetchCsrfToken(api, extraOptions)
      if (newCsrf) {
        result = await authorizedQuery(newCsrf)
      } else {
        handleExpired()
        return result
      }
    }

    /**
     * @description Show any error messages
     */
    if (!suppressGlobalError && (result?.error || result?.data?.error)) {
      const errorMessage =
        result.error?.data?.message ||
        JSON.stringify(result?.error) ||
        result.data?.message ||
        'Unknown error'
      api.dispatch(showAlert({ isShowAlert: true, severity: 'error', message: errorMessage }))
    }

    return result
  }
}
