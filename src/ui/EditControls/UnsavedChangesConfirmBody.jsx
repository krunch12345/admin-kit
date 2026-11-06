import { Children } from 'react'
import PropTypes from 'prop-types'
import { Stack, Typography } from '@mui/material'
import { formatMessage } from '../../locale/formatMessage.js'
import { useAdminKitMessages } from '../../locale/useAdminKitMessages.js'

/**
 * Shared body for cancel / save / router-leave unsaved-changes confirm modals.
 * @param {object} props
 * @param {boolean} [props.isAddNew]
 * @param {string} props.name
 * @param {string[]} [props.changedFieldLabels]
 * @param {string | null} [props.syncPointDeletesLabel] - Localized yes/no label when point-delete sync is relevant.
 */
export const UnsavedChangesConfirmBody = ({
  isAddNew,
  name,
  changedFieldLabels = [],
  syncPointDeletesLabel = null,
}) => {
  const m = useAdminKitMessages()

  return (
    <Stack spacing={1.5}>
      <Typography variant='overline' fontSize={14}>
        {isAddNew ? m.common.creating : m.common.editing} &frasl;&frasl; {name}
      </Typography>

      {changedFieldLabels.length > 0 && (
        <Stack spacing={0.5}>
          <Typography variant='body2' color='text.secondary'>
            {m.unsavedChanges.changedFields}
          </Typography>
          <Stack component='ul' spacing={0.25} sx={{ m: 0, pl: 2.5 }}>
            {Children.toArray(
              changedFieldLabels.map((label) => (
                <Typography component='li' variant='body2'>
                  {label}
                </Typography>
              ))
            )}
          </Stack>
        </Stack>
      )}

      {syncPointDeletesLabel !== null && (
        <Typography variant='body2' color='error.main'>
          {formatMessage(m.unsavedChanges.syncPointDeletesLine, { syncPointDeletesLabel })}
        </Typography>
      )}
    </Stack>
  )
}

UnsavedChangesConfirmBody.propTypes = {
  isAddNew: PropTypes.bool,
  name: PropTypes.string.isRequired,
  changedFieldLabels: PropTypes.arrayOf(PropTypes.string),
  syncPointDeletesLabel: PropTypes.string,
}
