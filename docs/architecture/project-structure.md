# Project structure

Source of truth: repository layout under this checkout. Paths are relative to the package root.

## Top level

| Path | Responsibility |
| --- | --- |
| `src/` | Library TypeScript/TSX source, colocated tests and Storybook stories |
| `dist/` | Build output (ESM + `.d.ts`); published via `files: ["dist", …]` |
| `.storybook/` | Storybook 8 config, preview, mock store/hooks |
| `.github/workflows/` | `ci.yml`, `storybook.yml`, `publish.yml` |
| `package.json` | Version, exports, peers, scripts |
| `vite.config.ts` | Lib build, externals, Vitest |
| `eslint.config.js` | ESLint 9 flat config |
| `tsconfig.json` | Strict-ish TS for `src/` |
| `README.md` / `CONTRIBUTING.md` / `CHANGELOG.md` | Consumer and contributor docs |
| `AGENTS.md` / `docs/` | Agent policy and task map (this knowledge base) |

## `src/` map

| Path | Responsibility |
| --- | --- |
| `src/index.ts` | Root public barrel |
| `src/version.ts` | `ADMIN_KIT_VERSION` from build `define` |
| `src/auth/` | Base query, auth endpoints, login slice, session flags, guards, logout |
| `src/shell/` | Menu/cache endpoints, Header, Drawer, Footer, MenuElement |
| `src/locale/` | Messages, runtime, AdminKitProvider, hooks; `public.ts` = locale subpath entry |
| `src/config/` | Default routes/storage keys, runtime context, hook accessors |
| `src/layouts/` | `Content` (chrome + Outlet), `Page` |
| `src/pages/` | Login, Account, Main, NotFound, NotFoundModal (+ stories/tests) |
| `src/ui/` | MUI UI primitives; `ui/index.ts` = UI subpath entry |
| `src/hooks/` | Shared React hooks; `hooks/index.ts` = hooks subpath |
| `src/utils/` | Pure helpers; `utils/index.ts` = utils subpath |
| `src/constants/` | Image batch limits, static `LOCALE_TEXT` snapshot |
| `src/test/setup.ts` | Vitest setup |
| `src/Introduction.mdx` | Storybook intro |

## Subpath entry alignment

| Package export | Vite entry | Source entry file |
| --- | --- | --- |
| `@krunch12345/admin-kit` | `admin-kit` | `src/index.ts` |
| `…/auth` | `auth/index` | `src/auth/index.ts` |
| `…/shell` | `shell/index` | `src/shell/index.ts` |
| `…/ui` | `ui/index` | `src/ui/index.ts` |
| `…/locale` | `locale/index` | `src/locale/public.ts` |
| `…/hooks` | `hooks/index` | `src/hooks/index.ts` |
| `…/utils` | `utils/index` | `src/utils/index.ts` |

## Tests and stories

- Unit/component tests: `src/**/*.{test,spec}.{ts,tsx}` beside source
- Stories: `src/**/*.stories.tsx` and `src/**/*.mdx`
- Excluded from dts emit: tests, stories, `src/test/**` (`vite-plugin-dts` exclude)

## Related

- [Overview](overview.md)
- [Public API](public-api.md)
- [Build and packaging](build-and-packaging.md)
