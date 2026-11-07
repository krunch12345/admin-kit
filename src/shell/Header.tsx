import { useCallback, useMemo, useState } from 'react'
import type { MouseEvent } from 'react'
import {
  AppBar as MuiAppBar,
  Box, Button,
  CircularProgress,
  IconButton,
  ListItemIcon,
  ListItemText,
  MenuItem,
  Stack,
  styled,
  Toolbar,
  Menu as UserMenu,
} from '@mui/material'
import {
  AccountCircle,
  DeleteForever,
  Logout,
  Menu,
  Settings,
} from '@mui/icons-material'
import { DRAWER_WIDTH } from './drawerWidth'
import { useLoading } from '../hooks/useLoading'
import { useScreen } from '../hooks/useScreen'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import type { ThunkDispatch, UnknownAction } from '@reduxjs/toolkit'
import { loginSelector } from '../auth/loginSlice'
import { handleLogout } from '../auth/handleLogout'
import { showAlert } from '../ui/Alert/showAlertSlice'
import { useAdminKitConfig, useAdminKitHooks } from '../config/useAdminKitRuntime'
import { useAdminKitMessages } from '../locale/useAdminKitMessages'

const StyledAppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})<{ open?: boolean }>(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: DRAWER_WIDTH,
    width: `calc(100% - ${DRAWER_WIDTH}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}))

export interface HeaderProps {
  /** The title shown next to the menu button. */
  appTitle: string
  /** Show the cache invalidation button. */
  showInvalidateCache?: boolean
  /** Overrides the default cache invalidation. */
  onInvalidateCache?: () => void | Promise<void>
  /** The drawer open status. */
  drawerOpen: boolean
  /** The is fetching menu status. */
  isFetchingMenu?: boolean
  /** The function for drawer open status. */
  setDrawerOpen: (open: boolean) => void
}

/**
 * Fixed top header bar (burger, title, cache, user menu).
 * Pair with `Drawer` for navigation; `Content` wires both together.
 */
export const Header = ({
  appTitle,
  drawerOpen,
  setDrawerOpen,
  isFetchingMenu,
  showInvalidateCache = true,
  onInvalidateCache,
}: HeaderProps) => {
  const messages = useAdminKitMessages()
  const { useInvalidateAllCacheMutation } = useAdminKitHooks()
  const { routes } = useAdminKitConfig()
  const [anchorElUser, setAnchorElUser] = useState<HTMLElement | null>(null)
  const [isInvalidatingCache, setIsInvalidatingCache] = useState(false)

  const { isMaxWidth600 } = useScreen()

  const { pathname } = useLocation()

  const isMain = pathname === routes.home

  const navigate = useNavigate()

  const { nickname } = useSelector(loginSelector)

  const dispatch = useDispatch<ThunkDispatch<unknown, unknown, UnknownAction>>()

  const [invalidateAllCache] = useInvalidateAllCacheMutation()

  useLoading(isInvalidatingCache)

  const handleInvalidateCache = useCallback(async () => {
    setIsInvalidatingCache(true)

    try {
      if (onInvalidateCache) {
        await onInvalidateCache()
      } else {
        await invalidateAllCache().unwrap()
      }

      dispatch(
        showAlert({
          isShowAlert: true,
          severity: 'success',
          message: messages.shell.cacheCleared,
        }),
      )
    } catch {
      dispatch(
        showAlert({
          isShowAlert: true,
          severity: 'error',
          message: messages.shell.cacheResetError,
        }),
      )
    } finally {
      setIsInvalidatingCache(false)
    }
  }, [dispatch, invalidateAllCache, messages.shell.cacheCleared, messages.shell.cacheResetError, onInvalidateCache])

  const handleOpenUserMenu = (e: MouseEvent<HTMLElement>) => {
    setAnchorElUser(e.currentTarget)
  }

  const handleCloseUserMenu = () => {
    setAnchorElUser(null)
  }

  const menuButton = useMemo(() => (
    isFetchingMenu ? (
      <Box
        minWidth={3}
        sx={{
          pt: 1,
          ml: -0.8,
          marginRight: 5.8,
          ...(drawerOpen && { display: 'flex', visibility: 'hidden', opacity: 0 }),
        }}
      >
        <CircularProgress size={30} color='primary' />
      </Box>
    ) : (
      <IconButton
        title={messages.shell.openMenu}
        color='inherit'
        aria-label={messages.shell.openMenu}
        onClick={() => setDrawerOpen(true)}
        edge='start'
        sx={{
          marginRight: 5,
          ...(drawerOpen && { display: 'flex', visibility: 'hidden', opacity: 0 }),
          '&:hover': {
            color: theme => theme.palette.primary.main
          }
        }}
      >
        <Menu />
      </IconButton>
    )
  ), [drawerOpen, isFetchingMenu, messages.shell.openMenu, setDrawerOpen])

  const userMenu = useMemo(() => (
    <Box>
      <Button
        startIcon={<AccountCircle />}
        sx={{
          color: theme => theme.palette.grey.A100,
          '&:hover': {
            color: theme => theme.palette.primary.main
          }
        }}
        onClick={handleOpenUserMenu}
      >
        {nickname}
      </Button>

      <UserMenu
        sx={{ mt: '45px' }}
        id='menu-appbar'
        anchorEl={anchorElUser}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        keepMounted
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        open={Boolean(anchorElUser)}
        onClose={handleCloseUserMenu}
      >
        <MenuItem
          onClick={() => {
            navigate(routes.account)
            handleCloseUserMenu()
          }}
        >
          <ListItemIcon>
            <Settings fontSize='small' />
          </ListItemIcon>
          <ListItemText>{messages.common.settings}</ListItemText>
        </MenuItem>

        <MenuItem
          onClick={async () => {
            handleCloseUserMenu()
            await dispatch(handleLogout())
            navigate(routes.login)
          }}
        >
          <ListItemIcon>
            <Logout fontSize='small' />
          </ListItemIcon>
          <ListItemText>{messages.common.signOut}</ListItemText>
        </MenuItem>
      </UserMenu>
    </Box>
  ), [
    anchorElUser,
    dispatch,
    messages.common.settings,
    messages.common.signOut,
    navigate,
    nickname,
    routes.account,
    routes.login,
  ])

  return (
    <StyledAppBar
      open={drawerOpen}
      sx={{ boxShadow: 'none', width: '100%', zIndex: theme => (drawerOpen ? theme.zIndex.drawer - 1 : undefined) }}
      className={!isMain ? 'headerBg' : ''}
      position='fixed'
    >
      <Box px={3}>
        <Toolbar disableGutters>
          <Stack
            direction='row'
            justifyContent='space-between'
            width='100%'
            alignItems='center'
            pt={isMaxWidth600 ? 1 : 0}
          >
            <Stack spacing={2} direction='row' alignItems='center'>
              {menuButton}

              <Button
                component={Link}
                to='/'
                sx={{
                  color: theme => theme.palette.grey.A100,
                  '&:hover': {
                    color: theme => theme.palette.primary.main
                  }
                }}
              >
                {appTitle}
              </Button>
            </Stack>

            <Stack direction='row' alignItems='center' spacing={2}>
              {showInvalidateCache && (
                <Button
                  variant='text'
                  color='error'
                  disabled={isInvalidatingCache}
                  onClick={handleInvalidateCache}
                  startIcon={<DeleteForever />}
                >
                  {messages.shell.clearCache}
                </Button>
              )}

              {userMenu}
            </Stack>
          </Stack>
        </Toolbar>
      </Box>
    </StyledAppBar>
  )
}
