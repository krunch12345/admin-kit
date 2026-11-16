# Repository Guidelines

## Documentation Navigation and Maintenance

For each task, open [docs/README.md](docs/README.md), use its [Task navigation](docs/README.md#task-navigation) table, and read only the documents indicated for the task. Follow additional references only when needed. Use them as a navigation guide, verify important details against current source, and avoid exploring unrelated areas. Source code takes precedence; identify discrepancies and clearly mark consumer-app or backend behavior that cannot be verified in this package. When changes affect architecture, public API, workflows, or integrations, update only the relevant documentation and index; preserve unrelated documents and instructions.

Before trusting consumer README lists for exports or peers, or when reconciling docs drift, skim [docs/audit-findings.md](docs/audit-findings.md). For export / subpath / peer questions, prefer [docs/architecture/public-api.md](docs/architecture/public-api.md), [docs/integrations/peer-dependencies.md](docs/integrations/peer-dependencies.md), and current barrels (`src/index.ts`, subpath entries) over README overview lists.

Consumer-facing install and wiring guides live in [README.md](README.md). Contribution scripts and support policy live in [CONTRIBUTING.md](CONTRIBUTING.md). Release notes live in [CHANGELOG.md](CHANGELOG.md). Do not replace those files with this knowledge base; link to them instead.

## Scope and Sources of Truth

These guidelines apply only to this library checkout (`admin-kit`, package name `@krunch12345/admin-kit`). Its agent knowledge base is [docs/](docs/README.md). Consumer apps (for example `rocklip-admin-panel`) and backend repositories have their own instructions and contracts; their implementations do not redefine this package’s public API unless verified here.

Inspect the target directory, git status, and applicable instructions first. Run commands from this checkout and preserve unrelated user changes. Current source and configuration establish implemented behavior; older audit documents or README snippets may be outdated.

## Technology Stack and Architecture

The library is TypeScript React source built with Vite 7 library mode (ESM only), `vite-plugin-dts` for `.d.ts`, Vitest (jsdom), ESLint 9 flat config, and Storybook 8 (React Vite). Requires **Node.js >= 20** (`engines` in `package.json`). Runtime peers center on React 18, MUI 5, React Router 6, Redux Toolkit 2 / RTK Query, Emotion, plus required utilities **`lodash-es`** and **`react-icons`**. Optional peers cover upload (`@rpldy/*`, `react-image-crop`), date pickers (`@mui/x-date-pickers`, `date-fns`), and `react-scroll`. Full peer table: [peer dependencies](docs/integrations/peer-dependencies.md). The only regular runtime dependency is `async-mutex` (externalized in the build).

Public surface ships from `src/index.ts` plus subpath entries (`auth`, `shell`, `ui`, `locale`, `hooks`, `utils`). Prefer intentional subpath imports for UI names that collide with MUI. Do not introduce a parallel UI or state library without agreement. Do not break or silently reshape the public API without updating [CHANGELOG.md](CHANGELOG.md) and coordinating consumer follow-up.

## Library Structure

Use the [project structure map](docs/architecture/project-structure.md) for directory responsibilities. Main areas: `src/auth/`, `src/shell/`, `src/locale/`, `src/layouts/`, `src/pages/`, `src/ui/`, `src/hooks/`, `src/utils/`, `src/config/`, `src/constants/`. Build and packaging details: [build and packaging](docs/architecture/build-and-packaging.md). Public export map: [public API](docs/architecture/public-api.md).

## Environment and Safety

This package has no application `.env` of its own; consumer apps own API base URLs, cookies, and secrets. Document configuration with names only — never print, commit, or quote secret values. Storybook and local kit demos are not production API targets and must not be used to exercise live auth or mutations against production services. Do not create a GitHub Release, run the publish workflow, or `npm publish` without explicit user approval. See [environment and commands](docs/development/setup.md) for local scripts and secret-handling notes.

## Coding Standards

Follow [CONTRIBUTING.md](CONTRIBUTING.md) and [coding conventions](docs/development/conventions.md), `eslint.config.js`, and `tsconfig.json`. Prefer explicit types over new `any` casts where practical. Use arrow functions; import React hooks directly. Prefer MUI component props over `sx` when a built-in prop exists. User-facing strings go through `useAdminKitMessages` / `formatMessage` (en/ru dictionaries). Preserve peer dependency majors and optional-peer boundaries unless the task explicitly changes support policy.

## Development and Mandatory Verification

Run commands from this checkout using Yarn 3.5.1 (`packageManager` in `package.json`); preserve `yarn.lock`. See [environment and commands](docs/development/setup.md) and [testing](docs/development/testing.md).

Every implementation must be checked before reporting completion. For library code, run `yarn lint`, `yarn typecheck`, `yarn test`, and `yarn build`. For meaningful UI changes, run or update Storybook (`yarn storybook` / add or refresh stories). Report checks run, results, and blockers; do not describe unrun checks as passing. Tests must not require production services or live npm publish.

## Git, Pull Requests, and Publish

Do not commit, push, merge, create a GitHub Release, run the publish workflow, or `npm publish` without explicit user approval for that operation. Permission to implement, test, or build does not grant publication permission. Do not run destructive Git cleanup on existing work.

History uses Conventional Commit subjects (for example `feat(ui):`, `fix(auth):`, `chore(build):`, `test(upload):`). When commits are authorized, follow that convention and Keep a Changelog / SemVer in [CHANGELOG.md](CHANGELOG.md).

CI (`.github/workflows/ci.yml`) runs lint, typecheck, test, and build on push/PR. Storybook Pages deploy (`.github/workflows/storybook.yml`) runs on push to `main`/`master` or `workflow_dispatch`. npm publish (`.github/workflows/publish.yml`) runs only on a published GitHub Release: the workflow runs lint/typecheck/test/build, then `npm publish` (which also triggers `prepublishOnly` from `package.json`). Treat Release publish as package publication and obtain approval accordingly. Do not use publish or Pages deploy as a local verification step.

## Library Constraints

- Preserve subpath `exports` and Vite multi-entry build alignment with `package.json`.
- Keep peer dependency majors stable unless explicitly changing support policy; optional peers stay optional.
- Redux slice keys expected by the kit remain `login`, `showAlert`, `showLoading` unless a coordinated migration is approved.
- Do not persist access tokens or passwords in browser storage; session markers use namespaced flags only (`admin-kit:hasSession` by default).
- Upload HTTP is consumer-owned via `uploadFn`; do not hard-code a backend upload path into the kit UI.
- Prefer `@krunch12345/admin-kit/ui` for UI imports when names may collide with MUI.
