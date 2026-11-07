import { Stack, Typography } from '@mui/material'
import { useBatchAddListener } from '@rpldy/uploady'
import { useAdminKitMessages } from '../../locale/useAdminKitMessages'

export interface FileUploadProps {
  /** Callback when image files are added (FileList order). */
  onFilesAdded: (files: File[]) => void
  /** Hide preview label container. */
  hideLabel?: boolean
}

/**
 * File Upload component.
 * Collects files from Uploady in selection/drop order; cancels the mock upload queue
 * because files are handled locally and sent later via the API.
 */
export const FileUpload = ({ onFilesAdded, hideLabel = false }: FileUploadProps) => {
  const messages = useAdminKitMessages()

  useBatchAddListener((batch) => {
    const files = batch.items
      .map((item) => item.file)
      .filter((file): file is File => file instanceof File)

    if (files.length) {
      onFilesAdded(files)
    }

    return false
  })

  return (
    <Stack spacing={1} alignItems='center' sx={hideLabel ? { display: 'none' } : undefined}>
      <Typography>{messages.upload.preview}</Typography>
    </Stack>
  )
}
