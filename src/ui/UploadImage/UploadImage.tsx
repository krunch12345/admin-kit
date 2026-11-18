import { useCallback, useContext, useEffect, useId, useMemo, useRef, useState } from 'react'
import { BiSolidImageAdd } from 'react-icons/bi'
import { IconButton, Tooltip } from '@mui/material'
import { ModalData } from '../Modal/ModalData'
import { DEFAULT_EMPTY_IMAGE_META } from '../ImageMetaFields/imageMetaFieldsConfig'
import { optimizeImageForUpload as defaultOptimizeImageForUpload } from '../../utils/optimizeImageForUpload'
import { createSubscriptionStore } from '../../utils/createSubscriptionStore'
import { formatMessage } from '../../locale/formatMessage'
import { useAdminKitMessages } from '../../locale/useAdminKitMessages'
import {
  GeneralSettingsHeaderHost,
  UploadDialogContentHost,
  type UploadDialogStoreState,
} from './UploadDialogContentHost'
import { useUploadQueue } from './hooks/useUploadQueue'
import { useBatchUpload } from './hooks/useBatchUpload'
import { useGeneralSettingsState } from './hooks/useGeneralSettingsState'
import {
  COMPRESSION_CLIENT,
  DEFAULT_LIMITS,
} from './constants'

/**
 * @typedef {object} PendingImage
 * @property {string} id
 * @property {File} file
 * @property {string} imageSrc
 * @property {string} fileName
 * @property {boolean} skipCompression
 * @property {string} compressionMode
 */

/**
 * @typedef {object} UploadFnArgs
 * @property {File[]} files
 * @property {object[]} metas - Per-file meta: fileName, skipCompression, mode (server compression), meta fields.
 * @property {{ type: string, folder?: string, createUniqueName: boolean }} context
 */

/**
 * @typedef {object} IProps
 * @property {string} title
 * @property {string} type
 * @property {string} [folder]
 * @property {string} [name]
 * @property {function(object): void} setUrl - Called once per uploaded image with the payload returned by uploadFn.
 * @property {boolean} [canCut]
 * @property {boolean} [isOnlyType]
 * @property {boolean} [createUniqueName]
 * @property {boolean} [multiple] - Allow many pending images (chunked upload) instead of a single one.
 * @property {boolean} [withMeta] - Show bilingual meta fields per pending image.
 * @property {import('../ImageMetaFields/imageMetaFieldsConfig').ImageMetaTemplates} [metaTemplates]
 * @property {object} [emptyMeta] - Default meta fields of a pending image.
 * @property {function(UploadFnArgs): Promise<{ succeeded: object[], failed?: object[] } | object[]>} uploadFn
 * @property {'client' | 'server' | 'none'} [compression]
 * @property {{ softLimit?: number, hardLimit?: number, maxBytes?: number }} [limits]
 * @property {function(File, { skipCompression?: boolean }): Promise<File>} [optimizeImageForUpload]
 */

/**
 * Upload image dialog launcher: drop zone, paste, file picker, crop, optional meta and compression.
 * The upload itself is delegated to the `uploadFn` prop.
 * @type {React.FC<IProps>}
 */
