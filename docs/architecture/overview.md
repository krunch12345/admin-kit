# Architecture overview

Audit date: 2026-11-17. Package: `@krunch12345/admin-kit` **1.3.1**.

## Role

Shared admin-panel kit for React apps that already use React Router, Redux Toolkit / RTK Query, and Material UI. It provides:

- Auth transport (`createAdminBaseQuery`), auth/shell endpoint factories, session markers, route guards, and login/account pages
- Shell chrome (header, drawer, footer) and layout (`Content`, `Page`)
- Locale dictionaries (en/ru) and `AdminKitProvider` runtime wiring
- Reusable MUI-based UI primitives, including UploadImage (upload HTTP delegated to the consumer)
- Shared hooks and utilities

It is a **library**, not a runnable admin application. Consumers own routing tables, theme, store composition, and domain endpoints.

## Runtime layers

```text
Consumer app
  Provider (react-redux) + Router
    AdminKitProvider (locale + api hooks + config + optional ModalDataProvider)
      ThemeProvider (consumer)
        TokenRestorer
        Content (Outlet + chrome + Modal/Alert/Loading)
          Pages / domain screens
```

Data flow for authenticated HTTP:

1. Consumer `createApi({ baseQuery: createAdminBaseQuery(...), endpoints: { ...createAuthEndpoints, ...createShellEndpoints, ... } })`
2. `createAuthListenerMiddleware` keeps session storage in sync with login actions
3. Components call hooks resolved from `AdminKitProvider` (`useAdminKitHooks`) or app-generated RTK hooks
4. `createAdminBaseQuery` attaches Bearer token, CSRF header on mutations, mutex refresh, CSRF recovery, and optional global error alerts

## Design constraints

| Constraint | Detail |
| --- | --- |
| ESM library build | Vite lib mode, format `es`, multi-entry (`admin-kit` + subpaths) |
| Peers externalized | Peer packages and `async-mutex` are not bundled into `dist/` |
| Redux key names | Default slice names `login`, `showAlert`, `showLoading` must match store keys |
| No access-token persistence | Access token lives in Redux memory; only `hasSession`-style flags use Web Storage |
| Upload is pluggable | `UploadImage` calls consumer `uploadFn`; no kit-owned upload URL |
| Locale defaults English | `AdminKitProvider` / `configureAdminKit` select `en` or `ru` |

## Related docs

- [Project structure](project-structure.md)
- [Public API](public-api.md)
- [Build and packaging](build-and-packaging.md)
- [Consumer integration](../workflows/consumer-integration.md)
