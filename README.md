# admin-kit

Shared admin panel kit for React apps: auth, layout, shell, pages, and reusable MUI UI.
Built for apps that use React Router, Redux Toolkit / RTK Query, and Material UI.

The package is private and ships as a built ESM bundle (`dist/admin-kit.js`).

## Requirements

### Peer dependencies

Install the same major ranges as in `package.json`:

| Package | Notes |
| --- | --- |
| `react`, `react-dom` | ^18.2 |
| `react-router`, `react-router-dom` | ^6.22 |
| `react-redux`, `@reduxjs/toolkit` | store + RTK Query |
| `@mui/material`, `@mui/icons-material`, `@mui/x-date-pickers` | UI |
| `@emotion/react`, `@emotion/styled` | MUI styling |
| `date-fns` | date pickers |
| `lodash-es`, `prop-types`, `react-icons`, `react-scroll` | utilities / icons |
| `@rpldy/uploady`, `@rpldy/upload-button`, `@rpldy/upload-drop-zone`, `@rpldy/upload-paste`, `@rpldy/upload-preview` | image upload |
| `react-image-crop` | crop controls |

### Regular dependency

`async-mutex` is bundled as a normal dependency (used by `createAdminBaseQuery`).

## Install

The package is `"private": true`. Consume it from a monorepo workspace, a local path, or a private registry.

```sh
# after linking / adding the package
yarn && yarn build
```

Consumers import the built entry:

```js
import { Content, createAdminBaseQuery } from 'admin-kit'
```

Rebuild the kit whenever its source changes (`yarn build` or `yarn dev` for watch mode).

## Scripts

| Script | Description |
| --- | --- |
| `yarn build` | Production library build into `dist/` |
| `yarn dev` | Watch mode rebuild |
| `yarn lint` | ESLint on `src` |
| `yarn test` | Node test runner on `src/**/*.test.js` |

## Backend contract

`createAdminBaseQuery` and the auth/shell endpoint factories expect these routes under the configured `baseUrl` (default `/api`):

| Method | Path | Purpose |
| --- | --- | --- |
| `POST` | `/auth/loginAdmin` | Credentials login |
| `POST` | `/auth/enable2FA` | Start 2FA setup (auth required) |
| `POST` | `/auth/verify2FACode` | Verify 2FA code → access token |
| `GET` | `/auth/me` | Restore session / current user |
| `POST` | `/auth/refresh` | Refresh access token (httpOnly cookie) |
| `GET` | `/csrfToken` | CSRF token for state-changing requests |
| `GET` | `/adminMenu` | Header navigation menu |
| `POST` | `/cacheInvalidate` | Invalidate server-side cache |

Auth uses `credentials: 'include'`, Bearer access tokens, and a `csrf-token` header on mutating requests when a `csrfToken` cookie is present.

## Assumptions

- Redux slice keys must be the kit defaults: `login`, `showAlert`, `showLoading` (via `loginSlice.name`, etc.).
- Hardcoded paths: `/login`, `/`, `/404`, `/error404`.
- `initAdminKitAuth` and `initAdminKitShell` must run once after `createApi`, before the first render that uses kit pages/shell.
- Built-in UI copy defaults to **English**. Optional `AdminKitProvider` switches to Russian or custom overrides.
- Theme must wrap `Content` (MUI portals for dialogs/popovers inherit from the nearest `ThemeProvider`).

## Locale (`AdminKitProvider`)

The kit ships two nested message dictionaries: **`en`** (default) and **`ru`**.

`AdminKitProvider` is **optional**. Without it, all UI and runtime helpers silently use English.

```jsx
import { AdminKitProvider } from 'admin-kit'

// English (same as omitting the provider)
<AdminKitProvider>
  <App />
</AdminKitProvider>

// Russian built-in dictionary
<AdminKitProvider locale='ru'>
  <App />
</AdminKitProvider>

// Deep-merge overrides on top of a locale (default locale is en)
<AdminKitProvider
  locale='en'
  messages={{
    login: { pageTitle: 'Admin sign-in' },
    shell: { clearCache: 'Flush cache' },
  }}
>
  <App />
</AdminKitProvider>
```

Behavior:

| Prop | Effect |
| --- | --- |
| *(none)* / no provider | English defaults |
| `locale="en" \| "ru"` | Built-in dictionary for that locale |
| `messages={...}` | Deep-merged onto the selected locale |
| `includeModalProvider={false}` | Locale only; mount `ModalDataProvider` yourself |

`AdminKitProvider` also mounts **`ModalDataProvider`** by default (recommended root kit wrapper). Component props still override dictionary values when passed (`title ?? messages.login.pageTitle`).

### Non-React / early setup

`createAdminBaseQuery`, `getAddImagesErrorMessage`, `formatFileSize`, and similar helpers read the active dictionary via `getAdminKitMessages()` at call time.

`AdminKitProvider` keeps that module runtime in sync. If you need locale **before** the first React render (tests, store boot), call:

