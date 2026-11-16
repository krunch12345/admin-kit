# Shell module

Source: `src/shell/`. Subpath: `@krunch12345/admin-kit/shell`. Layout composition: [layouts and pages](layouts-and-pages.md).

## Endpoints (`createShellEndpoints`)

| Endpoint | Method / path | Notes |
| --- | --- | --- |
| `getAdminMenu` | `GET /adminMenu` | Auth required; result typed `unknown` in factory |
| `invalidateAllCache` | `POST /cacheInvalidate` | Auth required |

Spread into the consumer `createApi` endpoints alongside auth endpoints. `AdminKitProvider` requires both shell endpoint names to exist when `api` is passed.

## UI pieces

| Component | Role |
| --- | --- |
| `Header` | App bar, drawer toggle, account/logout, optional cache invalidate |
| `Drawer` | Side navigation from menu items |
| `MenuElement` | Single `{ name, path }` link; paths sanitized via `sanitizeAppPath` |
| `Footer` | Developer line, copyright year range, optional kit version |
| `DRAWER_WIDTH` | Shared drawer width constant |

Menu item shape used by UI: `{ name: string, path: string }` (`AdminKitMenuItem`). Unsafe paths render as null.

## Wiring note

Shell wiring is `createShellEndpoints` plus hooks from `AdminKitProvider` / `useAdminKitHooks`. There are no `initAdminKitShell` / `getShellHooks` helpers in `src/`.

## Chrome visibility

`Content` shows Header/Drawer/Footer only when an access token is present and the path is not login or configured 404 routes. See [layouts and pages](layouts-and-pages.md).
