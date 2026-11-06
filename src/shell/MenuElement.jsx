import { useState } from 'react'
import PropTypes from 'prop-types'
import { ListItem, ListItemButton, ListItemText } from '@mui/material'
import { Link, useLocation } from 'react-router-dom'

/**
 * @typedef {object} IProps
 * @property {boolean} [drawerOpen] - The drawer open status.
 * @property {MenuElement} element - The Menu element.
 * @property {function} setDrawerOpen - The Menu element.
 */

/**
 * Menu element component.
 * @type {React.FC<IProps>}
 * @returns {React.ReactElement} The Menu element component.
 */
export const MenuElement = ({ drawerOpen, element, setDrawerOpen }) => {
  const [hover, setHover] = useState(false)

  const { pathname } = useLocation()

  const selected = pathname.includes(element.path)

  const handleClick = (e) => {
    if (!e.ctrlKey && !e.metaKey && !e.shiftKey && !e.altKey) {
      setDrawerOpen(false)
    }
  }

  return (
    <ListItem
      disablePadding
      sx={{ display: 'block' }}
      onMouseOver={() => setHover(true)}
      onMouseOut={() => setHover(false)}
    >
      <ListItemButton
        component={Link}
        to={element.path}
        sx={{
          minHeight: 48,
          justifyContent: drawerOpen ? 'initial' : 'center',
          px: 2.5,
        }}
        onClick={handleClick}
        selected={selected}
      >
        <ListItemText
          primary={element.name}
          sx={{
            opacity: drawerOpen ? 1 : 0,
            color: theme => hover || selected ? theme.palette.primary.main : 'inherit'
          }}
        />
      </ListItemButton>
    </ListItem>
  )
}

MenuElement.propTypes = {
  drawerOpen: PropTypes.bool,
  element: PropTypes.object.isRequired,
  setDrawerOpen: PropTypes.func.isRequired,
}
