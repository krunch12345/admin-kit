import { Stack, Typography } from '@mui/material'
import { useBatchAddListener } from '@rpldy/uploady'
import PropTypes from 'prop-types'
import { useAdminKitMessages } from '../../locale/useAdminKitMessages.js'

/**
 * @typedef {object} IProps
 * @property {function(File[]): void} onFilesAdded - Callback when image files are added (FileList order).
 * @property {boolean} [hideLabel] - Hide preview label container.
 */

/**
 * File Upload component.
 * Collects files from Uploady in selection/drop order; cancels the mock upload queue
 * because files are handled locally and sent later via the API.
 * @type {React.FC<IProps>}
 * @returns {React.ReactElement} The FileUpload component.
 */
export const FileUpload = ({ onFilesAdded, hideLabel = false }) => {
  const messages = useAdminKitMessages()

  useBatchAddListener((batch) => {
    const files = batch.items
      .map((item) => item.file)
      .filter(Boolean)

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

FileUpload.propTypes = {
  onFilesAdded: PropTypes.func.isRequired,
  hideLabel: PropTypes.bool,
}
