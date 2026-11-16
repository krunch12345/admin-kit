# Environment and commands

Also see [CONTRIBUTING.md](../../CONTRIBUTING.md) and root [README.md](../../README.md) scripts table.

## Prerequisites

- Node.js `>=20` (CI uses 22)
- Yarn 3.5.1 via Corepack (`packageManager` field)
- Do not introduce a competing lockfile

## Install

```sh
yarn
yarn build
```

## Scripts

| Script | Command purpose |
| --- | --- |
| `yarn build` | Production library build into `dist/` (+ `.d.ts`) |
| `yarn dev` | Watch mode rebuild (`vite build --watch`) |
| `yarn lint` | ESLint on `src`, `vite.config.ts`, `eslint.config.js`, `.storybook` |
| `yarn typecheck` | `tsc -p tsconfig.json --noEmit` |
| `yarn test` | Vitest run once |
| `yarn test:watch` | Vitest watch |
| `yarn storybook` | Storybook dev on port **6006** |
| `yarn build-storybook` | Static Storybook into `storybook-static/` with base `/admin-kit/` |

## Local verification order

For library changes: lint → typecheck → test → build. Add Storybook for UI work. Do not treat `npm publish` or GitHub Release as verification.

## Secrets and env

This package has no app `.env` contract for runtime. Do not commit tokens. Publish workflow uses `secrets.NPM_TOKEN` on the GitHub side only—do not print or copy secret values locally.

## Related

- [Testing](testing.md)
- [Conventions](conventions.md)
- [Build and packaging](../architecture/build-and-packaging.md)
