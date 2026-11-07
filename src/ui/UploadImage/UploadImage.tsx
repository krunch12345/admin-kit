import { useCallback, useContext, useEffect, useId, useMemo, useState } from 'react'
import { BiSolidImageAdd } from 'react-icons/bi'
import { IconButton, Tooltip } from '@mui/material'
import { ModalData } from '../Modal/ModalData'
import { DEFAULT_EMPTY_IMAGE_META } from '../ImageMetaFields/imageMetaFieldsConfig'
import { optimizeImageForUpload as defaultOptimizeImageForUpload } from '../../utils/optimizeImageForUpload'
import { formatMessage } from '../../locale/formatMessage'
import { useAdminKitMessages } from '../../locale/useAdminKitMessages'
import { UploadDialogContent } from './UploadDialogContent'
import { GeneralSettingsHeader } from './GeneralSettingsHeader'
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
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [uploadKey, setUploadKey] = useState(0)
  const generalSettings = useGeneralSettingsState()

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
    resetForm()
    setIsModalOpen(false)
    closeModal(modalOwnerId)
  }, [closeModal, modalOwnerId, resetForm])

  const handleOpen = useCallback(() => {
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

  useEffect(() => {
    if (!isModalOpen) return

    setModalData({
      open: true,
      ownerId: modalOwnerId,
      title,
      maxWidth: 'xl',
      fullHeight: true,
      headerExtra: multiple && hasPendingImages
        ? <GeneralSettingsHeader generalSettings={generalSettings} />
        : null,
      children: (
        <UploadDialogContent
          uploadKey={uploadKey}
          multiple={multiple}
          compression={compression}
          pendingImages={pendingImages}
          pendingLimit={pendingLimit}
          metaTemplates={metaTemplates}
          canCut={canCut}
          withMeta={withMeta}
          showFileNameField={showFileNameField}
          generalSettings={generalSettings}
          onFileAdded={addPendingFile}
          onFilesAdded={addPendingFiles}
          onUpdateImage={updatePendingImage}
          onRemoveImage={removePendingImage}
          onImageFileChange={replacePendingImageFile}
          onApplyBulkUpdate={applyBulkUpdate}
          onCopyFields={copyFields}
        />
      ),
      onClose: handleClose,
      shouldConfirmClose: hasPendingImages,
      closeConfirmMessage: messages.upload.modalCloseConfirm,
      isActions: true,
      titleSubmit: messages.upload.modalTitleSubmit,
      notCloseAfterSubmit: true,
      disabledSubmit,
      onSubmit: submit,
    })
  }, [
    addPendingFile,
    addPendingFiles,
    applyBulkUpdate,
    canCut,
    compression,
    copyFields,
    disabledSubmit,
    generalSettings,
    handleClose,
    hasPendingImages,
    isModalOpen,
    messages.upload.modalCloseConfirm,
    messages.upload.modalTitleSubmit,
    metaTemplates,
    modalOwnerId,
    multiple,
    pendingImages,
    pendingLimit,
    removePendingImage,
    replacePendingImageFile,
    setModalData,
    showFileNameField,
    submit,
    title,
    updatePendingImage,
    uploadKey,
    withMeta,
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
