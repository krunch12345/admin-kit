import { useState } from 'react'
import type { MouseEvent } from 'react'
import { ListItem, ListItemButton, ListItemText } from '@mui/material'
import { Link, useLocation } from 'react-router-dom'
import { sanitizeAppPath } from '../utils/sanitizeAppPath'

export interface AdminKitMenuItem {
  name: string
  path: string
}

export interface MenuElementProps {
  /** The drawer open status. */
  drawerOpen?: boolean
  /** The Menu element. */
  element: AdminKitMenuItem
  /** The function for drawer open status. */
  setDrawerOpen: (open: boolean) => void
}

/**
 * Menu element component.
 */
export const MenuElement = ({ drawerOpen, element, setDrawerOpen }: MenuElementProps) => {
  const [hover, setHover] = useState(false)

  const { pathname } = useLocation()
  const safePath = sanitizeAppPath(element.path, null)

  if (!safePath) {
    return null
  }

  const selected = pathname.includes(safePath)

  const handleClick = (e: MouseEvent<HTMLElement>) => {
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
        to={safePath}
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
