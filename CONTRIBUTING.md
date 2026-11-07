# Contributing

## Setup

```sh
yarn
yarn build
```

## Scripts

| Script | Description |
| --- | --- |
| `yarn lint` | ESLint |
| `yarn typecheck` | `tsc --noEmit` |
| `yarn test` | Vitest |
| `yarn build` | Library build + `.d.ts` |

Run all four before opening a PR.

## Conventions

- Arrow functions only
- Import React hooks directly (`import { useState } from 'react'`)
- Prefer MUI component props over `sx` when a prop exists
- User-facing strings go through `useAdminKitMessages` / `formatMessage`
- Breaking API changes must update `CHANGELOG.md`

## Support policy

- React 18
- MUI 5
- React Router 6
- Redux Toolkit 2

Newer majors are tracked separately; do not bump peer ranges in drive-by PRs.
