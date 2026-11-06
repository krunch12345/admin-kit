import React from 'react'
import { Button, Fab } from '@mui/material'
import { MdExposurePlus1 } from 'react-icons/md'
import PropTypes from 'prop-types'

/**
 * @typedef {object} IProps
 * @property {boolean} isFab - The mark for FAB element.
 * @property {function} onClick - The handle on click.
 * @property {boolean} disabled - The disabled status.
 */

/**
 * Plus1 button component.
 * @type {React.FC<IProps>}
 * @returns {React.ReactElement} The Plus1 button component.
 */
export const Plus1Button = ({ isFab, onClick, disabled }) => {
  return !isFab ? (
    <Button
      type='button'
      size='small'
      color='primary'
      variant='contained'
      onClick={onClick}
      disabled={disabled}
      title='Добавить'
    >
      <MdExposurePlus1 size={25} />
    </Button>
  ) : (
    <Fab
      size='large'
      color='primary'
      sx={{ position: 'absolute', right: 25, top: 34 }}
      disabled={disabled}
      title='Добавить'
    >
      <MdExposurePlus1 size={25} onClick={onClick} />
    </Fab>
  )
}

Plus1Button.propTypes = {
  isFab: PropTypes.bool,
  onClick: PropTypes.func,
  disabled: PropTypes.bool,
}
