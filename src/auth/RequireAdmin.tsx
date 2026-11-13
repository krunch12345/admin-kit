import type { ReactNode } from 'react'
import { Box, CircularProgress } from '@mui/material'
import { Navigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { loginSelector } from './loginSlice'
import { useAdminKitConfig } from '../config/useAdminKitRuntime'

export interface RequireAdminProps {
  children: ReactNode
}

/**
 * Renders children only when Redux `role` is `'admin'`.
 * Redirects to the configured home route otherwise.
 */
export const RequireAdmin = ({ children }: RequireAdminProps) => {
  const { role, isAuthChecked } = useSelector(loginSelector)
  const { routes } = useAdminKitConfig()

  if (!isAuthChecked) {
    return (
      <Box display='flex' justifyContent='center' alignItems='center' minHeight='40vh' width='100%'>
        <CircularProgress />
      </Box>
    )
  }

  if (role !== 'admin') {
    return (
      <Navigate
        to={routes.home}
        replace
      />
    )
  }

  return <>{children}</>
}
