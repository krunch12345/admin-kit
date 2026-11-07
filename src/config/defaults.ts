export interface AdminKitRoutes {
  login: string
  home: string
  account: string
  notFound: string
  error404: string
}

export interface AdminKitStorageKeys {
  sessionFlag: string
  legacyUser: string
}

export interface AdminKitConfig {
  routes: AdminKitRoutes
  storageKeys: AdminKitStorageKeys
}

export interface AdminKitConfigOverrides {
  routes?: Partial<AdminKitRoutes>
  storageKeys?: Partial<AdminKitStorageKeys>
}

export const DEFAULT_ROUTES: AdminKitRoutes = {
  login: '/login',
  home: '/',
  account: '/account',
  notFound: '/404',
  error404: '/error404',
}

export const DEFAULT_STORAGE_KEYS: AdminKitStorageKeys = {
  sessionFlag: 'admin-kit:hasSession',
  legacyUser: 'admin-kit:user',
}

export const resolveAdminKitConfig = (overrides: AdminKitConfigOverrides = {}): AdminKitConfig => ({
  routes: {
    ...DEFAULT_ROUTES,
    ...overrides.routes,
  },
  storageKeys: {
    ...DEFAULT_STORAGE_KEYS,
    ...overrides.storageKeys,
  },
})
