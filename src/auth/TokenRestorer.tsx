import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import type { ThunkDispatch, UnknownAction } from '@reduxjs/toolkit'
import { useNavigate } from 'react-router-dom'
import { authChecked, loginSelector, tokenReceived } from './loginSlice'
import { handleLogout } from './handleLogout'
import { hasPersistedSession, isRememberMeSession } from './sessionFlags'
import { useAdminKitConfig, useAdminKitHooks } from '../config/useAdminKitRuntime'

/**
 * Restores the admin session after a full reload using the httpOnly refresh cookie.
 * Renders nothing; mount it once inside the router and the redux Provider.
 */
export const TokenRestorer = (): null => {
  const { useGetCurrentUserQuery } = useAdminKitHooks()
  const { routes } = useAdminKitConfig()

  const dispatch = useDispatch<ThunkDispatch<unknown, unknown, UnknownAction>>()
  const navigate = useNavigate()
  const { accessToken: accessTokenFromStore } = useSelector(loginSelector)

  const hasLocalSession = hasPersistedSession()
  const rememberMe = isRememberMeSession()
  /**
   * Only call /auth/me when the browser marks a persisted session but Redux has no token yet
   * (full reload). If we already have an access token — e.g. just after login or 2FA — skip
   * restore; a parallel /auth/me failure would otherwise log the user out and send them to /login.
   */
  const shouldRestoreSession = hasLocalSession && !accessTokenFromStore

  const { data, isError, isLoading, isFetching } = useGetCurrentUserQuery(undefined, {
    skip: !shouldRestoreSession,
  })

  useEffect(() => {
    if (!shouldRestoreSession) {
      dispatch(authChecked())
      return
    }

    const isQueryPending = isLoading || isFetching

    if (isQueryPending) {
      return
    }

    if (isError) {
      // User may have logged in while /auth/me was in flight — keep that session.
      if (accessTokenFromStore) {
        dispatch(authChecked())
        return
      }

      dispatch(handleLogout())
      navigate(routes.login)
      return
    }

    if (data && data.accessToken) {
      dispatch(
        tokenReceived({
          accessToken: data.accessToken,
          email: data.email,
          nickname: data.nickname,
          avatar: data.avatar || '',
          is2FARequired: data.is2FARequired,
          id: data.id,
          role: data.role,
          rememberMe,
        }),
      )
    } else {
      dispatch(authChecked())
    }
  }, [
    data,
    isError,
    isFetching,
    isLoading,
    dispatch,
    shouldRestoreSession,
    rememberMe,
    navigate,
    accessTokenFromStore,
    routes.login,
  ])

  return null
}
