# Build and packaging

Audit date: 2026-11-17.

## Toolchain

| Piece | Version / notes (from `package.json`) |
| --- | --- |
| Package manager | Yarn 3.5.1 (`packageManager`) |
| Node engines | `>=20` (CI uses Node 22) |
| Bundler | Vite `^7.1.7` library mode |
| Declarations | `vite-plugin-dts` |
| Types | TypeScript `^5.8.0` |
| Tests | Vitest `^5.1.0` + jsdom |
| Storybook | `8.6.14` (React Vite) |
| Lint | ESLint 9 flat config |

## Library build (`vite.config.ts`)

- **Entries**: root `admin-kit` + `auth/index`, `shell/index`, `ui/index`, `locale/index` (from `src/locale/public.ts`), `hooks/index`, `utils/index`
- **Format**: ESM only (`formats: ['es']`)
- **Output names**: `${entryName}.js` under `dist/` (for example `dist/admin-kit.js`, `dist/ui/index.js`)
- **Sourcemaps**: enabled; `emptyOutDir: true`
- **Version define**: `__ADMIN_KIT_VERSION__` ← `package.json` version → `ADMIN_KIT_VERSION`
- **Externals**: all `peerDependencies` keys, `async-mutex`, plus regexes for `@mui/`, `@emotion/`, `react-icons/`, `lodash-es`, `@reduxjs/toolkit`, `@rpldy/`, `react-image-crop`, and React JSX runtimes

`prepublishOnly` runs `yarn lint && yarn typecheck && yarn test && yarn build`.

## Publish surface

- npm scope: `@krunch12345/admin-kit`, `publishConfig.access: public`
- `files`: `dist`, `LICENSE`, `README.md`, `CHANGELOG.md` (source under `src/` is not published)
- GitHub Release → `.github/workflows/publish.yml` → `npm publish --access public` (needs `NPM_TOKEN`)
- Storybook static → GitHub Pages via `storybook.yml` (`STORYBOOK_BASE_PATH=/admin-kit/`). Pages deploy publishes a **public** artifact (not npm); treat push to `main`/`master` that triggers it as release-adjacent and obtain approval ([AGENTS.md](../../AGENTS.md)).

Do not publish or create releases without explicit user approval ([AGENTS.md](../../AGENTS.md)).

## CI

| Workflow | Trigger | Steps |
| --- | --- | --- |
| `ci.yml` | push `main`/`master`, PRs | install → lint → typecheck → test → build |
| `storybook.yml` | push `main`/`master`, `workflow_dispatch` | build-storybook → Pages deploy |
| `publish.yml` | `release: published` | verify + `npm publish` |

## Consumer install notes

Consumers resolve peers from their own `node_modules`. Optional peers are listed under `peerDependenciesMeta`. After a kit release, consumers typically bump the dependency version explicitly (this repo does not auto-update consumers).

## Related

- [Public API](public-api.md)
- [Peer dependencies](../integrations/peer-dependencies.md)
- [Setup](../development/setup.md)
