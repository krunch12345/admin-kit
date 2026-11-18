import { useCallback, useEffect, useState } from 'react'
import { Box, Button, Divider, Stack } from '@mui/material'
import { FaCropAlt } from 'react-icons/fa'
import { DialogRemoveButton } from '../DialogRemoveButton/DialogRemoveButton'
import { CropControls } from '../CropControls/CropControls'
import { useAdminKitMessages } from '../../locale/useAdminKitMessages'
import type { PendingImage } from './types'

const PENDING_THUMB_MAX_HEIGHT = 200

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
 * When `canCut` is set, crop UI mounts only after the user opens the editor (lazy crop).
 */
export const PendingImageItem = ({
  item,
  canCut,
  showDivider,
  onFileChange,
  onRemove,
}: PendingImageItemProps) => {
  const messages = useAdminKitMessages()
  const [isCropEditorOpen, setIsCropEditorOpen] = useState(false)

  useEffect(() => {
    setIsCropEditorOpen(false)
  }, [item.imageSrc])

  const handleCropped = useCallback((file: File) => {
    onFileChange(item.id, file)
    setIsCropEditorOpen(false)
  }, [item.id, onFileChange])

  const handleRemove = useCallback(() => {
    onRemove(item.id)
  }, [item.id, onRemove])

  return (
    <>
      {showDivider && (
        <Divider flexItem sx={{ width: '100%', borderBottomWidth: 2, borderColor: 'grey.500' }} />
      )}

      <Stack spacing={2} alignItems='center' width='100%'>
        {canCut ? (
          item.imageSrc ? (
            isCropEditorOpen ? (
              <Stack spacing={2} alignItems='center' width='100%'>
                <CropControls
                  imageSrc={item.imageSrc}
                  fileName={item.fileName}
                  onCropped={handleCropped}
                  onRemove={handleRemove}
                />
                <Button
                  variant='text'
                  color='inherit'
                  onClick={() => setIsCropEditorOpen(false)}
                >
                  {messages.crop.closeEditor}
                </Button>
              </Stack>
            ) : (
              <Stack spacing={2} alignItems='center' width='100%'>
                <Box
                  component='img'
                  src={item.imageSrc}
                  alt=''
                  sx={{
                    maxHeight: PENDING_THUMB_MAX_HEIGHT,
                    maxWidth: '100%',
                    objectFit: 'contain',
                  }}
                />
                <Stack direction='row' spacing={2} alignItems='center' flexWrap='wrap' useFlexGap>
                  <Button
                    variant='outlined'
                    color='primary'
                    startIcon={<FaCropAlt />}
                    onClick={() => setIsCropEditorOpen(true)}
                  >
                    {messages.crop.openEditor}
                  </Button>
                  <DialogRemoveButton
                    variant='text'
                    confirmMessage={messages.upload.confirmDeleteImage}
                    onRemove={handleRemove}
                  />
                </Stack>
              </Stack>
            )
          ) : (
            <DialogRemoveButton
              variant='text'
              confirmMessage={messages.upload.confirmDeleteImage}
              onRemove={handleRemove}
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
              onRemove={handleRemove}
            />
          </>
        )}
      </Stack>
    </>
  )
}