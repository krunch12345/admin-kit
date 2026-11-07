import { Children } from 'react'
import { Stack, Typography } from '@mui/material'
import Uploady from '@rpldy/uploady'
import { NoDataBox } from '../NoDataBox/NoDataBox'
import { formatMessage } from '../../locale/formatMessage'
import { useAdminKitMessages } from '../../locale/useAdminKitMessages'
import { GeneralSettingsPanel } from './GeneralSettingsPanel'
import { ImageUploadMethods } from './ImageUploadMethods'
import { PendingImageRow } from './PendingImageRow'
import { COMPRESSION_NONE } from './constants'
import type { ImageMetaTemplates } from '../ImageMetaFields/imageMetaFieldsConfig'
import type {
  ApplyBulkUpdateHandler,
  CompressionMode,
  CopyFieldsHandler,
  GeneralSettingsState,
  PendingImage,
  PendingImagePatch,
} from './types'

export interface UploadDialogContentProps {
  uploadKey: number
  multiple: boolean
  compression: CompressionMode
  pendingImages: PendingImage[]
  pendingLimit: number
  metaTemplates?: ImageMetaTemplates
  canCut?: boolean
  withMeta: boolean
  showFileNameField: boolean
  generalSettings: GeneralSettingsState
  onFileAdded: (file: File) => void
  onFilesAdded: (files: File[]) => void
  onUpdateImage: (id: string, partial: PendingImagePatch) => void
  onRemoveImage: (id: string) => void
  onImageFileChange: (id: string, file?: File | null) => void
  onApplyBulkUpdate: ApplyBulkUpdateHandler
  onCopyFields: CopyFieldsHandler
}

/**
 * Body of the upload modal: file sources, pending images list or general settings panel.
 */
export const UploadDialogContent = ({
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
  onFileAdded,
  onFilesAdded,
  onUpdateImage,
  onRemoveImage,
  onImageFileChange,
  onApplyBulkUpdate,
  onCopyFields,
}: UploadDialogContentProps) => {
  const messages = useAdminKitMessages()
  const hasPendingImages = pendingImages.length > 0

  return (
    <Stack flex={1} width='100%' minHeight={0} display='flex'>
      <Uploady key={uploadKey} multiple={multiple} accept='image/*'>
        <Stack
          spacing={4}
          alignItems='stretch'
          width='100%'
          flex={1}
          sx={{ minHeight: '100%' }}
        >
          {generalSettings.isOpen ? (
            <GeneralSettingsPanel
              key={generalSettings.session}
              images={pendingImages}
              templates={metaTemplates}
              hideSkipCompression={compression === COMPRESSION_NONE}
              onApplyBulkUpdate={onApplyBulkUpdate}
              onCopyFields={onCopyFields}
              onSaved={generalSettings.close}
              onDirtyChange={generalSettings.setIsDirty}
            />
          ) : (
            <Stack spacing={4} alignItems='stretch' width='100%' flex={1} minHeight={0}>
              <ImageUploadMethods
                onFileAdded={onFileAdded}
                onFilesAdded={onFilesAdded}
                multiple={multiple}
                hideLabel={!hasPendingImages}
              />

              {hasPendingImages ? (
                <Stack spacing={3} alignItems='center' width='100%'>
                  <Stack spacing={3} alignItems='center' width='100%'>
                    {Children.toArray(pendingImages.map((item, index) => (
                      <PendingImageRow
                        key={item.id}
                        item={item}
                        index={index}
                        canCut={canCut}
                        compression={compression}
                        withMeta={withMeta}
                        metaTemplates={metaTemplates}
                        showFileNameField={showFileNameField}
                        onUpdate={onUpdateImage}
                        onRemove={onRemoveImage}
                        onFileChange={onImageFileChange}
                      />
                    )))}
                  </Stack>

                  {multiple && (
                    <Typography color='text.secondary'>
                      {formatMessage(messages.upload.pendingCount, {
                        current: pendingImages.length,
                        limit: pendingLimit,
                      })}
                    </Typography>
                  )}
                </Stack>
              ) : (
                <Stack
                  flex={1}
                  width='100%'
                  alignItems='center'
                  justifyContent='center'
                  sx={{ minHeight: '40vh' }}
                >
                  <NoDataBox isListEmpty noDataObject={messages.upload.noImagesYet} />
                </Stack>
              )}
            </Stack>
          )}
        </Stack>
      </Uploady>
    </Stack>
  )
}
