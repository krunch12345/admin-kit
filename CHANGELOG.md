# Changelog

All notable changes to this project are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/).

## [Unreleased]

## [1.2.0] - 2026-11-13

### Added

- Login honors `location.state.from` (pathname + search) via `sanitizeAppPath`, falling back to `routes.home`
- `loginSlice.role` populated from `loginAdmin` / `verify2FA` / `getCurrentUser` (`tokenReceived`) when present
- `disable2FA` mutation in `createAuthEndpoints` (`POST /auth/disable2FA` with `{ password }`); hook via `AdminKitProvider`
- Account page 2FA UI: enable (QR) → verify code; disable with password (en/ru locale strings)
- `RequireAdmin` — redirects to `routes.home` when Redux `role !== 'admin'`

### Changed

- Successful `verify2FA` sets `is2FARequired` to `true` (login challenge and Account setup); `disable2FA` fulfilled clears it

## [1.1.1] - 2026-11-13

### Fixed

- `loginAdmin` and `verify2FA` set `suppressGlobalError` so login/OTP failures are not duplicated by the global alert snackbar
- Credentials form shows remaining attempts only when `remainingAttempts` is a number (ignores `null`)
- `LoginApiError` typing accepts optional `code` and nullable `remainingAttempts`

## [1.1.0] - 2026-11-12

### Added

- `createAdminBaseQuery` normalizes HTTP 429 responses with `message` and `retryAfter` (from JSON body or `Retry-After` header) so login/OTP UI can show them
- Optional `rememberMe` on `LoginAdminParams` / `Verify2FAParams`; login and verify2FA mutations send the checkbox value to the API
- Login credentials and OTP steps render `retryAfter` when present

### Notes

- CSRF handling in `createAdminBaseQuery` is unchanged (still required for state-changing requests such as image upload)
## [1.0.3] - 2026-11-11

### Fixed

- `ModalDataProvider` memos the context `value` so subscribers do not re-render when `modalData` is unchanged

## [1.0.2] - 2026-11-10

### Fixed

- UploadImage `submit` is stable and reads the latest queue / `setUrl` via refs so a Modal `onSubmit` snapshot cannot drop successful upload URLs
- Upload success toast and modal close only run when at least one image was reported to `setUrl`
- TextField is fully controlled when `debounceMs` is 0 so parent-driven value updates (e.g. uploaded image URLs) show immediately
- Upload UI uses named barrel imports for MUI icons (path defaults hit raw CJS under Vite and break app boot)
- Page imports `{ scroller }` from `react-scroll` instead of the CJS default export that breaks under Vite when the kit is not prebundled
- `useRouteId` reads params via `react-router-dom` (same package as the app Router) so entity pages get `:id` under Vite when admin-kit is not prebundled

## [1.0.1] - 2026-11-08

### Fixed

- UploadImage closes after a successful submit without re-opening or asking to cancel the upload
- Modal awaits async `onSubmit` and only then closes when `notCloseAfterSubmit` is unset
- Plus1Button FAB registers clicks on the whole button, not only the inner icon
- ConfirmYesNoActions vertically centers icon and label
- `dialogRemove.confirmDeleteImages` message for localized batch image delete confirms

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
