# Changelog

All notable changes to this project are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/).

## [Unreleased]

### Added

- Published npm package name: `@krunch12345/admin-kit` (unscoped `admin-kit` is blocked as too similar to `adminkit`)
- Storybook 8 catalog with GitHub Pages deploy workflow (`/admin-kit/` base path)
- npm publish workflow on GitHub Release
- Full TypeScript source (`src/` is `.ts`/`.tsx` only) with emitted `.d.ts`
- Vitest, ESLint 9 flat config, TypeScript toolchain, CI workflow, LICENSE (MIT)
- `AdminKitProvider` accepts `api` / `hooks` / `config` / `requestLogout` / `resetApiState`
- `createAuthListenerMiddleware` for pure login reducers + session storage side effects
- Subpath exports: `@krunch12345/admin-kit/auth`, `…/shell`, `…/ui`, `…/locale`, `…/hooks`, `…/utils`
- `useRouteId`, `useNotify`, `useAdminKitHooks`, `useAdminKitConfig`
- Configurable `routes` and namespaced `storageKeys` (`admin-kit:hasSession`)
- UploadImage / Login split into focused modules; `cropImage` utils; shared `fieldSx`
- `CONTRIBUTING.md`, `CHANGELOG.md`

### Changed

- **Breaking:** removed `AppBar`; the top bar is now `Header` (`drawerOpen` / `setDrawerOpen` required). Former composite `Header` (bar + drawer) moved into `Content`
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
