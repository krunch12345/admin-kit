import { useLayoutEffect, useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { Box, Stack } from '@mui/material'
import { Header } from '../shell/Header'
import { Drawer } from '../shell/Drawer'
import { Footer } from '../shell/Footer'
import type { FooterProps } from '../shell/Footer'
import type { AdminKitMenuItem } from '../shell/MenuElement'
import { Modal } from '../ui/Modal/Modal'
import { Alert } from '../ui/Alert/Alert'
import { Loading } from '../ui/Loading/Loading'
import { showLoadingSelector } from '../ui/Loading/showLoadingSlice'
import { loginSelector } from '../auth/loginSlice'
import { useAdminKitConfig, useAdminKitHooks } from '../config/useAdminKitRuntime'

export interface ContentProps {
  /** Title shown in the app bar. */
  appTitle: string
  /** Show the cache invalidation button. */
  showInvalidateCache?: boolean
  /** Overrides the default cache invalidation. */
  onInvalidateCache?: () => void | Promise<void>
  /** Overrides the menu fetched via the shell hooks. */
  menu?: AdminKitMenuItem[]
  /** Menu loading status when `menu` is provided. */
  isFetchingMenu?: boolean
  /** Props for Footer; footer is hidden when omitted. */
  footerProps?: FooterProps
}

/**
 * Main layout component. Renders the chrome (header, drawer, footer) for authenticated users
 * outside of the login and not-found pages, and always hosts Modal, Alert and Loading.
 */
export const Content = ({
  appTitle,
  showInvalidateCache,
  onInvalidateCache,
  menu: menuOverride,
  isFetchingMenu: isFetchingMenuOverride,
  footerProps,
}: ContentProps) => {
  const { pathname } = useLocation()
  const { accessToken } = useSelector(loginSelector)
  const { routes } = useAdminKitConfig()
  const { useGetAdminMenuQuery } = useAdminKitHooks()
  const [drawerOpen, setDrawerOpen] = useState(false)

  const { isShowLoading } = useSelector(showLoadingSelector)

  const notFoundPaths = [routes.error404, routes.notFound]
  const isLogin = pathname === routes.login
  const isNotFound = notFoundPaths.includes(pathname)
  const isMain = pathname === routes.home
  const hasChrome = Boolean(accessToken) && !isLogin && !isNotFound

  const hasMenuOverride = menuOverride !== undefined
  const {
    data: fetchedMenu,
    isFetching: isFetchingFetchedMenu,
  } = useGetAdminMenuQuery(undefined, { skip: !hasChrome || hasMenuOverride })

  const menu = hasMenuOverride ? menuOverride : ((fetchedMenu as AdminKitMenuItem[] | undefined) ?? [])
  const isFetchingMenu = hasMenuOverride ? Boolean(isFetchingMenuOverride) : isFetchingFetchedMenu

  useLayoutEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  return (
    <Stack width='100%' minHeight='100vh' sx={{ overflowX: 'hidden' }}>
      {hasChrome && (
        <>
          <Header
            appTitle={appTitle}
            showInvalidateCache={showInvalidateCache}
            onInvalidateCache={onInvalidateCache}
            drawerOpen={drawerOpen}
            setDrawerOpen={setDrawerOpen}
            isFetchingMenu={isFetchingMenu}
          />
          <Drawer
            drawerOpen={drawerOpen}
            setDrawerOpen={setDrawerOpen}
            isFetchingMenu={isFetchingMenu}
            menu={menu}
          />
        </>
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

      <Modal />
      <Alert />
      {isShowLoading && <Loading />}
    </Stack>
  )
}
