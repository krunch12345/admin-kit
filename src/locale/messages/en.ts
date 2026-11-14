export const enMessages = {
  common: {
    yes: 'Yes',
    no: 'No',
    cancel: 'Cancel',
    cancelShort: 'Cancel',
    save: 'Save',
    delete: 'Delete',
    apply: 'Apply',
    back: 'Back',
    add: 'Add',
    copy: 'Copy',
    clear: 'Clear',
    close: 'Close',
    open: 'Open',
    all: 'All',
    or: 'OR',
    settings: 'Settings',
    signOut: 'Sign out',
    menu: 'Menu',
    home: 'Go to home',
    selectAll: 'Select all',
    changeSelection: 'Change selection',
    noCompression: 'No compression',
    compressionMode: 'Compression mode',
    description: 'Description',
    source: 'Source',
    creating: 'Creating',
    editing: 'Editing',
  },

  auth: {
    sessionExpired: 'Session expired. Please sign in again.',
    authorizationRequired: 'Authentication required',
  },

  account: {
    pageTitle: 'Account',
    nicknameLabel: 'Nickname',
    twoFaLabel: 'Two-factor authentication',
    twoFaGenerateQr: 'Generate QR code',
    twoFaSetupHint: 'Scan the QR code in your authenticator app, then enter the confirmation code. 2FA becomes active only after a successful check.',
    twoFaQrAlt: 'QR code for 2FA',
    twoFaQrGenerated: 'QR code generated. Confirm the code from your app to activate 2FA.',
    twoFaCodeLabel: 'Confirmation code',
    twoFaCodePlaceholder: 'Enter the code from the app',
    twoFaConfirmActivate: 'Confirm and activate',
    twoFaEnabled: 'Two-factor authentication activated successfully.',
    twoFaDisableTitle: 'Disable two-factor authentication',
    twoFaDisablePrompt: 'To disable two-factor authentication, enter your current password:',
    twoFaDisableAction: 'Disable',
    twoFaDisabled: 'Two-factor authentication disabled successfully.',
  },

  login: {
    pageTitle: 'Sign in',
    authCodeRequired: 'Authentication code required',
    loginSuccess: 'Signed in successfully',
    emailLabel: 'Email',
    emailPlaceholder: 'Enter email',
    passwordLabel: 'Password',
    passwordPlaceholder: 'Enter password',
    rememberMe: 'Remember me',
    errorLoginFallback: 'Sign-in failed',
    attemptsRemaining: 'Attempts remaining: ${remainingAttempts}',
    userBlocked: 'User is locked',
    retryAfter: 'Try again in ${retryAfter} s',
    submit: 'Sign in',
    totpPrompt: 'Enter the code from your authenticator app',
    errorVerify2FAFallback: 'Invalid authentication code',
  },

  notFound: {
    title: 'Something went wrong...',
    titleSubmit: 'Go to home',
  },

  shell: {
    openMenu: 'Open menu',
    cacheCleared: 'Cache cleared successfully',
    cacheResetError: 'Failed to clear cache',
    clearCache: 'Clear cache',
    closeMenu: 'Close menu',
  },

  main: {
    searchLabel: 'Site search',
  },

  autocomplete: {
    loadingText: 'Loading...',
    enterName: 'Enter a name',
    nothingFound: 'Nothing found',
    clearText: 'Clear',
    closeText: 'Close',
    openText: 'Open',
  },

  colorLegend: {
    lessThan1Day: 'updated less than 1 day ago',
    lessThan3Days: 'updated less than 3 days ago',
  },

  copyButton: {
    title: 'Copy',
    success: 'Copied to clipboard',
    error: 'Failed to copy',
    copied: 'Copied!',
  },

  copyImageButton: {
    title: 'Copy to clipboard',
    success: 'Image copied to clipboard',
    error: 'Failed to copy image',
    copied: 'Copied!',
  },

  crop: {
    label: 'Crop',
    aspectRatio: 'Aspect ratio',
    free: 'Free',
    applyCrop: 'Apply crop',
    confirmDeleteImage: 'Are you sure you want to delete this image?',
  },

  dateRangePicker: {
    startLabel: 'Start date',
    endLabel: 'End date',
  },

  datePickers: {
    okButtonLabel: 'OK',
    cancelButtonLabel: 'Cancel',
    todayButtonLabel: 'Today',
    clearButtonLabel: 'Clear',
    nextMonth: 'Next month',
    previousMonth: 'Previous month',
    selectView: {
      meridiem: 'Select meridiem',
      hours: 'Select hours',
      minutes: 'Select minutes',
      seconds: 'Select seconds',
      default: 'Select time',
    },
    datePickerToolbarTitle: 'Select date',
    timePickerToolbarTitle: 'Select time',
    dateTimePickerToolbarTitle: 'Select date and time',
  },

  dialogRemove: {
    label: 'Delete',
    confirmMessage: 'Are you sure you want to delete ${nameObject} ${name}?',
    confirmDeleteImages: 'Are you sure you want to delete images: ${count}?',
    title: 'Delete ${nameObject} ${name}',
  },

  editControls: {
    actionCancel: 'cancel',
    actionDelete: 'delete',
    actionSave: 'save',
    confirmTitle: 'Are you sure you want to ${action}?',
    warningRequiredFields: '⚠ WARNING! To "Save", fill in all required form fields!',
    warningNotEdited: '⚠ WARNING! To "Save" while editing, at least one field must be changed!',
    syncPointDeletes: 'Sync point deletion with the Shared map',
  },

  unsavedChanges: {
    changedFields: 'Changed fields:',
    syncPointDeletesLine: 'Sync point deletion with the Shared map: ${syncPointDeletesLabel}',
  },

  formDraft: {
    restoreTitle: 'Restore unsaved changes?',
    restoreMessage: 'A local draft was found. Restore it?',
  },

  filterBar: {
    refreshData: 'Refresh data',
    collapseFilters: 'Collapse filters',
    showAllFilters: 'Show all filters',
    clearFilters: 'Clear filters',
  },

  modal: {
    titleSubmit: 'Apply',
    closeConfirmMessage: 'Are you sure you want to cancel?',
    closeButtonTitle: 'Cancel and close',
    cancelButton: 'Cancel',
  },

  noDataBox: {
    missingInDb: '${noDataObject}${idPart} was not found in the database.',
    idPart: ' with ID ${id}',
    goHome: 'Go to home',
  },

  otp: {
    digitAriaLabel: 'Digit ${index}',
  },

  plus1: {
    title: 'Add',
  },

  removeButton: {
    title: 'Delete ${displayName}',
    confirmMessage: 'Are you sure you want to delete ${displayName}?',
  },

  resultNameSearch: {
    summaryTitle: 'Search results by name',
    noMatches: 'No matches found',
  },

  select: {
    all: 'All',
  },

  slugField: {
    label: 'Slug',
    placeholder: 'url-slug',
    regenerateTitle: 'Generate slug from name',
  },

  accordion: {
    total: 'total: ${count}',
  },

  list: {
    total: 'Total: ${count}',
  },

  imageMeta: {
    name: 'Name',
    namePlaceholder: 'Enter name',
    nameEN: 'Name EN',
    nameENPlaceholder: 'Enter name',
    description: 'Description',
    descriptionPlaceholder: 'Enter description',
    descriptionEN: 'Description EN',
    descriptionENPlaceholder: 'Enter description',
    source: 'Source',
    sourcePlaceholder: 'Enter source',
    sourceEN: 'Source EN',
    sourceENPlaceholder: 'Enter source',
    comment: 'Additional comment',
    commentPlaceholder: 'Enter comment',
    commentEN: 'Comment EN',
    commentENPlaceholder: 'Enter comment',
    emptyFilledFields: 'No filled fields',
  },

  upload: {
    compressionGentle: 'Gentle',
    compressionAggressive: 'Aggressive',
    pendingLimitReached: 'Pending limit of ${pendingLimit} images reached. Remove some or upload the current ones.',
    partialAddDueToLimit: 'Added ${acceptedCount} of ${totalSelected}. Limit is ${pendingLimit} images. The rest were not added.',
    chunkUploadProgress: 'Uploading chunk ${chunkIndex}/${chunkTotal}…',
    singleUploadSuccess: 'Image uploaded successfully',
    multiUploadSuccess: 'Images uploaded: ${totalCount}',
    partialUploadSuccess: 'Uploaded ${successCount} of ${totalCount}. Retry upload for the remaining ones.',
    generalSettings: 'General settings',
    cancelConfirm: 'Are you sure you want to cancel?',
    fileName: 'File name',
    fileNamePlaceholder: 'Enter file name',
    noImagesYet: 'No images uploaded yet',
    pendingCount: 'Images: ${current} / ${limit}',
    modalCloseConfirm: 'Are you sure you want to cancel image upload?',
    modalTitleSubmit: 'Attach',
    attachTitle: '${title}: attach',
    attachTitleFolderRequired: '${title}: attach. Folder name is required.',
    copyAnyField: 'Copy any field from any image to selected images',
    applySetting: 'Apply the selected setting to selected images',
    pickSource: 'Select the image to copy from.',
    noFilledImages: 'No images have the selected fields filled in',
    pickTargets: 'Select the images to copy to.',
    pickImagesForSetting: 'Select images to apply the setting to.',
    selectFile: 'Select file',
    selectFiles: 'Select files',
    dropHere: 'You can drop ${fileNoun} here',
    fileNounSingular: 'a file',
    fileNounPlural: 'files',
    pasteHint: 'Click the field next to it and paste a file from the clipboard',
    chooseViaButton: 'Select ${fileNoun} by clicking the button',
    clipboardPlaceholder: 'Paste file from clipboard',
    preview: 'Preview:',
    confirmDeleteImage: 'Are you sure you want to delete this image?',
    unsupportedImageType: 'Only raster images are allowed (SVG and similar types are blocked).',
    skippedUnsafeImages: 'Skipped ${count} unsupported image file(s). SVG and similar types are blocked.',
  },

  fileSize: {
    bytes: '${value} B',
    kilobytes: '${value} KB',
    megabytes: '${value} MB',
  },

  errors: {
    proxy413: 'Reverse proxy rejected the request body (HTTP 413). Increase nginx client_max_body_size (for example, 256m).',
    uploadFallback: 'Image upload failed',
  },

  console: {
    invalidData: 'Error: input object \'data\' is invalid.',
    invalidRequiredFields: 'Error: array \'requiredFields\' is invalid.',
    fieldMissing: 'Error: field \'${field}\' is missing from the data object.',
    fieldEmptyOrInvalid: 'Error: field \'${field}\' has an empty or invalid value.',
  },
}
