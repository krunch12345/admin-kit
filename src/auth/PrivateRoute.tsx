import type { ReactNode } from 'react'
import { Box, CircularProgress } from '@mui/material'
import { Navigate, useLocation } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { loginSelector } from './loginSlice'
import { useAdminKitConfig } from '../config/useAdminKitRuntime'

export interface PrivateRouteProps {
  children: ReactNode
}

/**
 * Renders children only when an access token is present.
 * Redirects to the configured login route with `replace` and `state.from`.
 */
export const PrivateRoute = ({ children }: PrivateRouteProps) => {
  const { accessToken, isAuthChecked } = useSelector(loginSelector)
  const { routes } = useAdminKitConfig()
  const location = useLocation()

  if (!isAuthChecked) {
    return (
      <Box display='flex' justifyContent='center' alignItems='center' minHeight='40vh' width='100%'>
        <CircularProgress />
      </Box>
    )
  }

  if (!accessToken) {
    return (
      <Navigate
        to={routes.login}
        replace
        state={{ from: location }}
      />
    )
  }

  return <>{children}</>
}
