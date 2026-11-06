export { ADMIN_KIT_VERSION } from './version.js'

// locale
export { AdminKitProvider } from './locale/AdminKitProvider.jsx'
export {
  ADMIN_KIT_LOCALES,
  configureAdminKit,
  getAdminKitLocale,
  getAdminKitMessages,
  resolveAdminKitMessages,
} from './locale/runtime.js'
export { enMessages } from './locale/messages/en.js'
export { ruMessages } from './locale/messages/ru.js'
export { formatMessage } from './locale/formatMessage.js'
export { toMuiLocaleText } from './locale/toMuiLocaleText.js'
export {
  useAdminKitLocale,
  useAdminKitLocaleText,
  useAdminKitMessages,
} from './locale/useAdminKitMessages.js'
export {
  getCopyableMetaFields,
  getImageMetaFields,
  useCopyableMetaFields,
  useImageMetaFields,
} from './locale/useImageMetaFields.js'

// auth
export { createAdminBaseQuery } from './auth/createAdminBaseQuery.js'
export { createAuthEndpoints } from './auth/createAuthEndpoints.js'
export { deepTrimStrings } from './auth/deepTrimStrings.js'
export { extractMeta } from './auth/extractMeta.js'
export { handleLogout } from './auth/handleLogout.js'
export { loginSlice, loginSelector, loggedOut, doRememberMe, tokenReceived, authChecked } from './auth/loginSlice.js'
export { PrivateRoute } from './auth/PrivateRoute.jsx'
export { initAdminKitAuth, getAuthHooks } from './auth/runtimeHooks.js'
export { TokenRestorer } from './auth/TokenRestorer.jsx'

// layouts
export { Content } from './layouts/Content.jsx'
export { Page } from './layouts/Page.jsx'

// shell
export { AppBar } from './shell/AppBar.jsx'
export { createShellEndpoints } from './shell/createShellEndpoints.js'
export { Drawer } from './shell/Drawer.jsx'
export { DRAWER_WIDTH } from './shell/drawerWidth.js'
export { Footer } from './shell/Footer.jsx'
export { Header } from './shell/Header.jsx'
export { MenuElement } from './shell/MenuElement.jsx'
export { initAdminKitShell, getShellHooks } from './shell/runtimeHooks.js'

// pages
export { Account } from './pages/Account.jsx'
export { Login } from './pages/Login.jsx'
export { Main } from './pages/Main.jsx'
export { NotFound } from './pages/NotFound.jsx'
export { NotFoundModal } from './pages/NotFoundModal.jsx'

