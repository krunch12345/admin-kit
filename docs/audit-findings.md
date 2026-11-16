# Audit coverage, findings and verification limits

Audit date: **2026-11-17**. Scope: this `@krunch12345/admin-kit` checkout only (version **1.3.1**). Initial Git status was clean. No neighboring repository, environment values, production registry, live API, or consumer app was accessed for contract verification. This documents implementation, not proposed fixes.

Docs / AGENTS / README reconciliation pass (same date) updated root README peer and Public API sections, AGENTS SoT guidance, task navigation, and auth-flow wording to match source. Rows below marked **Resolved** were fixed in that pass; keep evidence for regression checks.

## Sequential investigation record

Pass 1 reviewed `package.json` exports/peers/scripts, `src/index.ts` and subpath entry files, `vite.config.ts` multi-entry lib build, Storybook (`.storybook/`), and CI workflows (`ci.yml`, `storybook.yml`, `publish.yml`). It produced architecture and development documents and checked explicit paths used as references.

Pass 2 examined auth (`createAdminBaseQuery`, endpoints, session flags, listeners, `PrivateRoute` / `RequireAdmin` / `TokenRestorer`), shell endpoints and chrome, locale/`AdminKitProvider`, layouts/pages, UI barrel (`src/ui/index.ts`) with focus on UploadImage, and hooks/utils barrels. Backend paths are kit expectations from source/README, not verified backend implementation.

## Verified discrepancies and edge cases

| Finding | Evidence / consequence |
| --- | --- |
| README listed `initAdminKitShell` / `getShellHooks` | **Resolved (docs):** removed from README Public API; shell wiring is `createShellEndpoints` + `AdminKitProvider` / `useAdminKitHooks`. |
| README hooks list included `useId` | **Resolved (docs):** README hooks list now matches root barrel (`useRouteId`, `useFormDraft`, …). No kit export named `useId`. |
| README omitted several root exports | **Resolved (docs):** README Public API aligned with `src/index.ts` (config helpers, `createAuthListenerMiddleware`, missing hooks). Prefer barrels / [public-api](architecture/public-api.md) if lists diverge again. |
| README listed `prop-types` as a peer | **Resolved (docs):** removed from README; `package.json` has no `prop-types` peer. Transitive deps may still pull it. |
| README said exports match `src/index.js` | **Resolved (docs):** README now points at `src/index.ts` / barrels. |
| Locale subpath entry differs from `locale/index.ts` | Vite builds `@krunch12345/admin-kit/locale` from `src/locale/public.ts`. That public entry omits `AdminKitContext` and `deepMerge`, which remain on the internal `src/locale/index.ts` barrel. |
| Auth subpath exports extras not on root | `@krunch12345/admin-kit/auth` also exports `configureSessionStorageKeys`, `buildRateLimitErrorData`, `parseRetryAfterSeconds`, and several types. Root re-exports a narrower auth set. |
| npm `1.3.0` is broken | CHANGELOG: `1.3.0` published without tarball; use `1.3.1`. |
| Upload has no fixed backend URL | `UploadImage` requires consumer `uploadFn`; kit only supplies UI, queue, crop, and optional client optimize. Backend upload path/shape is a consumer/backend concern. |
| Slice key coupling | Kit assumes Redux keys `login`, `showAlert`, `showLoading` (`loginSlice.name` and alert/loading slices). Renaming breaks selectors without a migration. |
| CSRF recovery heuristics | On HTTP 403 for state-changing authenticated requests, baseQuery retries CSRF fetch when `code` looks like CSRF **or** when `code` is null. Non-CSRF 403 without a code may trigger an unnecessary CSRF refresh attempt. |
| `getAdminMenu` / `invalidateAllCache` result types are `unknown` | Shell endpoints do not enforce menu item shape at the type level; runtime menu items are treated as `{ name, path }` in UI. |
| `TokenRestorer` failure uses default server revoke | `TokenRestorer` calls `dispatch(handleLogout())` → default `revokeServer: true`. Auth-expiry paths in baseQuery use `{ revokeServer: false }`. Documented in [authentication-flow](workflows/authentication-flow.md). |
| Storybook deploy is publication-adjacent | Push to `main`/`master` deploys Pages Storybook; not npm publish, but still a public artifact. Obtain approval before treating that push as release work. |

## External verification required

- Actual backend route implementations, cookie attributes, refresh/CSRF lifetimes, and 2FA/email/Telegram delivery for `rocklip-backend-node` or other hosts.
- Consumer wiring completeness in `rocklip-admin-panel` (or other apps): whether all REQUIRED_ENDPOINTS, `requestLogout`, and `createAuthListenerMiddleware` are mounted as recommended.
- Production upload endpoint contracts and size limits versus kit soft/hard batch constants.
- Whether published npm tarball contents for a given version match this checkout’s `dist/` after `yarn build` (not verified in this audit).

These are kit expectations or UI statements, never claims about inspected backend/admin-panel implementations.

## Verification method and remaining limits

Static checks for the documentation task: inventory completeness against the requested tree, cross-links among docs, export map alignment with `package.json` / `src/index.ts` / subpath entries, and README / AGENTS reconciliation against those barrels. Lint, typecheck, test, build, Storybook, and live npm/registry checks were not run for docs-only edits. Existing Vitest/Storybook files are navigation evidence, not a reported passing run.

For future edits, see [conventions](development/conventions.md) and [testing](development/testing.md). Revisit findings when touching their owning source.
