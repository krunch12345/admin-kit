# Layouts and pages

Sources: `src/layouts/`, `src/pages/`. Exported from the package root (not a dedicated subpath).

## `Content`

Main layout route element: renders `<Outlet />`, optional chrome, and always hosts `Modal`, `Alert`, and conditional `Loading`.

Props: `appTitle` (required), `showInvalidateCache`, `onInvalidateCache`, `menu`, `isFetchingMenu`, `footerProps`.

Chrome (`Header` + `Drawer`, and `Footer` when `footerProps` set) shows when:

- Redux has `accessToken`
- Path is not `routes.login`
- Path is not `routes.notFound` or `routes.error404`

Menu: override via `menu` prop, else `useGetAdminMenuQuery` when chrome is visible. ThemeProvider should wrap `Content` so portals inherit theme.

## `Page`

Centered stack with `title` typography and optional hash scroll via `react-scroll` (`scroller.scrollTo`, offset -80). Optional peer: `react-scroll`.

## Pages

| Component | Props (high level) | Behavior |
| --- | --- | --- |
| `Login` | `title?`, `redirectPath?`, `otpLength?` (default 6) | Credentials then optional OTP; redirect via prop → `state.from` → `routes.home` (`resolveLoginRedirectPath` + `sanitizeAppPath`) |
| `Account` | `title?` | Profile display + 2FA enable (QR) / verify / disable with password |
| `Main` | `logo`, `SearchComponent?` | Home landing; logo node or URL |
| `NotFound` | — | Full-page 404 |
| `NotFoundModal` | — | 404 content inside shared modal |

Default routes (`config/defaults.ts`): `/login`, `/`, `/account`, `/404`, `/error404` — override with `AdminKitProvider` `config.routes`.

## Stories

Storybook coverage exists for Login, Account, Main, NotFound and shell pieces under `src/pages/*.stories.tsx` and `src/shell/*.stories.tsx`.
