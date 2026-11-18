# @krunch12345/admin-kit knowledge base

This is a source-grounded navigation map for coding agents. Start with the relevant row below, follow its implementation references, then verify current source before editing. Documentation describes existing library behavior; consumer apps and backend services are expectations unless verified in this checkout. Source code takes precedence.

Root [AGENTS.md](../AGENTS.md) defines agent policy. Root [README.md](../README.md) is the consumer-facing entry (install, wiring, overview). Export and peer **sources of truth** are barrels + [public API](architecture/public-api.md) + [peer dependencies](integrations/peer-dependencies.md); prefer those over README overview lists. [CONTRIBUTING.md](../CONTRIBUTING.md) and [CHANGELOG.md](../CHANGELOG.md) remain the contribution and release sources of truth. This index is the detailed task-navigation entry under `docs/`.

Package version: **1.3.2** (`package.json`). Prefer **1.3.2+** on npm; `1.3.0` published without a tarball (see [CHANGELOG](../CHANGELOG.md)).

## Task navigation

| Task | Read first | Related |
| --- | --- | --- |
| Reconcile docs drift / before trusting README export or peer lists | [Public API](architecture/public-api.md), [Peer dependencies](integrations/peer-dependencies.md) | Root README, current barrels (`src/index.ts`, subpaths) |
| Understand package shape / layers | [Architecture overview](architecture/overview.md), [structure](architecture/project-structure.md) | [Public API](architecture/public-api.md), [build](architecture/build-and-packaging.md) |
| Change or document exports / subpaths | [Public API](architecture/public-api.md) | [Build and packaging](architecture/build-and-packaging.md), root README (wiring only) |
| Auth / session / CSRF / baseQuery | [Auth module](modules/auth.md), [authentication flow](workflows/authentication-flow.md) | [Backend contract](integrations/expected-backend-contract.md) |
| Shell menu / cache / chrome | [Shell module](modules/shell.md), [layouts and pages](modules/layouts-and-pages.md) | [Consumer integration](workflows/consumer-integration.md) |
| Locale / messages / pickers text | [Locale module](modules/locale.md) | [Conventions](development/conventions.md), [Public API](architecture/public-api.md) (locale subpath vs internal barrel) |
| UI primitives / UploadImage | [UI primitives](modules/ui-primitives.md), [upload flow](workflows/upload-image-flow.md) | [Hooks and utils](modules/hooks-and-utils.md) |
| Wire a consumer app | [Consumer integration](workflows/consumer-integration.md) | [Peer dependencies](integrations/peer-dependencies.md), root README |
| Peers / optional features | [Peer dependencies](integrations/peer-dependencies.md) | [Build and packaging](architecture/build-and-packaging.md) |
| Setup / commands / tests / style | [Setup](development/setup.md), [testing](development/testing.md), [conventions](development/conventions.md) | Root AGENTS.md, CONTRIBUTING.md |

## Document inventory

```text
docs/
  README.md
  architecture/
    overview.md
    project-structure.md
    public-api.md
    build-and-packaging.md
  development/
    setup.md
    testing.md
    conventions.md
  modules/
    auth.md
    shell.md
    locale.md
    layouts-and-pages.md
    ui-primitives.md
    hooks-and-utils.md
  workflows/
    consumer-integration.md
    authentication-flow.md
    upload-image-flow.md
  integrations/
    expected-backend-contract.md
    peer-dependencies.md
```

Each concern has one owning document; workflows describe request order and outcomes without redefining entire export lists. Update only affected documents and keep this index current. When docs and source disagree, prefer source and fix the owning document.