export const UploadImage = ({
  title,
  type,
  folder,
  name,
  setUrl,
  canCut,
  isOnlyType = false,
  createUniqueName = false,
  multiple = false,
  withMeta = false,
  metaTemplates,
  emptyMeta = DEFAULT_EMPTY_IMAGE_META,
  uploadFn,
  compression = COMPRESSION_CLIENT,
  limits,
  optimizeImageForUpload = defaultOptimizeImageForUpload,
}) => {
  const messages = useAdminKitMessages()
  const modalOwnerId = useId()
  const { setModalData, closeModal } = useContext(ModalData)
  const settledRef = useRef(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [uploadKey, setUploadKey] = useState(0)
  const generalSettings = useGeneralSettingsState()
  const dialogStoreRef = useRef<ReturnType<typeof createSubscriptionStore<UploadDialogStoreState>> | null>(null)

  if (!dialogStoreRef.current) {
    dialogStoreRef.current = createSubscriptionStore<UploadDialogStoreState>({
      uploadKey: 0,
      multiple: false,
      compression: COMPRESSION_CLIENT,
      pendingImages: [],
      pendingLimit: 1,
      metaTemplates: undefined,
      canCut: undefined,
      withMeta: false,
      showFileNameField: false,
      generalSettings: {
        isOpen: false,
        isDirty: false,
        session: 0,
        open: () => {},
        close: () => {},
        setIsDirty: () => {},
      },
      onFileAdded: () => {},
      onFilesAdded: () => {},
      onUpdateImage: () => {},
      onRemoveImage: () => {},
      onImageFileChange: () => {},
      onApplyBulkUpdate: () => {},
      onCopyFields: () => {},
      showHeader: false,
    })
  }

  const dialogStore = dialogStoreRef.current

  const { softLimit, hardLimit, maxBytes } = useMemo(
    () => ({ ...DEFAULT_LIMITS, ...limits }),
    [limits],
  )
  const batchLimits = useMemo(() => ({ hardLimit, maxBytes }), [hardLimit, maxBytes])
  const pendingLimit = multiple ? softLimit : 1

  const queue = useUploadQueue({ name, emptyMeta, multiple, pendingLimit })
  const {
    pendingImages,
    clearPendingImages,
    setPendingImages,
    addPendingFile,
    addPendingFiles,
    updatePendingImage,
    removePendingImage,
    replacePendingImageFile,
    applyBulkUpdate,
    copyFields,
  } = queue
  const { close: closeGeneralSettings } = generalSettings

  const resetForm = useCallback(() => {
    clearPendingImages()
    setUploadKey((key) => key + 1)
    closeGeneralSettings()
  }, [clearPendingImages, closeGeneralSettings])

  const handleClose = useCallback(() => {
    if (settledRef.current) {
      return
    }

    settledRef.current = true
    resetForm()
    setIsModalOpen(false)
    closeModal(modalOwnerId)
  }, [closeModal, modalOwnerId, resetForm])

  const handleOpen = useCallback(() => {
    settledRef.current = false
    resetForm()
    setIsModalOpen(true)
  }, [resetForm])

  const uploadContext = useMemo(
    () => ({ type, folder, createUniqueName }),
    [createUniqueName, folder, type],
  )
  const metaOptions = useMemo(
    () => ({ withMeta, multiple, emptyMeta }),
    [emptyMeta, multiple, withMeta],
  )

  const { isUploading, submit } = useBatchUpload({
    pendingImages,
    uploadFn,
    setUrl,
    optimizeImageForUpload,
    compression,
    limits: batchLimits,
    context: uploadContext,
    metaOptions,
    onAllUploaded: handleClose,
    onSomeFailed: setPendingImages,
  })

  const requiresFileName = !multiple && !createUniqueName
  const hasMissingRequiredFileName = requiresFileName
    && pendingImages.some((item) => !item.fileName)
  const disabledSubmit = !pendingImages.length || isUploading || hasMissingRequiredFileName
  const showFileNameField = withMeta
    || !multiple
    || (!createUniqueName && pendingImages.length === 1)
  const hasPendingImages = pendingImages.length > 0

  const dialogBody = useMemo(
    () => <UploadDialogContentHost store={dialogStore} />,
    [dialogStore],
  )
  const headerExtra = useMemo(
    () => (multiple ? <GeneralSettingsHeaderHost store={dialogStore} /> : null),
    [dialogStore, multiple],
  )

  useEffect(() => {
    if (!isModalOpen) {
      return
    }

    dialogStore.setState({
      uploadKey,
      multiple,
      compression,
      pendingImages,
      pendingLimit,
      metaTemplates,
      canCut,
      withMeta,
      showFileNameField,
      generalSettings,
      onFileAdded: addPendingFile,
      onFilesAdded: addPendingFiles,
      onUpdateImage: updatePendingImage,
      onRemoveImage: removePendingImage,
      onImageFileChange: replacePendingImageFile,
      onApplyBulkUpdate: applyBulkUpdate,
      onCopyFields: copyFields,
      showHeader: multiple && hasPendingImages,
    })
  }, [
    addPendingFile,
    addPendingFiles,
    applyBulkUpdate,
    canCut,
    compression,
    copyFields,
    dialogStore,
    generalSettings,
    hasPendingImages,
    isModalOpen,
    metaTemplates,
    multiple,
    pendingImages,
    pendingLimit,
    removePendingImage,
    replacePendingImageFile,
    showFileNameField,
    updatePendingImage,
    uploadKey,
    withMeta,
  ])

  useEffect(() => {
    if (!isModalOpen || settledRef.current) {
      return
    }

    setModalData({
      open: true,
      ownerId: modalOwnerId,
      title,
      maxWidth: 'xl',
      fullHeight: true,
      headerExtra,
      children: dialogBody,
      onClose: handleClose,
      shouldConfirmClose: hasPendingImages,
      closeConfirmMessage: messages.upload.modalCloseConfirm,
      isActions: true,
      titleSubmit: messages.upload.modalTitleSubmit,
      notCloseAfterSubmit: true,
      disabledSubmit,
      // `submit` is referentially stable and reads the latest queue/setUrl via refs.
      onSubmit: submit,
    })
  }, [
    dialogBody,
    disabledSubmit,
    handleClose,
    hasPendingImages,
    headerExtra,
    isModalOpen,
    messages.upload.modalCloseConfirm,
    messages.upload.modalTitleSubmit,
    modalOwnerId,
    setModalData,
    submit,
    title,
  ])

  useEffect(() => () => {
    closeModal(modalOwnerId)
  }, [closeModal, modalOwnerId])

  const isButtonDisabled = !type || (!isOnlyType && !folder)
  const tooltipTitle = isOnlyType
    ? formatMessage(messages.upload.attachTitle, { title })
    : formatMessage(messages.upload.attachTitleFolderRequired, { title })

  return (
    <Tooltip title={tooltipTitle}>
      <span style={{ display: 'inline-flex' }}>
        <IconButton
          aria-label={tooltipTitle}
          onClick={handleOpen}
          disabled={isButtonDisabled}
        >
          <BiSolidImageAdd />
        </IconButton>
      </span>
    </Tooltip>
  )
}