// ui
export { Accordion } from './ui/Accordion/Accordion.jsx'
export { Alert } from './ui/Alert/Alert.jsx'
export { showAlertSlice, showAlertSelector, showAlert, hideAlert } from './ui/Alert/showAlertSlice.js'
export { Autocomplete } from './ui/Autocomplete/Autocomplete.jsx'
export { ColorLegend } from './ui/ColorLegend/ColorLegend.jsx'
export { ConfirmPopper } from './ui/ConfirmYesNo/ConfirmPopper.jsx'
export { ConfirmYesNoActions } from './ui/ConfirmYesNo/ConfirmYesNoActions.jsx'
export { CopyButton } from './ui/CopyButton/CopyButton.jsx'
export { CopyImageButton } from './ui/CopyImageButton/CopyImageButton.jsx'
export { Counter } from './ui/Counter/Counter.jsx'
export { CropControls } from './ui/CropControls/CropControls.jsx'
export { DatePicker } from './ui/DatePicker/DatePicker.jsx'
export { DateRangePicker } from './ui/DateRangePicker/DateRangePicker.jsx'
export { onChangeEndDate } from './ui/DateRangePicker/onChangeEndDate.js'
export { DateTimePicker } from './ui/DateTimePicker/DateTimePicker.jsx'
export { DialogRemoveButton } from './ui/DialogRemoveButton/DialogRemoveButton.jsx'
export { EditControls } from './ui/EditControls/EditControls.jsx'
export { UnsavedChangesConfirmBody } from './ui/EditControls/UnsavedChangesConfirmBody.jsx'
export { countNonEmptyFilters } from './ui/FilterBar/countNonEmptyFilters.js'
export { FilterBar } from './ui/FilterBar/FilterBar.jsx'
export { IconButton } from './ui/IconButton/IconButton.jsx'
export { IconLink } from './ui/IconLink/IconLink.jsx'
export { buildFilledFieldsTooltip } from './ui/ImageMetaFields/buildFilledFieldsTooltip.jsx'
export { ImageMetaFields } from './ui/ImageMetaFields/ImageMetaFields.jsx'
export {
  COPYABLE_META_FIELDS,
  DEFAULT_EMPTY_IMAGE_META,
  IMAGE_META_FIELDS,
  isCopyableFieldFilled,
  isMetaValueFilled,
} from './ui/ImageMetaFields/imageMetaFields.js'
export { ImageSizeLabel } from './ui/ImageSizeLabel/ImageSizeLabel.jsx'
export { IsBooleanSelect } from './ui/IsBooleanSelect/IsBooleanSelect.jsx'
export { List } from './ui/List/List.jsx'
export { ListItem } from './ui/ListItem/ListItem.jsx'
export { Loading } from './ui/Loading/Loading.jsx'
export { showLoadingSlice, showLoadingSelector, showLoading, hideLoading } from './ui/Loading/showLoadingSlice.js'
export { Modal } from './ui/Modal/Modal.jsx'
export { ModalData } from './ui/Modal/ModalData.js'
export { ModalDataProvider } from './ui/Modal/ModalDataProvider.jsx'
export { NoDataBox } from './ui/NoDataBox/NoDataBox.jsx'
export { OtpCodeInputs } from './ui/OtpCodeInputs/OtpCodeInputs.jsx'
export { Plus1Button } from './ui/Plus1Button/Plus1Button.jsx'
export { RemoveButton } from './ui/RemoveButton/RemoveButton.jsx'
export { ResultNameSearch } from './ui/ResultNameSearch/ResultNameSearch.jsx'
export { Select } from './ui/Select/Select.jsx'
export { DEFAULT_STATUS_PLATFORMS, StatusIndicators } from './ui/StatusIndicators/StatusIndicators.jsx'
export { StepByStepForm } from './ui/StepByStepForm/StepByStepForm.jsx'
export { STEPS } from './ui/StepByStepForm/steps.js'
export { TextField } from './ui/TextField/TextField.jsx'
export { UpdatedAtInfo } from './ui/UpdatedAtInfo/UpdatedAtInfo.jsx'
export { GeneralSettingsPanel } from './ui/UploadImage/GeneralSettingsPanel.jsx'
export { ImageUploadMethods } from './ui/UploadImage/ImageUploadMethods.jsx'
export { SelectableImageThumb } from './ui/UploadImage/SelectableImageThumb.jsx'
export { UploadImage } from './ui/UploadImage/UploadImage.jsx'

// hooks
export { useFields } from './hooks/useFields.js'
export { useId } from './hooks/useId.js'
export { useImageSizeInfo } from './hooks/useImageSizeInfo.js'
export { useListPosition, useListPositionSync } from './hooks/useListPosition.js'
export { useLoading } from './hooks/useLoading.js'
export { useNameDouble } from './hooks/useNameDouble.js'
export { usePersistedFilters } from './hooks/usePersistedFilters.js'
export { useScreen } from './hooks/useScreen.js'

// utils
export { checkRequiredFields } from './utils/checkRequiredFields.js'
export { copyImageToClipboard } from './utils/copyImageToClipboard.js'
export { getAddImagesErrorMessage, isAppFileTooLargePayload } from './utils/getAddImagesErrorMessage.js'
export { formatStringISODate } from './utils/formatStringISODate.js'
export { getChangedFieldLabels } from './utils/getChangedFieldLabels.js'
export { configureImageProxy, getProxiedImageFetchUrl, getImageFetchAttempts } from './utils/getProxiedImageFetchUrl.js'
export {
  clearImageByteSizeCache,
  formatFileSize,
  formatImageDimensions,
  formatImageSizeLabel,
  loadImageDimensions,
  fetchImageByteSize,
} from './utils/imageSize.js'
export {
  getListItemDomId,
  readListPosition,
  writeListPosition,
  clearListScrollTarget,
  getListNeighborId,
  rememberListOpen,
  prepareListReturnAfterCreate,
  prepareListReturnAfterDelete,
} from './utils/listPosition.js'
export {
  OPTIMIZE_JPEG_QUALITY,
  OPTIMIZE_MAX_SIDE,
  OPTIMIZE_SKIP_UNDER_BYTES,
  buildOptimizedJpegFileName,
  computeTargetDimensions,
  getFileNameStem,
  optimizeImageForUpload,
  shouldSkipOptimizeImage,
} from './utils/optimizeImageForUpload.js'
export { showQueryAlerts } from './utils/showQueryAlerts.js'
export { slugify } from './utils/slugify.js'
export { trimText } from './utils/trimText.js'

// constants
export {
  BATCH_IMAGE_HARD_LIMIT,
  BATCH_IMAGE_MAX_BYTES,
  BATCH_IMAGE_SOFT_LIMIT,
  chunkArray,
  chunkFilesByCountAndBytes,
  getUploadItemByteSize,
} from './constants/imageBatch.js'
export { LOCALE_TEXT, getLocaleText } from './constants/localeText.js'
