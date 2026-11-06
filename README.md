# admin-kit

Shared admin panel kit (auth, layout, shell, pages, UI) extracted from the Keep Eternity admin panel.

## Peer dependencies

`react`, `react-dom`, `react-router`, `react-router-dom`, `react-redux`, `@reduxjs/toolkit`,
`@mui/material`, `@mui/icons-material`, `@mui/x-date-pickers`, `@emotion/react`, `@emotion/styled`,
`date-fns`, `lodash-es`, `prop-types`, `react-icons`, `react-scroll`. `async-mutex` is a regular dependency.

## Build

```sh
yarn && yarn build
```

## Wiring

### 1. API and store

```js
import { createApi } from '@reduxjs/toolkit/query/react'
import {
  createAdminBaseQuery,
  createAuthEndpoints,
  createShellEndpoints,
  initAdminKitAuth,
  initAdminKitShell,
} from 'admin-kit'

export const api = createApi({
  baseQuery: createAdminBaseQuery({ baseUrl: '/api' }),
  endpoints: (builder) => ({
    ...createAuthEndpoints(builder),
    ...createShellEndpoints(builder),
    // app endpoints
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
```

Register the kit reducers under their default names (the kit reads `state.login`, `state.showAlert`, `state.showLoading`):

```js
import { loginSlice, showAlertSlice, showLoadingSlice } from 'admin-kit'

combineReducers({
  [api.reducerPath]: api.reducer,
  [loginSlice.name]: loginSlice.reducer,
  [showAlertSlice.name]: showAlertSlice.reducer,
  [showLoadingSlice.name]: showLoadingSlice.reducer,
})
```

`initAdminKitAuth` / `initAdminKitShell` must run before the first render. Getters throw if the kit is not initialized.

### 2. Layout and routes

```jsx
import { Content, TokenRestorer, ModalDataProvider, PrivateRoute, Main, Login, Account, NotFound } from 'admin-kit'

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
```

`Content` renders `<Outlet />`, so mount it as a layout route element.
The header and footer are shown only for authenticated users outside `/login`, `/error404` and `/404`.

### Header / AppBar props (passed through `Content`)

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `appTitle` | `string` | required | Title in the app bar |
| `showInvalidateCache` | `boolean` | `true` | Show the "clear Redis cache" button |
| `onInvalidateCache` | `() => void \| Promise<void>` | shell hook mutation | Overrides the default cache invalidation |
| `menu` | `Array<{ name, path }>` | fetched via shell hook | Overrides the fetched menu |
| `isFetchingMenu` | `boolean` | — | Menu loading state when `menu` is provided |

### Footer props (`footerProps` in `Content`)

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `developer` | `string` | — | Developer name |
| `copyrightStartYear` | `number` | required | Shows `start - current` once the current year is greater |
| `showDeveloper` | `boolean` | `true` | Show `Dev by <developer>` |
| `showKitVersion` | `boolean` | `true` | Show `admin-kit vX.Y.Z` on the right |

The footer is not rendered when `footerProps` is omitted.

### Pages

- `Login({ title?, redirectPath? })`
- `Account({ title? })`
- `Main({ logo, SearchComponent })` — `logo` is a node or an image url; `SearchComponent` is an element type or an element.
- `NotFound`, `NotFoundModal`

### Portals / modals

`Content` renders the shared `Modal`, `Alert` and `Loading`. Drive the modal through `ModalData` context
(`setModalData`, `closeModal`) provided by `ModalDataProvider`. Dialogs and popovers use MUI portals, so keep
`ThemeProvider` above `Content`.

### Other

- `StatusIndicators({ values, platforms?, onPlatformClick? })` — telegram / bluesky / instagram / threads / discord by default.
- `configureImageProxy({ prefix, hosts })` — same-origin proxy for hosts blocking CORS (used by image size and clipboard helpers).
- List position helpers (`useListPosition`, `rememberListOpen`, ...) take the storage key as an argument.
