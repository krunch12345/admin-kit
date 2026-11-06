import { Tooltip, IconButton as MuiIconButton } from '@mui/material'
import PropTypes from 'prop-types'

/**
 * @param {import('@mui/material').Theme} theme
 * @param {string} color
 * @param {'main' | 'dark'} tone
 * @returns {string}
 */
const resolvePaletteColor = (theme, color, tone = 'main') => {
  const paletteColor = theme.palette[color]

  if (paletteColor && typeof paletteColor === 'object' && paletteColor[tone]) {
    return paletteColor[tone]
  }

  return color
}

/**
 * @typedef {object} IProps
 * @property {ReactNode} icon - The Icon for button.
 * @property {string} title - The title for Tooltip.
 * @property {function} onClick - The onClick IconButton.
 */

/**
 * Custom icon button component.
 * @type {React.FC<import('@mui/material/IconButton').IconButtonProps & IProps>}
 * @returns {React.ReactElement} The custom icon button.
 */
export const IconButton = ({ title, onClick, icon, color, sx, disabled, ...props }) => {
  const coloredSx = color
    ? {
      color: (theme) => resolvePaletteColor(theme, color, 'main'),
      ':hover': {
        color: (theme) => resolvePaletteColor(theme, color, 'dark'),
      },
    }
    : {
      ':hover': {
        color: (theme) => theme.palette.primary.main,
      },
    }

  return (
    <Tooltip title={title}>
      <span style={{ display: 'inline-flex', cursor: disabled ? 'default' : 'pointer' }}>
        <MuiIconButton
          size='small'
          color={color}
          disabled={disabled}
          onClick={(e) => {
            e.stopPropagation()
            onClick(e)
          }}
          sx={[
            coloredSx,
            ...(Array.isArray(sx) ? sx : sx ? [sx] : []),
          ]}
          {...props}
        >
          {icon}
        </MuiIconButton>
      </span>
    </Tooltip>
  )
}

IconButton.propTypes = {
  icon: PropTypes.node.isRequired,
  title: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
  color: PropTypes.string,
  disabled: PropTypes.bool,
  sx: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
}
