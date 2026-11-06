import PropTypes from 'prop-types'
import { Button, Stack } from '@mui/material'

/**
 * Shared Нет / Да actions: Нет = red text, Да = contained primary button.
 * @type {React.FC}
 */
export const ConfirmYesNoActions = ({
  onNo,
  onYes,
  size = 'small',
  yesDisabled = false,
  noLabel = 'Нет',
  yesLabel = 'Да',
}) => (
  <Stack direction='row' spacing={2} width='100%' justifyContent='flex-end' alignItems='center'>
    <Button size={size} color='error' onClick={onNo}>
      {noLabel}
    </Button>
    <Button
      size={size}
      variant='contained'
      disabled={yesDisabled}
      onClick={onYes}
    >
      {yesLabel}
    </Button>
  </Stack>
)

ConfirmYesNoActions.propTypes = {
  onNo: PropTypes.func.isRequired,
  onYes: PropTypes.func.isRequired,
  size: PropTypes.oneOf(['small', 'medium', 'large']),
  yesDisabled: PropTypes.bool,
  noLabel: PropTypes.string,
  yesLabel: PropTypes.string,
}
