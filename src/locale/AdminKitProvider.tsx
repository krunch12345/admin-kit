import { useEffect, useMemo } from 'react'
import type { ReactNode } from 'react'
import { ModalDataProvider } from '../ui/Modal/ModalDataProvider'
import { AdminKitContext } from './AdminKitContext'
import type { AdminKitContextValue } from './AdminKitContext'
import { configureAdminKit } from './runtime'
import { AdminKitRuntimeContext } from '../config/AdminKitRuntimeContext'
import type {
  AdminKitApi,
  AdminKitApiHooks,
  AdminKitCurrentUser,
  AdminKitMutationHook,
  AdminKitQueryHook,
  AdminKitRuntimeValue,
  Disable2FAParams,
  Enable2FAResponse,
  LoginAdminParams,
  Verify2FAParams,
} from '../config/AdminKitRuntimeContext'
import { resolveAdminKitConfig } from '../config/defaults'
import type { AdminKitConfigOverrides } from '../config/defaults'
import { registerAuthRuntimeHandlers } from '../auth/runtimeRegistry'
import { configureSessionStorageKeys } from '../auth/sessionFlags'
import type { LoginAdminResponse, Verify2FAResponse } from '../auth/loginSlice'
import type { AdminKitLocale, AdminKitMessages, DeepPartial } from './types'

const REQUIRED_ENDPOINTS = [
  'loginAdmin',
  'verify2FA',
  'enable2FA',
  'disable2FA',
  'getCurrentUser',
  'getAdminMenu',
  'invalidateAllCache',
  'logoutAdmin',
] as const

const getMutationHook = <Result = unknown, Arg = void>(
  api: AdminKitApi,
  endpointName: string,
): AdminKitMutationHook<Result, Arg> => {
  const hook = api.endpoints[endpointName]?.useMutation

  if (!hook) {
    throw new Error(`AdminKitProvider: api endpoint \`${endpointName}\` has no useMutation hook`)
  }

  return hook
}

const getQueryHook = <Result = unknown, Arg = void>(
  api: AdminKitApi,
  endpointName: string,
): AdminKitQueryHook<Result, Arg> => {
  const hook = api.endpoints[endpointName]?.useQuery

  if (!hook) {
    throw new Error(`AdminKitProvider: api endpoint \`${endpointName}\` has no useQuery hook`)
  }

  return hook
}

/**
 * Builds RTK Query hook accessors from a createApi() instance.
 */
const hooksFromApi = (api: AdminKitApi): AdminKitApiHooks => {
  const { endpoints } = api

  if (!endpoints) {
    throw new Error('AdminKitProvider: `api` must be an RTK Query createApi() instance')
  }

  const missing = REQUIRED_ENDPOINTS.filter((name) => !endpoints[name])
  if (missing.length > 0) {
    throw new Error(`AdminKitProvider: api is missing endpoints: ${missing.join(', ')}`)
  }

  return {
    useLoginAdminMutation: getMutationHook<LoginAdminResponse, LoginAdminParams>(api, 'loginAdmin'),
    useVerify2FAMutation: getMutationHook<Verify2FAResponse, Verify2FAParams>(api, 'verify2FA'),
    useEnable2FAMutation: getMutationHook<Enable2FAResponse, void>(api, 'enable2FA'),
    useDisable2FAMutation: getMutationHook<{ message?: string }, Disable2FAParams>(api, 'disable2FA'),
    useGetCurrentUserQuery: getQueryHook<AdminKitCurrentUser>(api, 'getCurrentUser'),
    useGetAdminMenuQuery: getQueryHook(api, 'getAdminMenu'),
    useInvalidateAllCacheMutation: getMutationHook(api, 'invalidateAllCache'),
    // Consumers should pass `requestLogout` for full control over server-side logout.
    requestLogout: async () => undefined,
    resetApiState: undefined,
  }
}

export interface AdminKitProviderProps {
  locale?: AdminKitLocale
  messages?: DeepPartial<AdminKitMessages>
  includeModalProvider?: boolean
  /** RTK Query api (preferred). Must include auth + shell endpoints. */
  api?: AdminKitApi
  /** Explicit hooks override/extension. */
  hooks?: AdminKitApiHooks
  config?: AdminKitConfigOverrides
  requestLogout?: () => Promise<unknown>
  resetApiState?: () => void
  children: ReactNode
}

/**
 * Root admin-kit provider: locale, modal, API hooks, and route/storage config.
 */
export const AdminKitProvider = ({
  locale = 'en',
  messages,
  includeModalProvider = true,
  api,
  hooks: hooksProp,
  config: configProp,
  requestLogout,
  resetApiState,
  children,
}: AdminKitProviderProps) => {
  const resolvedLocale: AdminKitLocale = locale === 'ru' ? 'ru' : 'en'

  const resolvedMessages = useMemo(
    () => configureAdminKit({ locale: resolvedLocale, messages }),
    [resolvedLocale, messages],
  )

  const contextLocale = useMemo<AdminKitContextValue>(() => ({
    locale: resolvedLocale,
    messages: resolvedMessages,
  }), [resolvedLocale, resolvedMessages])

  const config = useMemo(
    () => resolveAdminKitConfig(configProp),
    [configProp],
  )

  const hooks = useMemo<AdminKitApiHooks | null>(() => {
    const base = hooksProp || (api ? hooksFromApi(api) : null)
    if (!base) return null

    return {
      ...base,
      requestLogout: requestLogout || base.requestLogout,
      resetApiState: resetApiState || base.resetApiState,
    }
  }, [api, hooksProp, requestLogout, resetApiState])

  const runtimeValue = useMemo<AdminKitRuntimeValue>(() => ({
    api: api || null,
    hooks,
    config,
  }), [api, hooks, config])

  useEffect(() => {
    configureAdminKit({ locale: resolvedLocale, messages })
  }, [resolvedLocale, messages])

  useEffect(() => {
    configureSessionStorageKeys(config.storageKeys)
  }, [config.storageKeys])

  useEffect(() => {
    registerAuthRuntimeHandlers({
      requestLogout: hooks?.requestLogout || null,
      resetApiState: hooks?.resetApiState || null,
    })

    return () => {
      registerAuthRuntimeHandlers({})
    }
  }, [hooks])

  const content = (
    <AdminKitRuntimeContext.Provider value={runtimeValue}>
      <AdminKitContext.Provider value={contextLocale}>
        {children}
      </AdminKitContext.Provider>
    </AdminKitRuntimeContext.Provider>
  )

  if (!includeModalProvider) {
    return content
  }

  return (
    <ModalDataProvider>
      {content}
    </ModalDataProvider>
  )
}
