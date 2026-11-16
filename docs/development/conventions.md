# Coding conventions

Primary contributor checklist: [CONTRIBUTING.md](../../CONTRIBUTING.md). This page expands agent-oriented guidance grounded in current tooling.

## Language and React

- TypeScript `.ts` / `.tsx` only under `src/`
- Arrow functions for declarations and callbacks
- Import hooks from `react` directly (not `React.useState`)
- Prefer MUI dedicated props over `sx` when a prop exists; use `Stack` for multi-child layout, `Box` for single-child or non-layout wrappers when following consumer MUI rules in kit code that already uses that pattern
- Keep accessibility in mind (eslint-plugin-jsx-a11y is enabled; some rules are warn)

## Locale and copy

- User-facing strings belong in `src/locale/messages/en.ts` and `ru.ts`
- Read messages via `useAdminKitMessages` / `getAdminKitMessages` / `formatMessage`
- Keep en/ru parity (`messages.parity.test.ts`)
- Component props may override dictionary values when passed

## Public API discipline

- Export intentionally through root and subpath barrels
- Breaking or behavioral API changes: update [CHANGELOG.md](../../CHANGELOG.md) (Keep a Changelog + SemVer)
- Prefer `@krunch12345/admin-kit/ui` for UI symbols that share MUI names
- Do not bump peer major ranges in drive-by changes (support policy: React 18, MUI 5, React Router 6, RTK 2)

## State and auth

- Preserve slice names `login`, `showAlert`, `showLoading` unless migrating consumers
- Pass RTK `extraOptions` (`requiresAuth`, `silentAuthFailure`, `suppressGlobalError`) — not legacy `__meta` on args (baseQuery strips `__meta` if present)
- Never persist access tokens or passwords in Web Storage

## Documentation maintenance

When architecture, exports, workflows, or integration expectations change, update only the owning docs under `docs/` and the [task index](../README.md). Link to README/CONTRIBUTING/CHANGELOG; do not duplicate long consumer tutorials into AGENTS.md.

## Related

- [Setup](setup.md)
- [Testing](testing.md)
- [Public API](../architecture/public-api.md)
