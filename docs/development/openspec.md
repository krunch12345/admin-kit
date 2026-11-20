# OpenSpec (significant changes)

OpenSpec manages **significant** changes for this package. It is not required for every commit.

Full dual-mode rules, owning-repo selection, and Change lifecycle live in the workspace `rocklip-workspace` Skill and the `rl-coordinator` agent. This document is the per-repo pointer.

## When to use

| Situation | OpenSpec |
| --- | --- |
| Local change, no behavior change | Not needed |
| Small fixable bug | Usually not |
| New functionality / public export change | Needed |
| Auth shell / session contract change | Needed |
| Architecture / peer policy change | Needed |
| Multi-repo impact (kit + consumer) | Usually needed |
| Ambiguous requirements | Clarify first, then decide |

Task **size ≠ impact**: a one-line export change can still require OpenSpec if consumers break.

## This repo’s role

- Package: `@krunch12345/admin-kit`.
- Primary owning repo for **kit surface** Changes (exports, auth/shell/UI primitives, peers).
- Plan `rocklip-admin-panel` consumer follow-up (and publish/bump only when the user asks).

## Layout

- `openspec/config.yaml` — schema + ROCKLIP context for agents
- `openspec/specs/` — main specs (capabilities); keep minimal; do not invent product specs
- `openspec/changes/` — active Changes
- `openspec/changes/archive/` — archived Changes
- `.agents/skills/openspec-*` — Cursor skills (`propose`, `explore`, `apply`, `update`, `archive`, `sync-specs`)

## CLI

Use `npx openspec@latest …` or `yarn dlx openspec@latest …` (or a local `openspec` binary if already installed). Do **not** add OpenSpec as an application dependency in `package.json`.

```bash
npx openspec@latest list
npx openspec@latest view
npx openspec@latest doctor
```

## Lifecycle (Mode 2)

```text
rl-coordinator classifies Mode 1 vs 2
  → Mode 1: ordinary workflow (no Change)
  → Mode 2: explore (optional) → propose → USER AGREES → apply/implement → archive
```

Do not start application coding for a Mode 2 Change until the user agrees the planning artifacts. Do not auto-create a Change for every task.
