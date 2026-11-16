# Hooks and utils

Subpaths: `@krunch12345/admin-kit/hooks`, `@krunch12345/admin-kit/utils`. Also exported from the root barrel (plus batch constants from `src/constants/`).

## Hooks (`src/hooks/`)

| Hook | Purpose |
| --- | --- |
| `useFields` | Field/error helpers for forms |
| `useFormDraft` | Draft persistence helper (pairs with form draft storage utils) |
| `useRouteId` | Route `:id` via `react-router-dom` |
| `useImageSizeInfo` | Dimensions / byte size for image URLs |
| `useLeavePageConfirm` | Unsaved leave confirmation via modal ownership |
| `useListPosition` / `useListPositionSync` | Restore list scroll/selection across navigations |
| `useLoading` | Ties boolean busy flags to `showLoading` slice |
| `useNameDouble` | Duplicate-name checks patterns |
| `useNotify` | Convenience wrapper around alert slice |
| `usePersistedFilters` | Persist filter state |
| `useScreen` | Breakpoint / screen helpers |

There is no public kit export named `useId` (React’s `useId` is used internally).

## Utils (`src/utils/`)

Notable groups:

- Validation / forms: `checkRequiredFields`, `getMissingRequiredFields`, `trimText`, `slugify`, `reviveDateField`, `getChangedFieldLabels`, `createFormDraftStorage`
- Paths: `sanitizeAppPath`, `isSafeAppPath`
- Images: `optimizeImageForUpload`, crop helpers, `isAllowedImageFile`, `copyImageToClipboard`, image size/proxy helpers (`configureImageProxy`, …)
- Lists: `rememberListOpen`, `prepareListReturnAfterCreate` / `Delete`, DOM id helpers
- Feedback: `showQueryAlerts`, `getAddImagesErrorMessage`, `isAppFileTooLargePayload`
- Dates: `formatStringISODate`

## Constants

From root: `BATCH_IMAGE_SOFT_LIMIT` (150), `BATCH_IMAGE_HARD_LIMIT` (25), `BATCH_IMAGE_MAX_BYTES` (18 MiB), chunk helpers; `LOCALE_TEXT` / `getLocaleText` English picker snapshot.

## Related

- [UI primitives](ui-primitives.md)
- [Upload flow](../workflows/upload-image-flow.md)
- [Public API](../architecture/public-api.md)
