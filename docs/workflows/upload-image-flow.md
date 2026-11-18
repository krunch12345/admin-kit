# Upload image flow

UI: `src/ui/UploadImage/`. Export: `UploadImage` (+ related panels) from `@krunch12345/admin-kit/ui`.

## Ownership split

| Kit owns | Consumer owns |
| --- | --- |
| Modal launcher, drop/paste/file picker (`@rpldy`), pending queue, crop UI, optional client optimize | `uploadFn` HTTP (URL, FormData fields, auth) |
| Batch chunking helpers / soft-hard limits | Interpreting server success/error payloads |
| Calling `setUrl` once per succeeded image | Persisting returned URLs into entity forms |

There is **no** fixed kit upload path. Backend upload routes are outside this package ([expected backend contract](../integrations/expected-backend-contract.md) documents auth/shell only).

## Typical sequence

1. User opens upload modal (`ModalData` + ownership id)
2. Files added via drop zone, paste, or button; optional crop (`canCut`, lazy per-row editor) and meta (`withMeta`)
3. Compression mode: `client` (default, `optimizeImageForUpload`), `server` (meta `mode` gentle/aggressive), or `none`
4. On submit, `useBatchUpload` chunks by hard count/bytes (`BATCH_IMAGE_*` defaults: soft 150 pending, hard 25 per request, ~18 MiB)
5. Each chunk calls `uploadFn({ files, metas, context: { type, folder?, createUniqueName } })`
6. Result normalized to `{ succeeded, failed? }` or an array of images; each success invokes `setUrl`
7. Success toast / modal close only when at least one image was reported (stable `submit` via refs — see CHANGELOG 1.0.2)

## Modal performance notes

`UploadImage` keeps a **stable** `children` / `headerExtra` element in `ModalData` and pushes live queue props through an internal subscription store (`useSyncExternalStore`). Meta and fileName inputs debounce parent commits (`META_INPUT_DEBOUNCE_MS`, default 200) and flush on blur, so typing does not rebuild the modal shell on every keystroke.

When `canCut` is enabled, each pending row shows a compact thumbnail until the user opens the crop editor; `CropControls` / `ReactCrop` mount only for that row. The same compact toolbar can rotate the image 90° clockwise or counter-clockwise.

## Important props

`title`, `type`, `folder?`, `name?`, `setUrl`, `uploadFn`, `canCut?`, `isOnlyType?`, `createUniqueName?`, `multiple?`, `withMeta?`, `metaTemplates?`, `emptyMeta?`, `compression?`, `limits?`, `optimizeImageForUpload?`

## Peers

Optional: `@rpldy/uploady`, `upload-button`, `upload-drop-zone`, `upload-paste`, `upload-preview`, `react-image-crop`. Install when using UploadImage.

## Errors

Localized via `getAddImagesErrorMessage` / upload dictionary keys. App-level file-too-large payloads can be detected with `isAppFileTooLargePayload`.
