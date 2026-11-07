export { ADMIN_KIT_VERSION } from './version'

// config
export { DEFAULT_ROUTES, DEFAULT_STORAGE_KEYS, resolveAdminKitConfig } from './config/defaults'
export { useAdminKitConfig, useAdminKitHooks, useAdminKitRuntime } from './config/useAdminKitRuntime'

// locale
export { AdminKitProvider } from './locale/AdminKitProvider'
export {
  ADMIN_KIT_LOCALES,
  configureAdminKit,
  getAdminKitLocale,
  getAdminKitMessages,
  resolveAdminKitMessages,
} from './locale/runtime'
export { enMessages } from './locale/messages/en'
export { ruMessages } from './locale/messages/ru'
export { formatMessage } from './locale/formatMessage'
export { toMuiLocaleText } from './locale/toMuiLocaleText'
export {
  useAdminKitLocale,
  useAdminKitLocaleText,
  useAdminKitMessages,
} from './locale/useAdminKitMessages'
export {
  getCopyableMetaFields,
  getImageMetaFields,
  useCopyableMetaFields,
  useImageMetaFields,
} from './locale/useImageMetaFields'

// auth
export { createAdminBaseQuery } from './auth/createAdminBaseQuery'
export { createAuthEndpoints } from './auth/createAuthEndpoints'
export { createAuthListenerMiddleware } from './auth/authListeners'
export { deepTrimStrings } from './auth/deepTrimStrings'
export { handleLogout } from './auth/handleLogout'
export {
  loginSlice,
  loginSelector,
  loggedOut,
  doRememberMe,
  tokenReceived,
  authChecked,
} from './auth/loginSlice'
export { PrivateRoute } from './auth/PrivateRoute'
export {
  SESSION_FLAG_KEY,
  clearSessionFlags,
  hasPersistedSession,
  isRememberMeSession,
  persistSessionFlag,
} from './auth/sessionFlags'
export { TokenRestorer } from './auth/TokenRestorer'

// layouts
export { Content } from './layouts/Content'
export { Page } from './layouts/Page'

// shell
export { createShellEndpoints } from './shell/createShellEndpoints'
export { Drawer } from './shell/Drawer'
export { DRAWER_WIDTH } from './shell/drawerWidth'
export { Footer } from './shell/Footer'
export { Header } from './shell/Header'
export { MenuElement } from './shell/MenuElement'

// pages
export { Account } from './pages/Account'
export { Login } from './pages/Login'
export { Main } from './pages/Main'
export { NotFound } from './pages/NotFound'
export { NotFoundModal } from './pages/NotFoundModal'

// ui (prefer `@krunch12345/admin-kit/ui` to avoid collisions with MUI names)
export * from './ui/index'

// hooks
export { useFields } from './hooks/useFields'
export { useFormDraft } from './hooks/useFormDraft'
export { useRouteId } from './hooks/useRouteId'
export { useImageSizeInfo } from './hooks/useImageSizeInfo'
export { useLeavePageConfirm } from './hooks/useLeavePageConfirm'
export { useListPosition, useListPositionSync } from './hooks/useListPosition'
export { useLoading } from './hooks/useLoading'
export { useNameDouble } from './hooks/useNameDouble'
export { useNotify } from './hooks/useNotify'
export { usePersistedFilters } from './hooks/usePersistedFilters'
export { useScreen } from './hooks/useScreen'

// utils
export * from './utils/index'

// constants
export {
  BATCH_IMAGE_HARD_LIMIT,
  BATCH_IMAGE_MAX_BYTES,
  BATCH_IMAGE_SOFT_LIMIT,
  chunkArray,
  chunkFilesByCountAndBytes,
  getUploadItemByteSize,
} from './constants/imageBatch'
export { LOCALE_TEXT, getLocaleText } from './constants/localeText'
