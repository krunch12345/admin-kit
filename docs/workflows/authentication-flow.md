# Authentication flow

Module detail: [auth](../modules/auth.md). Paths below are relative to `baseUrl` (default `/api`).

## Happy path (credentials only)

1. User submits email/password (+ optional remember-me) on `Login`
2. `loginAdmin` → `POST /auth/loginAdmin` (`requiresAuth: false`, errors suppressed from global alert)
3. If response has access token and `is2FARequired` is false: `tokenReceived` / slice matchers set token; listener persists session flag; navigate to sanitized redirect
4. Subsequent API calls send Bearer token; mutating calls may send `csrf-token` from cookie

## 2FA challenge (login)

1. `loginAdmin` returns `is2FARequired: true` without usable access token (slice clears token)
2. UI switches to OTP step (`TwoFactorStep` / `OtpCodeInputs`)
3. `verify2FA` → `POST /auth/verify2FACode` with `{ email, token, rememberMe? }`
4. On success, token stored; `is2FARequired` set `true` in slice; session flag persisted; redirect

Login/OTP UI can surface rate-limit `remainingAttempts` / `retryAfter` when present (429 normalization in baseQuery).

## Session restore (reload)

1. Remember-me or tab session flag present; Redux has no access token
2. `TokenRestorer` calls `getCurrentUser` → `GET /auth/me`
3. Success with `accessToken` → `tokenReceived`; failure → `dispatch(handleLogout())` (default `revokeServer: true`, so a registered `requestLogout` may hit `POST /auth/logout`) and navigate to login
4. If token already present (just logged in), restore query is skipped to avoid racing logout

## Token refresh

On 401 for authenticated requests (except login/verify/logout/refresh URLs): mutex-protected `POST /auth/refresh`. Success updates token from `accessToken` in body. Failure triggers session-expired alert (unless `silentAuthFailure`) and `handleLogout({ revokeServer: false })` (client clear only; no recursive server revoke while already handling expiry).

## CSRF recovery

State-changing request returns 403 that looks like CSRF (or missing `code`): `GET /csrfToken` with Bearer, then retry with new `csrf-token` header. Persistent CSRF failure can expire the session.

## Logout

1. UI/shell calls `handleLogout` (default `revokeServer: true`)
2. Registered `requestLogout` should hit `POST /auth/logout` (clears httpOnly refresh cookie)
3. `loggedOut` clears Redux auth fields; listener clears session flags / legacy keys
4. Optional `resetApiState` clears RTK Query cache

## Account 2FA management

- Enable: `POST /auth/enable2FA` → QR → verify via `verify2FA`
- Disable: `POST /auth/disable2FA` with `{ password }`; fulfilled matcher clears `is2FARequired`

## Role gate

`RequireAdmin` allows children only when `login.role === 'admin'` after auth check; otherwise redirects home.
