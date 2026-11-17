# Testing

Audit date: 2026-11-17.

## Runner

- **Vitest** with `environment: 'jsdom'`, `globals: true`
- Setup: `src/test/setup.ts`
- Include: `src/**/*.{test,spec}.{js,jsx,ts,tsx}`
- Coverage package present (`@vitest/coverage-v8`); no numeric coverage gate is configured in `package.json` scripts

## Conventions for new tests

Follow repository user rules when adding tests:

- Sentence case names; do not use “should”
- Do not repeat the `describe` subject inside `it(...)`
- Prefer behavior phrasing: “returns X when Y”, “throws error when Y”

Colocate tests next to source (`*.test.ts` / `*.test.tsx`).

## Coverage map (representative)

| Area | Examples |
| --- | --- |
| Auth | `sessionFlags.test.ts`, `loginSlice.test.ts`, `RequireAdmin.test.tsx`, `rateLimitError.test.ts`, `deepTrimStrings.test.ts`, `createAdminBaseQuery.test.ts` (CSRF recovery heuristics) |
| Locale | `runtime.test.ts`, `messages.parity.test.ts` (en/ru key parity) |
| Pages | `Login.redirect.test.ts` (`resolveLoginRedirectPath`) |
| UI | `SlugField.test.tsx`, `ModalDataProvider.test.tsx`, `modalOwnership.test.ts`, `countNonEmptyFilters.test.ts`, `uploadHelpers.test.ts` |
| Utils / constants | `sanitizeAppPath`, `optimizeImageForUpload`, `isAllowedImageFile`, `checkRequiredFields`, `formDraftStorage`, `imageBatch`, … |

## Storybook

- Stories under `src/**/*.stories.tsx` and MDX
- Local: `yarn storybook` (6006)
- Mocks: `.storybook/mockHooks.ts`, `createStoryStore.ts`
- UI changes should add or update stories when behavior is visible

## What tests do not cover

- Live backend auth/CSRF/upload contracts
- Consumer app integration (for example rocklip-admin-panel)
- npm publish / Pages deploy pipelines (CI YAML only)

Do not point tests at production APIs. Prefer unit tests and Storybook mocks.

## Related

- [Setup](setup.md)
- [Conventions](conventions.md)
