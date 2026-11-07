import { Children } from 'react'
import { Checkbox, FormControlLabel, MenuItem, Stack } from '@mui/material'
import { TextField } from '../TextField/TextField'
import { Select } from '../Select/Select'
import { ImageSizeLabel } from '../ImageSizeLabel/ImageSizeLabel'
import { ImageMetaFields } from '../ImageMetaFields/ImageMetaFields'
import { useAdminKitMessages } from '../../locale/useAdminKitMessages'
import type { ImageMetaTemplates } from '../ImageMetaFields/imageMetaFieldsConfig'
import { PendingImageItem } from './PendingImageItem'
import type { CompressionMode, PendingImage, PendingImagePatch, ServerCompressionMode } from './types'
import {
  COMPRESSION_NONE,
  COMPRESSION_SERVER,
  SERVER_COMPRESSION_AGGRESSIVE,
  SERVER_COMPRESSION_GENTLE,
} from './constants'

export interface PendingImageRowProps {
  item: PendingImage
  index: number
  canCut?: boolean
  compression: CompressionMode
  withMeta: boolean
  metaTemplates?: ImageMetaTemplates
  showFileNameField: boolean
  onUpdate: (id: string, partial: PendingImagePatch) => void
  onRemove: (id: string) => void
  onFileChange: (id: string, file: File) => void
}

/**
 * One pending image in the upload dialog: preview, compression options, file name and meta.
 */
export const PendingImageRow = ({
  item,
  index,
  canCut,
  compression,
  withMeta,
  metaTemplates,
  showFileNameField,
  onUpdate,
  onRemove,
  onFileChange,
}: PendingImageRowProps) => {
  const messages = useAdminKitMessages()
  const isCompressionEnabled = compression !== COMPRESSION_NONE

  return (
    <Stack spacing={2} width='100%' alignItems='center'>
      <PendingImageItem
        item={item}
        canCut={canCut}
        showDivider={index > 0}
        onFileChange={onFileChange}
        onRemove={onRemove}
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
            label={messages.common.noCompression}
            control={
              <Checkbox
                color='primary'
                checked={Boolean(item.skipCompression)}
                onChange={(_, checked) => onUpdate(item.id, { skipCompression: checked })}
              />
            }
          />
        )}

        {compression === COMPRESSION_SERVER && (
          <Select
            id={`compressionMode-${item.id}`}
            label={messages.common.compressionMode}
            value={item.compressionMode}
            setValue={(value) => value && onUpdate(item.id, { compressionMode: value as ServerCompressionMode })}
            hideAllItem
            disabled={item.skipCompression}
          >
            {Children.toArray([
              <MenuItem key={SERVER_COMPRESSION_GENTLE} value={SERVER_COMPRESSION_GENTLE}>
                {messages.upload.compressionGentle}
              </MenuItem>,
              <MenuItem key={SERVER_COMPRESSION_AGGRESSIVE} value={SERVER_COMPRESSION_AGGRESSIVE}>
                {messages.upload.compressionAggressive}
              </MenuItem>,
            ])}
          </Select>
        )}
      </Stack>

      {showFileNameField && (
        <TextField
          sx={{ display: 'flex', flex: 1, m: 1, minWidth: '15.5rem', width: '100%' }}
          label={messages.upload.fileName}
          placeholder={messages.upload.fileNamePlaceholder}
          value={item.fileName || ''}
          onChange={(fileName) => onUpdate(item.id, { fileName })}
          onClear={() => onUpdate(item.id, { fileName: '' })}
        />
      )}

      {withMeta && (
        <ImageMetaFields
          values={item}
          templates={metaTemplates}
          onChange={(partial) => onUpdate(item.id, partial)}
        />
      )}
    </Stack>
  )
}
