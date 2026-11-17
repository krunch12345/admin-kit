# Auth module

Source: `src/auth/`. Subpath: `@krunch12345/admin-kit/auth`. Workflow: [authentication flow](../workflows/authentication-flow.md). Backend expectations: [expected backend contract](../integrations/expected-backend-contract.md).

## Responsibilities

- RTK Query `createAdminBaseQuery` (Bearer, CSRF, refresh mutex, 429 normalization, global error alerts)
- `createAuthEndpoints` factory for login / 2FA / me / logout
- `loginSlice` + `createAuthListenerMiddleware` (pure reducers + storage side effects)
- Session flag helpers (remember-me vs tab session)
- `PrivateRoute`, `RequireAdmin`, `TokenRestorer`, `handleLogout`

## `createAdminBaseQuery`

Default `baseUrl`: `/api`. Always `credentials: 'include'`.

| Behavior | Detail |
| --- | --- |
| Auth header | `Authorization: Bearer <accessToken>` when `requiresAuth !== false` and token present |
| Body trim | `deepTrimStrings` on JSON bodies (not `FormData`) |
| CSRF | For POST/PUT/PATCH/DELETE, sends `csrf-token` from `csrfToken` cookie when present; on CSRF-looking 403 (`EBADCSRFTOKEN` / `csrf` / message matching `/csrf/i`) fetches `GET /csrfToken` and retries. Null/missing `code` alone is not enough |
| Refresh | On 401, `POST /auth/refresh` under mutex; updates token via `tokenReceived`; skips refresh for login/verify/logout/refresh paths |
| Pre-check | If auth required, `isAuthChecked`, and no token → synthetic 401 |
| 429 | Normalizes `message` + `retryAfter` via `buildRateLimitErrorData` |
| Errors | Unless `suppressGlobalError`, dispatches `showAlert` for `result.error` or `result.data.error` |

`extraOptions`: `requiresAuth?`, `silentAuthFailure?`, `suppressGlobalError?`.

## `createAuthEndpoints`

| Endpoint | Method / path | extraOptions highlights |
| --- | --- | --- |
| `loginAdmin` | `POST /auth/loginAdmin` | `requiresAuth: false`, `suppressGlobalError: true` |
| `enable2FA` | `POST /auth/enable2FA` | auth required |
| `verify2FA` | `POST /auth/verify2FACode` | unauthenticated + suppress global error |
| `disable2FA` | `POST /auth/disable2FA` | auth required, body `{ password }` |
| `getCurrentUser` | `GET /auth/me` | silent auth failure, suppress global error, `keepUnusedDataFor: 0` |
| `logoutAdmin` | `POST /auth/logout` | unauthenticated-style options, silent |

## Session storage

Default key: `admin-kit:hasSession` (`DEFAULT_STORAGE_KEYS.sessionFlag`). Remember-me → `localStorage`; otherwise → `sessionStorage`. `configureSessionStorageKeys` (auth subpath / provider) can rename keys. Access tokens are **not** stored in Web Storage.

## Guards and restore

- `PrivateRoute`: waits for `isAuthChecked`; redirects to `routes.login` with `state.from`
- `RequireAdmin`: requires `role === 'admin'`; else `routes.home`
- `TokenRestorer`: if session flag set and no Redux token, runs `getCurrentUser`; on failure `handleLogout()` (default `revokeServer: true`) + navigate login
- `handleLogout`: when `revokeServer` is true (default), optional `requestLogout` (from provider registry); then `loggedOut`; then optional `resetApiState`

## Related exports

Root exports the main auth surface; auth subpath also exports rate-limit helpers and `configureSessionStorageKeys` ([public API](../architecture/public-api.md)).
