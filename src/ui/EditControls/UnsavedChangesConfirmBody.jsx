import { Children } from 'react'
import PropTypes from 'prop-types'
import { Stack, Typography } from '@mui/material'

/**
 * Shared body for cancel / save / router-leave unsaved-changes confirm modals.
 * @param {object} props
 * @param {boolean} [props.isAddNew]
 * @param {string} props.name
 * @param {string[]} [props.changedFieldLabels]
 * @param {string | null} [props.syncPointDeletesLabel] - "Да" | "Нет" when point-delete sync is relevant.
 */
export const UnsavedChangesConfirmBody = ({
  isAddNew,
  name,
  changedFieldLabels = [],
  syncPointDeletesLabel = null,
}) => (
  <Stack spacing={1.5}>
    <Typography variant='overline' fontSize={14}>
      {isAddNew ? 'Создание' : 'Редактирование'} &frasl;&frasl; {name}
    </Typography>

    {changedFieldLabels.length > 0 && (
      <Stack spacing={0.5}>
        <Typography variant='body2' color='text.secondary'>
          Изменённые поля:
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
        {`Синхронизация удаления точек с Общей карты: ${syncPointDeletesLabel}`}
      </Typography>
    )}
  </Stack>
)

UnsavedChangesConfirmBody.propTypes = {
  isAddNew: PropTypes.bool,
  name: PropTypes.string.isRequired,
  changedFieldLabels: PropTypes.arrayOf(PropTypes.string),
  syncPointDeletesLabel: PropTypes.string,
}
