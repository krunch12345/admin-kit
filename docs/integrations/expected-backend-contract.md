# Expected backend contract

**Status: kit expectations from this package’s README and source — not a verified backend implementation audit.** Do not treat this as proof that `rocklip-backend-node` (or any host) implements these routes. Confirm against the backend checkout separately.

Default prefix: consumer `baseUrl` (kit default `/api`).

## Auth and session

| Method | Path | Kit usage |
| --- | --- | --- |
| `POST` | `/auth/loginAdmin` | Credentials login; body may include `rememberMe` |
| `POST` | `/auth/enable2FA` | Start 2FA setup (auth required); may return `qrCodeImageUrl` |
| `POST` | `/auth/verify2FACode` | Body `{ email, token, rememberMe? }` → access token |
| `POST` | `/auth/disable2FA` | Body `{ password }` |
| `GET` | `/auth/me` | Restore session / current user (access token + profile fields) |
| `POST` | `/auth/refresh` | Refresh access token using httpOnly cookie; body/result expected to include `accessToken` (and optional profile fields) |
| `POST` | `/auth/logout` | Revoke refresh session / clear auth cookies |
| `GET` | `/csrfToken` | Returns `{ csrfToken }` for mutating requests |

Transport assumptions in `createAdminBaseQuery`:

- `credentials: 'include'`
- Bearer access token in `Authorization`
- Mutating requests send header `csrf-token` when cookie `csrfToken` is present
- CSRF failure signals may use codes such as `EBADCSRFTOKEN` / `csrf` or CSRF-like messages
- HTTP 429 may include `message` / `retryAfter` (or `Retry-After` header)

Session markers in the browser are kit-owned flags only; refresh cookies are expected to be httpOnly and server-managed.

## Shell

| Method | Path | Kit usage |
| --- | --- | --- |
| `GET` | `/adminMenu` | Header/drawer navigation; UI expects items shaped like `{ name, path }` |
| `POST` | `/cacheInvalidate` | Header cache flush action |

Response TypeScript types in the shell factory are largely `unknown`; runtime shape is a consumer/backend agreement.

## Upload

Not defined by kit HTTP helpers. `UploadImage` delegates to consumer `uploadFn`. Any image POST paths, multipart field names, or CDN URLs are **consumer/backend** contracts outside this document.

## Related

- [Authentication flow](../workflows/authentication-flow.md)
- [Auth module](../modules/auth.md)
- Root [README.md](../../README.md) “Backend contract” table
