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
- Built-in UI copy is mostly Russian; there is no i18n layer yet.
- Theme must wrap `Content` (MUI portals for dialogs/popovers inherit from the nearest `ThemeProvider`).

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
  Content,
  Login,
  Main,
  ModalDataProvider,
  NotFound,
  PrivateRoute,
  TokenRestorer,
} from 'admin-kit'
import { store } from './store'
import { theme } from './theme'

const RootLayout = () => (
  <ModalDataProvider>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <TokenRestorer />
      <Content
        appTitle='My Admin'
        footerProps={{ developer: 'Jane Doe', copyrightStartYear: 2026 }}
      />
    </ThemeProvider>
  </ModalDataProvider>
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

`Content` hosts shared `Modal`, `Alert`, and `Loading`. Drive the modal through `ModalData` (`setModalData`, `closeModal`) from `ModalDataProvider`. Keep `ThemeProvider` above `Content`.

## Public API (by area)

Exports come from the package root. Names match `src/index.js`.

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

`checkRequiredFields`, `copyImageToClipboard`, `getAddImagesErrorMessage`, `isAppFileTooLargePayload`, `formatStringISODate`, `getChangedFieldLabels`, `configureImageProxy`, `getProxiedImageFetchUrl`, `getImageFetchAttempts`, `clearImageByteSizeCache`, `formatFileSize`, `formatImageDimensions`, `formatImageSizeLabel`, `loadImageDimensions`, `fetchImageByteSize`, list-position helpers (`getListItemDomId`, `readListPosition`, `writeListPosition`, `clearListScrollTarget`, `getListNeighborId`, `rememberListOpen`, `prepareListReturnAfterCreate`, `prepareListReturnAfterDelete`), image optimize helpers (`optimizeImageForUpload`, …), `showQueryAlerts`, `slugify`, `trimText`, batch image constants (`BATCH_IMAGE_*`, `chunkArray`, …), `LOCALE_TEXT`, `ADMIN_KIT_VERSION`

## Notable helpers

- `StatusIndicators({ values, platforms?, onPlatformClick? })` — default platforms: telegram, bluesky, instagram, threads, discord.
- `configureImageProxy({ prefix, hosts })` — same-origin proxy for hosts that block CORS (used by image size and clipboard helpers). Default prefix: `/image-proxy`.
- List position helpers (`useListPosition`, `rememberListOpen`, …) take the storage key as an argument.
