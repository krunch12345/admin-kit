# UI primitives

Source: `src/ui/`. Prefer import from `@krunch12345/admin-kit/ui` (also re-exported from package root).

## Categories (representative)

Full list: `src/ui/index.ts` (also summarized in [public API](../architecture/public-api.md)). Categories below are representative, not exhaustive.

| Category | Examples from `src/ui/index.ts` |
| --- | --- |
| Feedback | `Alert`, `showAlertSlice` / `showAlert` / `hideAlert`, `Loading`, `showLoadingSlice` / `showLoading` / `hideLoading`, `NoDataBox` |
| Overlay | `Modal`, `ModalData`, `ModalDataProvider`, `ConfirmPopper`, `ConfirmYesNoActions`, `DialogRemoveButton` |
| Forms / inputs | `TextField`, `Select`, `Autocomplete`, `IsBooleanSelect`, `OtpCodeInputs`, `SlugField`, `DatePicker`, `DateRangePicker`, `onChangeEndDate`, `DateTimePicker`, `FilterBar`, `countNonEmptyFilters`, `StepByStepForm`, `Counter` |
| Lists / navigation chrome bits | `List`, `ListItem`, `Accordion`, `ResultNameSearch`, `IconButton`, `IconLink`, `Plus1Button`, `RemoveButton` |
| Editing / status | `EditControls`, `UnsavedChangesConfirmBody`, `UpdatedAtInfo`, `StatusIndicators`, `DEFAULT_STATUS_PLATFORMS`, `ColorLegend` |
| Images / clipboard | `UploadImage`, `GeneralSettingsPanel`, `ImageUploadMethods`, `SelectableImageThumb`, `CropControls`, `ImageMetaFields`, `buildFilledFieldsTooltip`, `COPYABLE_META_FIELDS`, `DEFAULT_EMPTY_IMAGE_META`, `IMAGE_META_FIELDS`, `isCopyableFieldFilled`, `isMetaValueFilled`, `ImageSizeLabel`, `CopyButton`, `CopyImageButton` |

Shared styling helper: `fieldSx.ts` (internal to UI modules).

## Redux-coupled UI

Alert and Loading slices must be registered under their default names (`showAlert`, `showLoading`) for kit pages/shell that dispatch them. `Content` reads loading visibility from `showLoadingSelector`.

## UploadImage (summary)

Consumer supplies `uploadFn` and `setUrl`. Kit owns queue UI, crop, optional client compression, batch limits, and modal lifecycle. Full flow: [upload-image-flow](../workflows/upload-image-flow.md). Optional peers: `@rpldy/*`, `react-image-crop`.

## Storybook

Most UI folders include `*.stories.tsx`. Live catalog: https://krunch12345.github.io/admin-kit/
