# Locale module

Source: `src/locale/`. Subpath entry: `src/locale/public.ts` → `@krunch12345/admin-kit/locale`. The public locale entry omits `AdminKitContext` and `deepMerge`, which remain on the internal `src/locale/index.ts` barrel (see [public API](../architecture/public-api.md)).

## Dictionaries

- Built-in locales: `en` (default), `ru` (`ADMIN_KIT_LOCALES`)
- Message trees: `enMessages`, `ruMessages`
- Deep-merge overrides via `messages` prop or `configureAdminKit({ locale, messages })`
- `formatMessage` for `{var}` interpolation
- Parity covered by `messages.parity.test.ts`

## `AdminKitProvider`

Required for auth/shell pages that call `useAdminKitHooks`. Props:

| Prop | Role |
| --- | --- |
| `locale` | `'en' \| 'ru'` |
| `messages` | Deep partial overrides |
| `includeModalProvider` | Default `true` mounts `ModalDataProvider` |
| `api` | RTK `createApi` instance with required endpoints |
| `hooks` | Explicit hook bag override/extension |
| `config` | Partial `routes` / `storageKeys` |
| `requestLogout` | Server logout (refresh cookie revoke) |
| `resetApiState` | Typically `api.util.resetApiState` |

When `api` is provided, provider verifies endpoints: `loginAdmin`, `verify2FA`, `enable2FA`, `disable2FA`, `getCurrentUser`, `getAdminMenu`, `invalidateAllCache`, `logoutAdmin`.

Also syncs module runtime (`configureAdminKit`), session storage key config, and auth runtime registry for logout/reset.

## Non-React access

`getAdminKitMessages()` / `getAdminKitLocale()` read the active dictionary at call time (used by baseQuery and helpers). Call `configureAdminKit` before first render when needed (tests, store boot).

## Date pickers

- Kit does **not** mount MUI `LocalizationProvider`
- Prefer `useAdminKitLocaleText()` / `getLocaleText()`; static `LOCALE_TEXT` remains English snapshot for compatibility
- Wire `localeText` in the consumer app

## Image meta labels

Structural field keys stay fixed; display labels come from `messages.imageMeta`. Use `useImageMetaFields` / `getImageMetaFields`. Static `IMAGE_META_FIELDS` keeps English labels.

## Subpath note

`locale/public.ts` (published subpath) omits `AdminKitContext` and `deepMerge` present on internal `locale/index.ts`.
