import React, { Children, useEffect, useMemo } from 'react'
import {
  Backdrop,
  Divider,
  Drawer as MuiDrawer,
  IconButton,
  Stack,
  styled,
  Tooltip,
  Typography,
} from '@mui/material'
import { ChevronLeft } from '@mui/icons-material'
import { useLocation } from 'react-router-dom'
import { useScreen } from '../hooks/useScreen.js'
import { DRAWER_WIDTH } from './drawerWidth.js'
import PropTypes from 'prop-types'
import { MenuElement } from './MenuElement.jsx'
import { useAdminKitMessages } from '../locale/useAdminKitMessages.js'

const openedMixin = (theme) => ({
  width: DRAWER_WIDTH,
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: 'hidden',
})

const closedMixin = (theme) => ({
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: 'hidden',
  width: 0,
})

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  padding: theme.spacing(4, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}))

const StyledDrawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    width: DRAWER_WIDTH,
    flexShrink: 0,
    whiteSpace: 'nowrap',
    boxSizing: 'border-box',
    ...(open && {
      ...openedMixin(theme),
      '& .MuiDrawer-paper': openedMixin(theme),
    }),
    ...(!open && {
      ...closedMixin(theme),
      '& .MuiDrawer-paper': closedMixin(theme),
    }),
  }),
)

/**
 * @typedef {object} IProps
 * @property {boolean} drawerOpen - The drawer open status.
 * @property {function} setDrawerOpen - The function for drawer open status.
 * @property {boolean} [isFetchingMenu] - The is fetching menu status.
 * @property {MenuElement[]} menu - The menu elements.
 */

/**
 * Drawer component.
 * @type {React.FC<IProps>}
 * @returns {React.ReactElement} The Drawer component.
 */
export const Drawer = ({ drawerOpen, setDrawerOpen, isFetchingMenu, menu }) => {
  const messages = useAdminKitMessages()
  const { pathname } = useLocation()
  const isMain = pathname === '/'

  const { isMaxWidth600 } = useScreen()

  useEffect(() => {
    if (!drawerOpen) {
      return undefined
    }

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        setDrawerOpen(false)
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [drawerOpen, setDrawerOpen])

  const drawerHeader = useMemo(() => (
    <DrawerHeader sx={{ py: drawerOpen ? 1.5 : 4 }}>
      {drawerOpen && (
        <Stack direction='row' spacing={2} alignItems='center' width='100%' justifyContent='space-between' pl={2}>
          <Typography fontWeight={700}>
            {messages.common.menu}
          </Typography>

          <Tooltip title={messages.shell.closeMenu}>
            <IconButton
              onClick={() => setDrawerOpen(false)}
              sx={{ '&:hover': {
                color: theme => theme.palette.primary.main
              } }}
            >
              <ChevronLeft />
            </IconButton>
          </Tooltip>
        </Stack>
      )}
    </DrawerHeader>
  ), [drawerOpen, messages.common.menu, messages.shell.closeMenu, setDrawerOpen])

  const navBar = useMemo(() => (
    <Stack height='100%' flex={1}>
      {Children.toArray(
        menu?.map(element => <MenuElement drawerOpen={drawerOpen} element={element} setDrawerOpen={setDrawerOpen} />)
      )}
    </Stack>
  ), [drawerOpen, menu, setDrawerOpen])

  return (
    <>
      <Backdrop
        open={drawerOpen}
        onClick={() => setDrawerOpen(false)}
        sx={{ zIndex: 9999 }}
      />

      <StyledDrawer
        variant='permanent'
        open={drawerOpen}
        PaperProps={{
          style: {
            backgroundColor: (isMain && !drawerOpen) ? 'rgba(0, 0, 0, 0.2)' : 'rgba(0, 0, 0, 0.9)',
          },
        }}
        sx={{
          display: isMaxWidth600 && !drawerOpen ? 'none' : 'block',
          zIndex: 10000
        }}
      >
        {drawerHeader}
        <Divider />
        {!isFetchingMenu && navBar}
      </StyledDrawer>
    </>
  )
}

Drawer.propTypes = {
  drawerOpen: PropTypes.bool.isRequired,
  setDrawerOpen: PropTypes.func.isRequired,
  isFetchingMenu: PropTypes.bool,
  menu: PropTypes.array.isRequired,
}