```js
import { configureAdminKit } from 'admin-kit'

configureAdminKit({ locale: 'ru' })
// or
configureAdminKit({
  locale: 'en',
  messages: { errors: { uploadFallback: 'Upload failed' } },
})
```

### Date pickers (`LOCALE_TEXT`)

MUI X picker strings live under `messages.datePickers`. The kit does **not** mount `LocalizationProvider` — wire it in the app:

```jsx
import { LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import { useAdminKitLocaleText } from 'admin-kit'

const LocaleAwarePickers = ({ children }) => {
  const localeText = useAdminKitLocaleText()
  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} localeText={localeText}>
      {children}
    </LocalizationProvider>
  )
}
```

Static `LOCALE_TEXT` remains the English snapshot for backward compatibility; prefer `useAdminKitLocaleText()` / `getLocaleText()`.

### Image meta labels

Field **keys** (`name` / `nameEN`, …) stay structural. Display labels come from `messages.imageMeta`. Use `useImageMetaFields()` / `getImageMetaFields()` when you need localized catalog entries. The static `IMAGE_META_FIELDS` export keeps English labels.

## Wiring

### 1. API, store, and kit init

```js
import { configureStore, combineReducers } from '@reduxjs/toolkit'
import { createApi } from '@reduxjs/toolkit/query/react'
import {
  createAdminBaseQuery,
  createAuthEndpoints,
  createShellEndpoints,
  initAdminKitAuth,
  initAdminKitShell,
  loginSlice,
  showAlertSlice,
  showLoadingSlice,
} from 'admin-kit'

export const api = createApi({
  baseQuery: createAdminBaseQuery({ baseUrl: '/api' }),
  endpoints: (builder) => ({
    ...createAuthEndpoints(builder),
    ...createShellEndpoints(builder),
    // app endpoints…
  }),
})

export const {
  useLoginAdminMutation,
  useVerify2FAMutation,
  useEnable2FAMutation,
  useGetCurrentUserQuery,
  useGetAdminMenuQuery,
  useInvalidateAllCacheMutation,
} = api

initAdminKitAuth({
  useLoginAdminMutation,
  useVerify2FAMutation,
  useEnable2FAMutation,
  useGetCurrentUserQuery,
})

initAdminKitShell({
  useGetAdminMenuQuery,
  useInvalidateAllCacheMutation,
})

const rootReducer = combineReducers({
  [api.reducerPath]: api.reducer,
  [loginSlice.name]: loginSlice.reducer,
  [showAlertSlice.name]: showAlertSlice.reducer,
  [showLoadingSlice.name]: showLoadingSlice.reducer,
})

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(api.middleware),
})
```

Getters throw if the kit is not initialized.

### 2. Layout, providers, and routes

```jsx
import { Provider } from 'react-redux'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { CssBaseline, ThemeProvider } from '@mui/material'
import {
  Account,
  AdminKitProvider,
  Content,
  Login,
  Main,
  NotFound,
  PrivateRoute,
  TokenRestorer,
} from 'admin-kit'
import { store } from './store'
import { theme } from './theme'

const RootLayout = () => (
  <AdminKitProvider locale='en'>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <TokenRestorer />
      <Content
        appTitle='My Admin'
        footerProps={{ developer: 'Jane Doe', copyrightStartYear: 2026 }}
      />
    </ThemeProvider>
  </AdminKitProvider>
)

const App = () => (
  <Provider store={store}>
    <BrowserRouter>
      <Routes>
        <Route element={<RootLayout />}>
          <Route path='login' element={<Login />} />
          <Route
            index
            element={(
              <PrivateRoute>
                <Main logo='/logo.svg' />
              </PrivateRoute>
            )}
          />
          <Route
            path='account'
            element={(
              <PrivateRoute>
                <Account />
              </PrivateRoute>
            )}
          />
          <Route path='404' element={<NotFound />} />
          <Route path='*' element={<Navigate to='/404' replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </Provider>
)
```

`Content` renders `<Outlet />` — mount it as a layout route element.
Header and footer show only for authenticated users outside `/login`, `/error404`, and `/404`.

### Header / AppBar props (via `Content`)

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `appTitle` | `string` | required | Title in the app bar |
| `showInvalidateCache` | `boolean` | `true` | Show the cache invalidation button |
| `onInvalidateCache` | `() => void \| Promise<void>` | shell mutation | Overrides default cache invalidation |
| `menu` | `Array<{ name, path }>` | fetched via shell hook | Overrides the fetched menu |
| `isFetchingMenu` | `boolean` | — | Menu loading state when `menu` is provided |

### Footer props (`footerProps` on `Content`)

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `developer` | `string` | — | Developer name |
| `copyrightStartYear` | `number` | required | Shows `start - current` when the year advances |
| `showDeveloper` | `boolean` | `true` | Show `Dev by <developer>` |
| `showKitVersion` | `boolean` | `true` | Show `admin-kit vX.Y.Z` on the right |

Footer is omitted when `footerProps` is not passed.

### Pages

