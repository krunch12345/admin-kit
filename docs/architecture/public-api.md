# Public API

Audit date: 2026-11-17. Prefer current barrels over README lists when they disagree ([audit-findings](../audit-findings.md)).

## Package exports (`package.json`)

| Export | Types | Import |
| --- | --- | --- |
| `.` | `./dist/index.d.ts` | `./dist/admin-kit.js` |
| `./auth` | `./dist/auth/index.d.ts` | `./dist/auth/index.js` |
| `./shell` | `./dist/shell/index.d.ts` | `./dist/shell/index.js` |
| `./ui` | `./dist/ui/index.d.ts` | `./dist/ui/index.js` |
| `./locale` | `./dist/locale/index.d.ts` | `./dist/locale/index.js` |
| `./hooks` | `./dist/hooks/index.d.ts` | `./dist/hooks/index.js` |
| `./utils` | `./dist/utils/index.d.ts` | `./dist/utils/index.js` |

`main` / `module` / `types` point at the root ESM bundle and root declarations. `sideEffects` includes `**/*.css`. Published `files`: `dist`, `LICENSE`, `README.md`, `CHANGELOG.md`.

## Root barrel (`src/index.ts`)

### Version / config

`ADMIN_KIT_VERSION`, `DEFAULT_ROUTES`, `DEFAULT_STORAGE_KEYS`, `resolveAdminKitConfig`, `useAdminKitConfig`, `useAdminKitHooks`, `useAdminKitRuntime`

### Locale

`AdminKitProvider`, `configureAdminKit`, `getAdminKitMessages`, `getAdminKitLocale`, `resolveAdminKitMessages`, `ADMIN_KIT_LOCALES`, `enMessages`, `ruMessages`, `formatMessage`, `toMuiLocaleText`, `useAdminKitMessages`, `useAdminKitLocale`, `useAdminKitLocaleText`, `useImageMetaFields`, `useCopyableMetaFields`, `getImageMetaFields`, `getCopyableMetaFields`

### Auth

`createAdminBaseQuery`, `createAuthEndpoints`, `createAuthListenerMiddleware`, `deepTrimStrings`, `handleLogout`, `loginSlice`, `loginSelector`, `loggedOut`, `doRememberMe`, `tokenReceived`, `authChecked`, `PrivateRoute`, `RequireAdmin`, `TokenRestorer`, `SESSION_FLAG_KEY`, `clearSessionFlags`, `hasPersistedSession`, `isRememberMeSession`, `persistSessionFlag`

### Layouts / shell / pages

`Content`, `Page`, `createShellEndpoints`, `Drawer`, `DRAWER_WIDTH`, `Footer`, `Header`, `MenuElement`, `Account`, `Login`, `Main`, `NotFound`, `NotFoundModal`

### UI

Re-export of entire `src/ui/index.ts` (see [UI primitives](../modules/ui-primitives.md)). Prefer `@krunch12345/admin-kit/ui` when names collide with MUI.

### Hooks

`useFields`, `useFormDraft`, `useRouteId`, `useImageSizeInfo`, `useLeavePageConfirm`, `useListPosition`, `useListPositionSync`, `useLoading`, `useNameDouble`, `useNotify`, `usePersistedFilters`, `useScreen`

### Utils / constants

Re-export of `src/utils/index.ts` plus batch helpers (`BATCH_IMAGE_*`, `chunkArray`, …) and `LOCALE_TEXT` / `getLocaleText`.

## Subpath deltas vs root

| Subpath | Notable differences |
| --- | --- |
| `./auth` | Also exports `configureSessionStorageKeys`, `buildRateLimitErrorData`, `parseRetryAfterSeconds`, and auth-related types |
| `./locale` | Built from `public.ts` (no `AdminKitContext` / `deepMerge`); includes locale types |
| `./shell` | Shell-only (no layouts/pages) |
| `./ui` | UI-only (recommended for TextField, Modal, …) |
| `./hooks` / `./utils` | Match their barrels; utils includes crop/optimize helpers and types |

## Not public / not exported

- Internal auth helpers such as `extractMeta`, `runtimeRegistry` getters (used by the kit; not root-exported)
- Upload internals under `src/ui/UploadImage/hooks/` (except components re-exported from UI barrel)
- Storybook mocks under `.storybook/`
- Test and story modules

## Related

- [Build and packaging](build-and-packaging.md)
- Module docs under [modules/](../modules/)
- Consumer-facing overview: [root README](../../README.md)
