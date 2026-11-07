import { Children, useEffect, useMemo } from 'react'
import type { Theme } from '@mui/material'
import type { CSSObject } from '@mui/material'
import {
  Backdrop,
  Divider,
  Drawer as MuiDrawer,
  IconButton,
  List,
  Stack,
  styled,
  Tooltip,
  Typography,
} from '@mui/material'
import { ChevronLeft } from '@mui/icons-material'
import { useLocation } from 'react-router-dom'
import { useScreen } from '../hooks/useScreen'
import { DRAWER_WIDTH } from './drawerWidth'
import { MenuElement } from './MenuElement'
import type { AdminKitMenuItem } from './MenuElement'
import { useAdminKitMessages } from '../locale/useAdminKitMessages'

const openedMixin = (theme: Theme): CSSObject => ({
  width: DRAWER_WIDTH,
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: 'hidden' as const,
})

const closedMixin = (theme: Theme): CSSObject => ({
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: 'hidden' as const,
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

const StyledDrawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })<{ open?: boolean }>(
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

export interface DrawerProps {
  /** The drawer open status. */
  drawerOpen: boolean
  /** The function for drawer open status. */
  setDrawerOpen: (open: boolean) => void
  /** The is fetching menu status. */
  isFetchingMenu?: boolean
  /** The menu elements. */
  menu?: AdminKitMenuItem[]
}

/**
 * Drawer component.
 */
export const Drawer = ({ drawerOpen, setDrawerOpen, isFetchingMenu, menu }: DrawerProps) => {
  const messages = useAdminKitMessages()
  const { pathname } = useLocation()
  const isMain = pathname === '/'

  const { isMaxWidth600 } = useScreen()

  useEffect(() => {
    if (!drawerOpen) {
      return undefined
    }

    const handleKeyDown = (event: KeyboardEvent) => {
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
    <List disablePadding sx={{ height: '100%', flex: 1 }}>
      {Children.toArray(
        menu?.map(element => <MenuElement drawerOpen={drawerOpen} element={element} setDrawerOpen={setDrawerOpen} />)
      )}
    </List>
  ), [drawerOpen, menu, setDrawerOpen])

  return (
    <>
      <Backdrop
        open={drawerOpen}
        onClick={() => setDrawerOpen(false)}
        sx={{ zIndex: (theme) => theme.zIndex.drawer }}
      />

      <StyledDrawer
        variant='permanent'
        open={drawerOpen}
        PaperProps={{
          sx: {
            // Closed-on-main stays translucent over hero; open menu must be opaque
            // so the page backdrop does not show through the panel.
            backgroundColor: (isMain && !drawerOpen) ? 'rgba(0, 0, 0, 0.2)' : 'background.paper',
            backgroundImage: 'none',
          },
        }}
        sx={{
          display: isMaxWidth600 && !drawerOpen ? 'none' : 'block',
          zIndex: (theme) => theme.zIndex.drawer + 1,
        }}
      >
        {drawerHeader}
        <Divider />
        {!isFetchingMenu && navBar}
      </StyledDrawer>
    </>
  )
}
