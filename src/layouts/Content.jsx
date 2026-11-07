import { useContext, useLayoutEffect } from 'react'
import PropTypes from 'prop-types'
import { Outlet, useLocation } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { Box, Stack } from '@mui/material'
import { Header } from '../shell/Header.jsx'
import { Footer } from '../shell/Footer.jsx'
import { Modal } from '../ui/Modal/Modal.jsx'
import { ModalData } from '../ui/Modal/ModalData.js'
import { Alert } from '../ui/Alert/Alert.jsx'
import { Loading } from '../ui/Loading/Loading.jsx'
import { showAlertSelector } from '../ui/Alert/showAlertSlice.js'
import { showLoadingSelector } from '../ui/Loading/showLoadingSlice.js'
import { loginSelector } from '../auth/loginSlice.js'

const LOGIN_PATH = '/login'
const NOT_FOUND_PATHS = ['/error404', '/404']

/**
 * @typedef {object} IProps
 * @property {string} appTitle - Title shown in the app bar.
 * @property {boolean} [showInvalidateCache] - Show the cache invalidation button.
 * @property {function(): (void|Promise<void>)} [onInvalidateCache] - Overrides the default cache invalidation.
 * @property {Array<{ name: string, path: string }>} [menu] - Overrides the menu fetched via the shell hooks.
 * @property {boolean} [isFetchingMenu] - Menu loading status when `menu` is provided.
 * @property {{ developer?: string, copyrightStartYear: number, showDeveloper?: boolean, showKitVersion?: boolean }} [footerProps]
 *   Props for Footer; footer is hidden when omitted.
 */

/**
 * Main layout component. Renders the chrome (header, footer) for authenticated users
 * outside of the login and not-found pages, and always hosts Modal, Alert and Loading.
 * @type {React.FC<IProps>}
 * @returns {React.ReactElement} The wrapper for all routed pages.
 */
export const Content = ({
  appTitle,
  showInvalidateCache,
  onInvalidateCache,
  menu,
  isFetchingMenu,
  footerProps,
}) => {
  const { pathname } = useLocation()
  const { accessToken } = useSelector(loginSelector)
  const { states } = useContext(ModalData)
  const { modalData } = states

  const { isShowLoading } = useSelector(showLoadingSelector)
  const { isShowAlert } = useSelector(showAlertSelector)

  const isLogin = pathname === LOGIN_PATH
  const isNotFound = NOT_FOUND_PATHS.includes(pathname)
  const isMain = pathname === '/'
  const hasChrome = Boolean(accessToken) && !isLogin && !isNotFound

  useLayoutEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  return (
    <Stack width='100%' minHeight='100vh' sx={{ overflowX: 'hidden' }}>
      {hasChrome && (
        <Header
          appTitle={appTitle}
          showInvalidateCache={showInvalidateCache}
          onInvalidateCache={onInvalidateCache}
          menu={menu}
          isFetchingMenu={isFetchingMenu}
        />
      )}

      <Box
        m={hasChrome && !isMain ? 1 : 0}
        my={hasChrome && !isMain ? 5 : 0}
        display='flex'
        flex={1}
        height='100%'
        component='main'
        px={hasChrome ? 2.5 : 0}
        position='relative'
        pt={hasChrome ? 6 : 0}
      >
        <Outlet />
      </Box>

      {hasChrome && footerProps && <Footer {...footerProps} />}

      {modalData.open && <Modal />}
      {isShowAlert && <Alert />}
      {isShowLoading && <Loading />}
    </Stack>
  )
}

Content.propTypes = {
  appTitle: PropTypes.string.isRequired,
  showInvalidateCache: PropTypes.bool,
  onInvalidateCache: PropTypes.func,
  menu: PropTypes.array,
  isFetchingMenu: PropTypes.bool,
  footerProps: PropTypes.shape({
    developer: PropTypes.string,
    copyrightStartYear: PropTypes.number.isRequired,
    showDeveloper: PropTypes.bool,
    showKitVersion: PropTypes.bool,
  }),
}
