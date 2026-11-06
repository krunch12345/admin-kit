import React, { useCallback, useMemo, useState } from 'react'
import {
  AppBar as MuiAppBar,
  Box, Button,
  CircularProgress,
  IconButton,
  MenuItem,
  Stack,
  styled,
  Toolbar,
  Typography,
  Menu as UserMenu,
} from '@mui/material'
import { DeleteForever, Menu } from '@mui/icons-material'
import { DRAWER_WIDTH } from './drawerWidth.js'
import { useLoading } from '../hooks/useLoading.js'
import { useScreen } from '../hooks/useScreen.js'
import PropTypes from 'prop-types'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { loginSelector } from '../auth/loginSlice.js'
import { handleLogout } from '../auth/handleLogout.js'
import { showAlert } from '../ui/Alert/showAlertSlice.js'
import { getShellHooks } from './runtimeHooks.js'

const StyledAppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
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

/**
 * @typedef {object} IProps
 * @property {string} appTitle - The title shown next to the menu button.
 * @property {boolean} [showInvalidateCache] - Show the cache invalidation button.
 * @property {function(): (void|Promise<void>)} [onInvalidateCache] - Overrides the default cache invalidation.
 * @property {boolean} drawerOpen - The drawer open status.
 * @property {boolean} [isFetchingMenu] - The is fetching menu status.
 * @property {function} setDrawerOpen - The function for drawer open status.
 */

/**
 * App bar component.
 * @type {React.FC<IProps>}
 * @returns {React.ReactElement} The App bar component.
 */
export const AppBar = ({
  appTitle,
  drawerOpen,
  setDrawerOpen,
  isFetchingMenu,
  showInvalidateCache = true,
  onInvalidateCache,
}) => {
  const { useInvalidateAllCacheMutation } = getShellHooks()
  const [anchorElUser, setAnchorElUser] = useState(null)
  const [isInvalidatingCache, setIsInvalidatingCache] = useState(false)

  const { isMaxWidth600 } = useScreen()

  const { pathname } = useLocation()

  const isMain = pathname === '/'

  const navigate = useNavigate()

  const { nickname } = useSelector(loginSelector)

  const dispatch = useDispatch()

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
          message: 'Кэш успешно очищен',
        }),
      )
    } catch {
      dispatch(
        showAlert({
          isShowAlert: true,
          severity: 'error',
          message: 'Ошибка при сбросе кэша',
        }),
      )
    } finally {
      setIsInvalidatingCache(false)
    }
  }, [dispatch, invalidateAllCache, onInvalidateCache])

  const handleOpenUserMenu = e => {
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
        title='Открыть меню'
        color='inherit'
        aria-label='Открыть меню'
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
  ), [drawerOpen, isFetchingMenu, setDrawerOpen])

  const userMenu = useMemo(() => (
    <Box>
      <Button
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
            navigate('/account')
            handleCloseUserMenu()
          }}
        >
          <Typography>
            Настройки
          </Typography>
        </MenuItem>

        <MenuItem
          onClick={() => {
            dispatch(handleLogout())
            navigate('/login')
            handleCloseUserMenu()
          }}
        >
          <Typography>
            Выход
          </Typography>
        </MenuItem>
      </UserMenu>
    </Box>
  ), [anchorElUser, dispatch, navigate, nickname])

  return (
    <StyledAppBar
      open={drawerOpen}
      sx={{ boxShadow: 'none', width: '100vw', zIndex: theme => drawerOpen && theme.zIndex.drawer - 1 }}
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
                  Очистить кэш
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

AppBar.propTypes = {
  appTitle: PropTypes.string.isRequired,
  showInvalidateCache: PropTypes.bool,
  onInvalidateCache: PropTypes.func,
  drawerOpen: PropTypes.bool.isRequired,
  setDrawerOpen: PropTypes.func.isRequired,
  isFetchingMenu: PropTypes.bool,
}
