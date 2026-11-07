# Changelog

All notable changes to this project are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/).

## [Unreleased]

### Added

- Full TypeScript source (`src/` is `.ts`/`.tsx` only) with emitted `.d.ts`
- Vitest, ESLint 9 flat config, TypeScript toolchain, CI workflow, LICENSE (MIT)
- `AdminKitProvider` accepts `api` / `hooks` / `config` / `requestLogout` / `resetApiState`
- `createAuthListenerMiddleware` for pure login reducers + session storage side effects
- Subpath exports: `admin-kit/auth`, `admin-kit/shell`, `admin-kit/ui`, `admin-kit/locale`, `admin-kit/hooks`, `admin-kit/utils`
- `useRouteId`, `useNotify`, `useAdminKitHooks`, `useAdminKitConfig`
- Configurable `routes` and namespaced `storageKeys` (`admin-kit:hasSession`)
- UploadImage / Login split into focused modules; `cropImage` utils; shared `fieldSx`
- `CONTRIBUTING.md`, `CHANGELOG.md`

### Changed

- **Breaking:** removed `initAdminKitAuth`, `initAdminKitShell`, `getAuthHooks`, `getShellHooks`, `extractMeta`, `useId`
- **Breaking:** endpoint auth flags via `extraOptions` (not `__meta` on query args)
- **Breaking:** default session key `admin-kit:hasSession`
- `createAdminBaseQuery` only runs 401 refresh/expiry for authenticated requests
- Session expiry uses `handleLogout({ revokeServer: false })` (no logout recursion)
- `getCurrentUser` uses `keepUnusedDataFor: 0`
- `deepTrimStrings` skips password/token fields and non-plain objects
- Modal ownership helpers treat `null` and `undefined` the same (`== null`)
- `TextField` debounce uses a stable debounced function
- Pending upload images use stable `key={item.id}`
- `PrivateRoute` uses `replace` + `state.from` and a loading placeholder

### Fixed

- Open-redirect bypass in `sanitizeAppPath` (`/..//evil.com` → `//evil.com`)
- Force-close modal when `ownerId` is omitted (`undefined`)
- `useListPositionSync` StrictMode scroll restore
- `usePersistedFilters` no longer corrupts non-date string filters

### Security

- Reject URL-normalized protocol-relative paths and encoded backslashes in `sanitizeAppPath`

### Removed

- `prop-types` as a peer dependency (types ship as `.d.ts`; PropTypes removed as files migrate to TS)
