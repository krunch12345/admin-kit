# Consumer integration workflow

Consumer-facing copy with examples: [README.md](../../README.md). This page is the agent checklist grounded in source.

## 1. Install peers and package

Install `@krunch12345/admin-kit` plus required peers for the features used. See [peer dependencies](../integrations/peer-dependencies.md). Prefer version **1.3.1+** (avoid broken npm `1.3.0`).

## 2. Create API + store

1. `createAdminBaseQuery({ baseUrl })` (default `/api`)
2. `createApi` endpoints: `...createAuthEndpoints(builder)`, `...createShellEndpoints(builder)`, plus app endpoints
3. Register reducers: `api.reducer`, `[loginSlice.name]`, `[showAlertSlice.name]`, `[showLoadingSlice.name]`
4. Middleware: `api.middleware` + `createAuthListenerMiddleware().middleware`
5. Unauthenticated custom endpoints: `extraOptions: { requiresAuth: false }`

## 3. Providers and layout

1. `Provider` (Redux) → `BrowserRouter` (or equivalent) → layout route
2. Inside layout: `AdminKitProvider` with `api`, `locale`, `requestLogout`, `resetApiState`, optional `config`
3. Consumer `ThemeProvider` + `CssBaseline` wrapping kit UI
4. Mount `TokenRestorer` once under router + store
5. Mount `Content` as the layout element that owns `<Outlet />`

## 4. Routes

Typical kit routes (overridable via `config.routes`):

- `login` → `<Login />`
- index / home → `<PrivateRoute><Main … /></PrivateRoute>`
- `account` → private `<Account />`
- `404` / catch-all → `<NotFound />` / redirect

Use `RequireAdmin` where role must be `'admin'`.

## 5. Optional features

| Feature | Consumer action |
| --- | --- |
| Russian UI | `locale="ru"` and/or `messages` |
| Date pickers | Install optional peers; wrap with `LocalizationProvider` + `useAdminKitLocaleText` |
| UploadImage | Install `@rpldy/*` + `react-image-crop`; pass `uploadFn` / `setUrl` |
| Image CORS proxy | `configureImageProxy({ prefix, hosts })` |
| Hash scroll on `Page` | Ensure `react-scroll` installed |

## 6. After kit releases

Bump consumer dependency; re-run consumer lint/typecheck/tests. Kit publish does not update consumers automatically.

## Related

- [Authentication flow](authentication-flow.md)
- [Expected backend contract](../integrations/expected-backend-contract.md)
- [Locale](../modules/locale.md)
