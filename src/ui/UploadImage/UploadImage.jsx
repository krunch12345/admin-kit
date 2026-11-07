import { Children, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import PropTypes from 'prop-types'
import { BiSolidImageAdd } from 'react-icons/bi'
import {
  Button as MuiButton,
  Checkbox, FormControlLabel, IconButton, MenuItem, Stack, Tooltip, Typography,
} from '@mui/material'
import SettingsIcon from '@mui/icons-material/Settings'
import Uploady from '@rpldy/uploady'
import { useDispatch } from 'react-redux'
import { ModalData } from '../Modal/ModalData.js'
import { TextField } from '../TextField/TextField.jsx'
import { Select } from '../Select/Select.jsx'
import { DialogRemoveButton } from '../DialogRemoveButton/DialogRemoveButton.jsx'
import { NoDataBox } from '../NoDataBox/NoDataBox.jsx'
import { ImageSizeLabel } from '../ImageSizeLabel/ImageSizeLabel.jsx'
import { showAlert } from '../Alert/showAlertSlice.js'
import { ImageMetaFields } from '../ImageMetaFields/ImageMetaFields.jsx'
import {
  COPYABLE_META_FIELDS,
  DEFAULT_EMPTY_IMAGE_META,
} from '../ImageMetaFields/imageMetaFields.js'
import { useLoading } from '../../hooks/useLoading.js'
import {
  BATCH_IMAGE_HARD_LIMIT,
  BATCH_IMAGE_MAX_BYTES,
  BATCH_IMAGE_SOFT_LIMIT,
  chunkFilesByCountAndBytes,
} from '../../constants/imageBatch.js'
import { getAddImagesErrorMessage } from '../../utils/getAddImagesErrorMessage.js'
import { isAllowedImageFile } from '../../utils/isAllowedImageFile.js'
import { optimizeImageForUpload as defaultOptimizeImageForUpload } from '../../utils/optimizeImageForUpload.js'
import { PendingImageItem } from './PendingImageItem.jsx'
import { GeneralSettingsPanel } from './GeneralSettingsPanel.jsx'
import { ImageUploadMethods } from './ImageUploadMethods.jsx'
import { formatMessage } from '../../locale/formatMessage.js'
import { useAdminKitMessages } from '../../locale/useAdminKitMessages.js'

const COMPRESSION_CLIENT = 'client'
const COMPRESSION_SERVER = 'server'
const COMPRESSION_NONE = 'none'

const DEFAULT_SERVER_COMPRESSION_MODE = 'gentle'

const DEFAULT_LIMITS = {
  softLimit: BATCH_IMAGE_SOFT_LIMIT,
  hardLimit: BATCH_IMAGE_HARD_LIMIT,
  maxBytes: BATCH_IMAGE_MAX_BYTES,
}

const createPendingImageId = () => (
  typeof crypto !== 'undefined' && crypto.randomUUID
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random()}`
)

const readFileAsDataUrl = (file) => new Promise((resolve) => {
  const reader = new FileReader()

  reader.onloadend = () => {
    resolve(typeof reader.result === 'string' ? reader.result : '')
  }
  reader.readAsDataURL(file)
})

const toUploadedImagePayload = (succeeded) => {
  if (!succeeded || typeof succeeded !== 'object') {
    return succeeded
  }

  const { clientIndex: _clientIndex, ...image } = succeeded

  return image
}

const normalizeUploadResult = (result) => {
  if (Array.isArray(result)) {
    return { succeeded: result, failed: [] }
  }

  return {
    succeeded: Array.isArray(result?.succeeded) ? result.succeeded : [],
    failed: Array.isArray(result?.failed) ? result.failed : [],
  }
}

const buildUploadMeta = (item, { withMeta, createUniqueName, multiple, compression, emptyMeta }) => {
  const meta = {}
  const includeFileName = withMeta || !createUniqueName || !multiple

  if (includeFileName && item.fileName) {
    meta.fileName = item.fileName
  }

  if (withMeta) {
    for (const field of Object.keys(emptyMeta)) {
      if (item[field]) {
        meta[field] = item[field]
      }
    }
  }

  if (item.skipCompression) {
    meta.skipCompression = true
  } else if (compression === COMPRESSION_SERVER) {
    meta.mode = item.compressionMode
  }

  return meta
}

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
 * @property {import('../ImageMetaFields/imageMetaFields.js').ImageMetaTemplates} [metaTemplates]
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
  const m = useAdminKitMessages()

  /** @type {[PendingImage[], Function]} */
  const [pendingImages, setPendingImages] = useState([])
  const [uploadKey, setUploadKey] = useState(0)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [isGeneralSettingsOpen, setIsGeneralSettingsOpen] = useState(false)
  const [generalSettingsSession, setGeneralSettingsSession] = useState(0)
  const [isGeneralSettingsDirty, setIsGeneralSettingsDirty] = useState(false)
  const pendingCountRef = useRef(0)

  const { setModalData, closeModal } = useContext(ModalData)
  const dispatch = useDispatch()

  const { softLimit, hardLimit, maxBytes } = useMemo(
    () => ({ ...DEFAULT_LIMITS, ...limits }),
    [limits],
  )
  const pendingLimit = multiple ? softLimit : 1
  const isCompressionEnabled = compression !== COMPRESSION_NONE
  const requiresFileName = !multiple && !createUniqueName
  const showGeneralSettings = multiple

  useLoading(isUploading)

  useEffect(() => {
    pendingCountRef.current = pendingImages.length
  }, [pendingImages.length])

  const resetForm = useCallback(() => {
    setPendingImages([])
    setUploadKey((key) => key + 1)
    setIsGeneralSettingsOpen(false)
    setIsGeneralSettingsDirty(false)
    setGeneralSettingsSession((session) => session + 1)
  }, [])

  const handleClose = useCallback(() => {
    resetForm()
    setIsModalOpen(false)
    closeModal()
  }, [closeModal, resetForm])

  const handleOpen = useCallback(() => {
    resetForm()
    setIsModalOpen(true)
  }, [resetForm])

  const handleOpenGeneralSettings = useCallback(() => {
    setIsGeneralSettingsDirty(false)
    setGeneralSettingsSession((session) => session + 1)
    setIsGeneralSettingsOpen(true)
  }, [])

  const handleCancelGeneralSettings = useCallback(() => {
    setIsGeneralSettingsOpen(false)
    setIsGeneralSettingsDirty(false)
    setGeneralSettingsSession((session) => session + 1)
  }, [])

  const handleGeneralSettingsSaved = useCallback(() => {
    setIsGeneralSettingsOpen(false)
    setIsGeneralSettingsDirty(false)
    setGeneralSettingsSession((session) => session + 1)
  }, [])

  const updatePendingImage = useCallback((id, partial) => {
    setPendingImages((prev) => prev.map((item) => (
      item.id === id ? { ...item, ...partial } : item
    )))
  }, [])

  const handleApplyBulkUpdate = useCallback((ids, partial) => {
    const idSet = new Set(ids)

    setPendingImages((prev) => prev.map((item) => (
      idSet.has(item.id) ? { ...item, ...partial } : item
    )))
  }, [])

  const handleCopyFields = useCallback(({ sourceId, targetIds, fieldKeys }) => {
    const targetSet = new Set(targetIds)
    const fields = COPYABLE_META_FIELDS.filter((field) => fieldKeys.includes(field.key))

    setPendingImages((prev) => {
      const source = prev.find((item) => item.id === sourceId)

      if (!source) {
        return prev
      }

      const partial = {}

      for (const field of fields) {
        partial[field.ruKey] = source[field.ruKey] ?? ''
        partial[field.enKey] = source[field.enKey] ?? ''
      }

      return prev.map((item) => (
        targetSet.has(item.id) ? { ...item, ...partial } : item
      ))
    })
  }, [])

  const createPendingItems = useCallback((files) => {
    const items = files.map((file) => ({
      id: createPendingImageId(),
      file,
      imageSrc: '',
      fileName: name || '',
      skipCompression: false,
      compressionMode: DEFAULT_SERVER_COMPRESSION_MODE,
      ...emptyMeta,
    }))

    items.forEach(async ({ id, file }) => {
      const imageSrc = await readFileAsDataUrl(file)

      updatePendingImage(id, { imageSrc })
    })

    return items
  }, [emptyMeta, name, updatePendingImage])

  const addPendingFiles = useCallback((files) => {
    const candidates = Array.from(files).filter(Boolean)
    const imageFiles = candidates.filter(isAllowedImageFile)
    const blockedUnsafeCount = candidates.filter((file) => {
      const type = String(file.type || '').toLowerCase()
      return type.startsWith('image/') && !isAllowedImageFile(file)
    }).length

    if (!imageFiles.length) {
      dispatch(showAlert({
        isShowAlert: true,
        severity: 'warning',
        message: m.upload.unsupportedImageType,
      }))
      return
    }

    if (blockedUnsafeCount > 0) {
      dispatch(showAlert({
        isShowAlert: true,
        severity: 'warning',
        message: formatMessage(m.upload.skippedUnsafeImages, {
          count: blockedUnsafeCount,
        }),
      }))
    }

    if (!multiple) {
      const [item] = createPendingItems(imageFiles.slice(0, 1))

      pendingCountRef.current = 1
      setPendingImages([item])
      return
    }

    const remaining = pendingLimit - pendingCountRef.current

    if (remaining <= 0) {
      dispatch(showAlert({
        isShowAlert: true,
        severity: 'warning',
        message: formatMessage(m.upload.pendingLimitReached, { pendingLimit }),
      }))
      return
    }

    const acceptedFiles = imageFiles.slice(0, remaining)
    const rejectedCount = imageFiles.length - acceptedFiles.length

    if (rejectedCount > 0) {
      dispatch(showAlert({
        isShowAlert: true,
        severity: 'warning',
        message: formatMessage(m.upload.partialAddDueToLimit, {
          acceptedCount: acceptedFiles.length,
          totalSelected: imageFiles.length,
          pendingLimit,
        }),
      }))
    }

    const newItems = createPendingItems(acceptedFiles)

    pendingCountRef.current += newItems.length
    setPendingImages((prev) => [...prev, ...newItems])
  }, [
    createPendingItems,
    dispatch,
    m.upload.partialAddDueToLimit,
    m.upload.pendingLimitReached,
    m.upload.skippedUnsafeImages,
    m.upload.unsupportedImageType,
    multiple,
    pendingLimit,
  ])

  const addPendingFile = useCallback((file) => {
    addPendingFiles([file])
  }, [addPendingFiles])

  const handleRemovePendingImage = useCallback((id) => {
    setPendingImages((prev) => prev.filter((item) => item.id !== id))
  }, [])

  const handlePendingImageFileChange = useCallback(async (id, file) => {
    if (!file) return

    const imageSrc = await readFileAsDataUrl(file)

    updatePendingImage(id, { file, imageSrc })
  }, [updatePendingImage])

  const handleOnSubmit = useCallback(async () => {
    if (!pendingImages.length || isUploading) return

    setIsUploading(true)
    const failed = []
    let successCount = 0
    const totalCount = pendingImages.length

    const reportUploaded = (succeededItems) => {
      for (const succeeded of succeededItems) {
        setUrl(toUploadedImagePayload(succeeded))
        successCount += 1
      }
    }

    try {
      const prepared = []

      for (const item of pendingImages) {
        const file = compression === COMPRESSION_CLIENT
          ? await optimizeImageForUpload(item.file, { skipCompression: item.skipCompression })
          : item.file

        prepared.push({ ...item, file })
      }

      const chunks = chunkFilesByCountAndBytes(prepared, {
        maxCount: hardLimit,
        maxBytes,
        getSize: (item) => item.file?.size ?? 0,
      })

      for (let chunkIndex = 0; chunkIndex < chunks.length; chunkIndex += 1) {
        const chunk = chunks[chunkIndex]

        if (chunks.length > 1) {
          dispatch(showAlert({
            isShowAlert: true,
            severity: 'info',
            message: formatMessage(m.upload.chunkUploadProgress, {
              chunkIndex: chunkIndex + 1,
              chunkTotal: chunks.length,
            }),
          }))
        }

        const metas = chunk.map((item) => buildUploadMeta(item, {
          withMeta,
          createUniqueName,
          multiple,
          compression,
          emptyMeta,
        }))

        try {
          const result = normalizeUploadResult(await uploadFn({
            files: chunk.map((item) => item.file),
            metas,
            context: { type, folder, createUniqueName },
          }))

          reportUploaded(result.succeeded)

          for (const failedItem of result.failed) {
            const pending = chunk[failedItem.clientIndex]

            if (pending) {
              failed.push(pending)
            }

            if (failedItem?.message) {
              dispatch(showAlert({
                isShowAlert: true,
                severity: 'error',
                message: failedItem.message,
              }))
            }
          }
        } catch (err) {
          const errorFailed = Array.isArray(err?.data?.failed) ? err.data.failed : null

          if (errorFailed?.length) {
            for (const failedItem of errorFailed) {
              const pending = chunk[failedItem.clientIndex]

              if (pending) {
                failed.push(pending)
              }
            }

            reportUploaded(Array.isArray(err?.data?.succeeded) ? err.data.succeeded : [])
          } else {
            failed.push(...chunk)
          }

          dispatch(showAlert({
            isShowAlert: true,
            severity: 'error',
            message: getAddImagesErrorMessage(err),
          }))
        }
      }
    } catch (err) {
      if (!failed.length) {
        failed.push(...pendingImages)
      }

      dispatch(showAlert({
        isShowAlert: true,
        severity: 'error',
        message: getAddImagesErrorMessage(err),
      }))
    } finally {
      setIsUploading(false)
    }

    if (!failed.length) {
      dispatch(showAlert({
        isShowAlert: true,
        severity: 'success',
        message: totalCount === 1
          ? m.upload.singleUploadSuccess
          : formatMessage(m.upload.multiUploadSuccess, { totalCount }),
      }))
      handleClose()
      return
    }

    setPendingImages(failed)

    if (successCount > 0) {
      dispatch(showAlert({
        isShowAlert: true,
        severity: 'warning',
        message: formatMessage(m.upload.partialUploadSuccess, {
          successCount,
          totalCount,
        }),
      }))
    }
  }, [
    compression,
    createUniqueName,
    dispatch,
    emptyMeta,
    folder,
    handleClose,
    hardLimit,
    isUploading,
    maxBytes,
    m.upload.chunkUploadProgress,
    m.upload.multiUploadSuccess,
    m.upload.partialUploadSuccess,
    m.upload.singleUploadSuccess,
    multiple,
    optimizeImageForUpload,
    pendingImages,
    setUrl,
    type,
    uploadFn,
    withMeta,
  ])

  const hasMissingRequiredFileName = requiresFileName
    && pendingImages.some((item) => !item.fileName)
  const disabledSubmit = !pendingImages.length || isUploading || hasMissingRequiredFileName

  const renderGeneralSettingsHeader = useCallback(() => {
    if (!showGeneralSettings || !pendingImages.length) {
      return null
    }

    return (
      <Stack
        direction='row'
        spacing={2}
        alignItems='center'
        flexWrap='wrap'
        useFlexGap
        width='100%'
      >
        <MuiButton
          variant='outlined'
          color='primary'
          startIcon={<SettingsIcon />}
          onClick={handleOpenGeneralSettings}
          disabled={isGeneralSettingsOpen}
        >
          {m.upload.generalSettings}
        </MuiButton>

        {isGeneralSettingsOpen && (
          <DialogRemoveButton
            variant='text'
            label={m.common.cancel}
            showIcon={false}
            requireConfirm={isGeneralSettingsDirty}
            confirmMessage={m.upload.cancelConfirm}
            onRemove={handleCancelGeneralSettings}
          />
        )}
      </Stack>
    )
  }, [
    handleCancelGeneralSettings,
    handleOpenGeneralSettings,
    isGeneralSettingsDirty,
    isGeneralSettingsOpen,
    m.common.cancel,
    m.upload.cancelConfirm,
    m.upload.generalSettings,
    pendingImages.length,
    showGeneralSettings,
  ])

  const showFileNameField = withMeta
    || !multiple
    || (!createUniqueName && pendingImages.length === 1)

  const renderPendingImage = useCallback((item, index) => (
    <Stack spacing={2} width='100%' alignItems='center'>
      <PendingImageItem
        item={item}
        canCut={canCut}
        showDivider={index > 0}
        onFileChange={handlePendingImageFileChange}
        onRemove={handleRemovePendingImage}
      />

      <Stack
        direction='row'
        spacing={2}
        alignItems='center'
        justifyContent='center'
        flexWrap='wrap'
        useFlexGap
      >
        <ImageSizeLabel file={item.file} src={item.imageSrc} />

        {isCompressionEnabled && (
          <FormControlLabel
            label={m.common.noCompression}
            control={
              <Checkbox
                color='primary'
                checked={Boolean(item.skipCompression)}
                onChange={(_, checked) => updatePendingImage(item.id, { skipCompression: checked })}
              />
            }
          />
        )}

        {compression === COMPRESSION_SERVER && (
          <Select
            id={`compressionMode-${item.id}`}
            label={m.common.compressionMode}
            value={item.compressionMode}
            setValue={(value) => value && updatePendingImage(item.id, { compressionMode: value })}
            hideAllItem
            disabled={item.skipCompression}
          >
            {Children.toArray([
              <MenuItem key='gentle' value='gentle'>{m.upload.compressionGentle}</MenuItem>,
              <MenuItem key='aggressive' value='aggressive'>{m.upload.compressionAggressive}</MenuItem>,
            ])}
          </Select>
        )}
      </Stack>

      {showFileNameField && (
        <TextField
          sx={{ display: 'flex', flex: 1, m: 1, minWidth: '15.5rem', width: '100%' }}
          label={m.upload.fileName}
          placeholder={m.upload.fileNamePlaceholder}
          value={item.fileName || ''}
          onChange={(fileName) => updatePendingImage(item.id, { fileName })}
          onClear={() => updatePendingImage(item.id, { fileName: '' })}
        />
      )}

      {withMeta && (
        <ImageMetaFields
          values={item}
          templates={metaTemplates}
          onChange={(partial) => updatePendingImage(item.id, partial)}
        />
      )}
    </Stack>
  ), [
    canCut,
    compression,
    handlePendingImageFileChange,
    handleRemovePendingImage,
    isCompressionEnabled,
    m.common.compressionMode,
    m.common.noCompression,
    m.upload.compressionAggressive,
    m.upload.compressionGentle,
    m.upload.fileName,
    m.upload.fileNamePlaceholder,
    metaTemplates,
    showFileNameField,
    updatePendingImage,
    withMeta,
  ])

  const renderContentUploadImageModal = useCallback(() => (
    <Stack flex={1} width='100%' minHeight={0} display='flex'>
      <Uploady key={uploadKey} multiple={multiple} accept='image/*'>
        <Stack
          spacing={4}
          alignItems='stretch'
          width='100%'
          flex={1}
          sx={{ minHeight: '100%' }}
        >
          {isGeneralSettingsOpen && (
            <GeneralSettingsPanel
              key={generalSettingsSession}
              images={pendingImages}
              templates={metaTemplates}
              hideSkipCompression={!isCompressionEnabled}
              onApplyBulkUpdate={handleApplyBulkUpdate}
              onCopyFields={handleCopyFields}
              onSaved={handleGeneralSettingsSaved}
              onDirtyChange={setIsGeneralSettingsDirty}
            />
          )}

          {!isGeneralSettingsOpen && (
            <Stack spacing={4} alignItems='stretch' width='100%' flex={1} minHeight={0}>
              <ImageUploadMethods
                onFileAdded={addPendingFile}
                onFilesAdded={addPendingFiles}
                multiple={multiple}
                hideLabel={!pendingImages.length}
              />

              {!pendingImages.length ? (
                <Stack
                  flex={1}
                  width='100%'
                  alignItems='center'
                  justifyContent='center'
                  sx={{ minHeight: '40vh' }}
                >
                  <NoDataBox
                    isListEmpty
                    noDataObject={m.upload.noImagesYet}
                  />
                </Stack>
              ) : (
                <Stack spacing={3} alignItems='center' width='100%'>
                  <Stack spacing={3} alignItems='center' width='100%'>
                    {Children.toArray(pendingImages.map(renderPendingImage))}
                  </Stack>

                  {multiple && (
                    <Typography color='text.secondary'>
                      {formatMessage(m.upload.pendingCount, {
                        current: pendingImages.length,
                        limit: pendingLimit,
                      })}
                    </Typography>
                  )}
                </Stack>
              )}
            </Stack>
          )}
        </Stack>
      </Uploady>
    </Stack>
  ), [
    addPendingFile,
    addPendingFiles,
    generalSettingsSession,
    handleApplyBulkUpdate,
    handleCopyFields,
    handleGeneralSettingsSaved,
    isCompressionEnabled,
    isGeneralSettingsOpen,
    m.upload.noImagesYet,
    m.upload.pendingCount,
    metaTemplates,
    multiple,
    pendingImages,
    pendingLimit,
    renderPendingImage,
    uploadKey,
  ])

  useEffect(() => {
    if (!isModalOpen) return

    setModalData({
      open: true,
      title,
      maxWidth: 'xl',
      fullHeight: true,
      headerExtra: renderGeneralSettingsHeader(),
      children: renderContentUploadImageModal(),
      onClose: handleClose,
      shouldConfirmClose: pendingImages.length > 0,
      closeConfirmMessage: m.upload.modalCloseConfirm,
      isActions: true,
      titleSubmit: m.upload.modalTitleSubmit,
      notCloseAfterSubmit: true,
      disabledSubmit,
      onSubmit: handleOnSubmit,
    })
  }, [
    disabledSubmit,
    handleClose,
    handleOnSubmit,
    isModalOpen,
    m.upload.modalCloseConfirm,
    m.upload.modalTitleSubmit,
    pendingImages.length,
    renderContentUploadImageModal,
    renderGeneralSettingsHeader,
    setModalData,
    title,
  ])

  const isButtonDisabled = !type || (!isOnlyType && !folder)
  const tooltipTitle = isOnlyType
    ? formatMessage(m.upload.attachTitle, { title })
    : formatMessage(m.upload.attachTitleFolderRequired, { title })

  return (
    <Tooltip title={tooltipTitle}>
      <div>
        <IconButton onClick={handleOpen} disabled={isButtonDisabled}>
          <BiSolidImageAdd />
        </IconButton>
      </div>
    </Tooltip>
  )
}

UploadImage.propTypes = {
  title: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  folder: PropTypes.string,
  name: PropTypes.string,
  setUrl: PropTypes.func.isRequired,
  canCut: PropTypes.bool,
  isOnlyType: PropTypes.bool,
  createUniqueName: PropTypes.bool,
  multiple: PropTypes.bool,
  withMeta: PropTypes.bool,
  metaTemplates: PropTypes.shape({
    description: PropTypes.arrayOf(PropTypes.object),
    source: PropTypes.arrayOf(PropTypes.object),
  }),
  emptyMeta: PropTypes.object,
  uploadFn: PropTypes.func.isRequired,
  compression: PropTypes.oneOf([COMPRESSION_CLIENT, COMPRESSION_SERVER, COMPRESSION_NONE]),
  limits: PropTypes.shape({
    softLimit: PropTypes.number,
    hardLimit: PropTypes.number,
    maxBytes: PropTypes.number,
  }),
  optimizeImageForUpload: PropTypes.func,
}