| Component | Props | Notes |
| --- | --- | --- |
| `Login` | `title?`, `redirectPath?`, `otpLength?` | Credentials + optional 2FA |
| `Account` | `title?` | Read-only profile |
| `Main` | `logo`, `SearchComponent` | `logo`: node or image URL; `SearchComponent`: element type or element |
| `NotFound` | — | Full-page 404 |
| `NotFoundModal` | — | 404 inside the shared modal |

### Portals / modals

`Content` hosts shared `Modal`, `Alert`, and `Loading`. Drive the modal through `ModalData` (`setModalData`, `closeModal`) from the provider tree (`AdminKitProvider` includes `ModalDataProvider` by default). Keep `ThemeProvider` above `Content`.

## Public API (by area)

Exports come from the package root. Names match `src/index.js`.

### Locale

`AdminKitProvider`, `configureAdminKit`, `getAdminKitMessages`, `getAdminKitLocale`, `resolveAdminKitMessages`, `ADMIN_KIT_LOCALES`, `enMessages`, `ruMessages`, `formatMessage`, `toMuiLocaleText`, `useAdminKitMessages`, `useAdminKitLocale`, `useAdminKitLocaleText`, `useImageMetaFields`, `useCopyableMetaFields`, `getImageMetaFields`, `getCopyableMetaFields`, `LOCALE_TEXT`, `getLocaleText`

### Auth

`createAdminBaseQuery`, `createAuthEndpoints`, `initAdminKitAuth`, `getAuthHooks`, `loginSlice`, `loginSelector`, `loggedOut`, `doRememberMe`, `tokenReceived`, `authChecked`, `PrivateRoute`, `TokenRestorer`, `handleLogout`, `deepTrimStrings`, `extractMeta`

### Shell / layout

`createShellEndpoints`, `initAdminKitShell`, `getShellHooks`, `Content`, `Page`, `Header`, `AppBar`, `Drawer`, `Footer`, `MenuElement`, `DRAWER_WIDTH`

### Pages

`Login`, `Account`, `Main`, `NotFound`, `NotFoundModal`

### UI

`Accordion`, `Alert`, `showAlertSlice`, `showAlertSelector`, `showAlert`, `hideAlert`, `Autocomplete`, `ColorLegend`, `ConfirmPopper`, `ConfirmYesNoActions`, `CopyButton`, `CopyImageButton`, `Counter`, `CropControls`, `DatePicker`, `DateRangePicker`, `onChangeEndDate`, `DateTimePicker`, `DialogRemoveButton`, `EditControls`, `UnsavedChangesConfirmBody`, `FilterBar`, `countNonEmptyFilters`, `IconButton`, `IconLink`, `ImageMetaFields`, `buildFilledFieldsTooltip`, `COPYABLE_META_FIELDS`, `DEFAULT_EMPTY_IMAGE_META`, `IMAGE_META_FIELDS`, `isCopyableFieldFilled`, `isMetaValueFilled`, `ImageSizeLabel`, `IsBooleanSelect`, `List`, `ListItem`, `Loading`, `showLoadingSlice`, `showLoadingSelector`, `showLoading`, `hideLoading`, `Modal`, `ModalData`, `ModalDataProvider`, `NoDataBox`, `OtpCodeInputs`, `Plus1Button`, `RemoveButton`, `ResultNameSearch`, `Select`, `StatusIndicators`, `DEFAULT_STATUS_PLATFORMS`, `StepByStepForm`, `STEPS`, `TextField`, `UpdatedAtInfo`, `UploadImage`, `GeneralSettingsPanel`, `ImageUploadMethods`, `SelectableImageThumb`

### Hooks

`useFields`, `useId`, `useImageSizeInfo`, `useListPosition`, `useListPositionSync`, `useLoading`, `useNameDouble`, `usePersistedFilters`, `useScreen`

### Utils / constants

`checkRequiredFields`, `copyImageToClipboard`, `getAddImagesErrorMessage`, `isAppFileTooLargePayload`, `formatStringISODate`, `getChangedFieldLabels`, `configureImageProxy`, `getProxiedImageFetchUrl`, `getImageFetchAttempts`, `clearImageByteSizeCache`, `formatFileSize`, `formatImageDimensions`, `formatImageSizeLabel`, `loadImageDimensions`, `fetchImageByteSize`, list-position helpers (`getListItemDomId`, `readListPosition`, `writeListPosition`, `clearListScrollTarget`, `getListNeighborId`, `rememberListOpen`, `prepareListReturnAfterCreate`, `prepareListReturnAfterDelete`), image optimize helpers (`optimizeImageForUpload`, …), `showQueryAlerts`, `slugify`, `trimText`, batch image constants (`BATCH_IMAGE_*`, `chunkArray`, …), `ADMIN_KIT_VERSION`

## Notable helpers

- `StatusIndicators({ values, platforms?, onPlatformClick? })` — default platforms: telegram, bluesky, instagram, threads, discord.
- `configureImageProxy({ prefix, hosts })` — same-origin proxy for hosts that block CORS (used by image size and clipboard helpers). Default prefix: `/image-proxy`.
- List position helpers (`useListPosition`, `rememberListOpen`, …) take the storage key as an argument.
