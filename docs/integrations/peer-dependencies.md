# Peer dependencies

Source: `package.json` `peerDependencies` / `peerDependenciesMeta`. Audit date: 2026-11-17. Package version **1.3.1**.

## Required peers (typical admin app)

| Package | Range |
| --- | --- |
| `react` / `react-dom` | `^18.2.0` |
| `react-router` / `react-router-dom` | `^6.22.0` |
| `react-redux` | `^9.1.0` |
| `@reduxjs/toolkit` | `^2.2.0` |
| `@mui/material` / `@mui/icons-material` | `^5.15.0` |
| `@emotion/react` / `@emotion/styled` | `^11.11.0` |
| `lodash-es` | `^4.17.21` |
| `react-icons` | `^5.0.0` |

## Optional peers (`peerDependenciesMeta`)

Install when using the related feature:

| Package | Feature |
| --- | --- |
| `@mui/x-date-pickers` `^7`, `date-fns` `^2.29` | DatePicker / DateRangePicker / DateTimePicker |
| `@rpldy/uploady` and upload-button / drop-zone / paste / preview `^1.10` | UploadImage file acquisition UI |
| `react-image-crop` `^11.0.10` | Crop controls in upload flow |
| `react-scroll` `^1.9.0` | `Page` hash scrolling |

## Regular dependency

`async-mutex` `^0.5.0` — listed under `dependencies`, externalized in the Vite build so consumers resolve it from `node_modules` (transitively via this package).

## Not a kit peer

`prop-types` is **not** a current peer; PropTypes were removed as the codebase migrated to TypeScript (CHANGELOG). Do not add it for the kit.

## Support policy

CONTRIBUTING: React 18, MUI 5, React Router 6, Redux Toolkit 2. Do not bump peer majors in drive-by PRs.

## Build externals

Vite marks peer keys and related namespace regexes as external so they are not bundled into `dist/`. See [build and packaging](../architecture/build-and-packaging.md).
