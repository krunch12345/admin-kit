import { useContext } from 'react'
import { AdminKitRuntimeContext } from './AdminKitRuntimeContext'
import type { AdminKitApiHooks, AdminKitRuntimeValue } from './AdminKitRuntimeContext'
import type { AdminKitConfig } from './defaults'

export const useAdminKitRuntime = (): AdminKitRuntimeValue => useContext(AdminKitRuntimeContext)

export const useAdminKitHooks = (): AdminKitApiHooks => {
  const { hooks } = useAdminKitRuntime()

  if (!hooks) {
    throw new Error(
      'admin-kit API hooks are not available. Pass `api` (or `hooks`) to <AdminKitProvider>.',
    )
  }

  return hooks
}

export const useAdminKitConfig = (): AdminKitConfig => useAdminKitRuntime().config
