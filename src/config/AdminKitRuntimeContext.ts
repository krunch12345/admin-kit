import { createContext } from 'react'
import type { TypedUseMutation, TypedUseQuery } from '@reduxjs/toolkit/query/react'
import type { AdminBaseQueryFn } from '../auth/createAdminBaseQuery'
import type { LoginAdminResponse, Verify2FAResponse } from '../auth/loginSlice'
import { resolveAdminKitConfig } from './defaults'
import type { AdminKitConfig } from './defaults'

export interface LoginAdminParams {
  email: string
  password: string
  /** When false, refresh cookie is session-scoped; true/omitted → persistent (7d). */
  rememberMe?: boolean
}

export interface Verify2FAParams {
  email: string
  token: string
  /** When false, refresh cookie is session-scoped; true/omitted → persistent (7d). */
  rememberMe?: boolean
}

export interface AdminKitCurrentUser {
  accessToken?: string
  email?: string | null
  nickname?: string | null
  avatar?: string | null
  is2FARequired?: boolean
  id?: string | null
}

/** RTK Query generated mutation hook bound to the admin-kit base query. */
export type AdminKitMutationHook<Result = unknown, Arg = void> = TypedUseMutation<Result, Arg, AdminBaseQueryFn>

/** RTK Query generated query hook bound to the admin-kit base query. */
export type AdminKitQueryHook<Result = unknown, Arg = void> = TypedUseQuery<Result, Arg, AdminBaseQueryFn>

export interface AdminKitApiHooks {
  useLoginAdminMutation: AdminKitMutationHook<LoginAdminResponse, LoginAdminParams>
  useVerify2FAMutation: AdminKitMutationHook<Verify2FAResponse, Verify2FAParams>
  useEnable2FAMutation: AdminKitMutationHook
  useGetCurrentUserQuery: AdminKitQueryHook<AdminKitCurrentUser>
  useGetAdminMenuQuery: AdminKitQueryHook
  useInvalidateAllCacheMutation: AdminKitMutationHook
  requestLogout?: () => Promise<unknown>
  resetApiState?: () => void
}

export interface AdminKitEndpoint {
  useMutation?: AdminKitMutationHook<any, any>
  useQuery?: AdminKitQueryHook<any, any>
}

export interface AdminKitApi {
  endpoints: Record<string, AdminKitEndpoint | undefined>
}

export interface AdminKitRuntimeValue {
  api: AdminKitApi | null
  hooks: AdminKitApiHooks | null
  config: AdminKitConfig
}

export const defaultAdminKitRuntime: AdminKitRuntimeValue = {
  api: null,
  hooks: null,
  config: resolveAdminKitConfig(),
}

export const AdminKitRuntimeContext = createContext<AdminKitRuntimeValue>(defaultAdminKitRuntime)
