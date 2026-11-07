import { Box, Divider, Stack } from '@mui/material'
import { DialogRemoveButton } from '../DialogRemoveButton/DialogRemoveButton'
import { CropControls } from '../CropControls/CropControls'
import { useAdminKitMessages } from '../../locale/useAdminKitMessages'
import type { PendingImage } from './types'

export interface PendingImageItemProps {
  /** Pending image data. */
  item: Pick<PendingImage, 'id' | 'imageSrc' | 'fileName'>
  /** Whether crop controls are shown. */
  canCut?: boolean
  /** Whether to show divider above the item. */
  showDivider: boolean
  /** Updates file for an item. */
  onFileChange: (id: string, file: File) => void
  /** Removes item by id. */
  onRemove: (id: string) => void
}

/**
 * Single pending image row in upload modal.
 */
export const PendingImageItem = ({
  item,
  canCut,
  showDivider,
  onFileChange,
  onRemove,
}: PendingImageItemProps) => {
  const messages = useAdminKitMessages()

  return (
    <>
      {showDivider && (
        <Divider flexItem sx={{ width: '100%', borderBottomWidth: 2, borderColor: 'grey.500' }} />
      )}

      <Stack spacing={2} alignItems='center' width='100%'>
        {canCut ? (
          item.imageSrc ? (
            <CropControls
              imageSrc={item.imageSrc}
              fileName={item.fileName}
              onCropped={(file) => onFileChange(item.id, file)}
              onRemove={() => onRemove(item.id)}
            />
          ) : (
            <DialogRemoveButton
              variant='text'
              confirmMessage={messages.upload.confirmDeleteImage}
              onRemove={() => onRemove(item.id)}
            />
          )
        ) : (
          <>
            {item.imageSrc ? (
              <Box
                component='img'
                src={item.imageSrc}
                alt=''
                sx={{ maxHeight: '60vh', maxWidth: '100%' }}
              />
            ) : null}

            <DialogRemoveButton
              variant='text'
              confirmMessage={messages.upload.confirmDeleteImage}
              onRemove={() => onRemove(item.id)}
            />
          </>
        )}
      </Stack>
    </>
  )
}
