import { useState } from 'react'
import { AppBar } from './AppBar'
import { Drawer } from './Drawer'
import type { AdminKitMenuItem } from './MenuElement'
import { useAdminKitHooks } from '../config/useAdminKitRuntime'

export interface HeaderProps {
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
}

/**
 * Header component: app bar and navigation drawer.
 * Requires AdminKitProvider `api` (or `hooks`) unless `menu` and `onInvalidateCache` are provided.
 */
export const Header = ({
  appTitle,
  showInvalidateCache = true,
  onInvalidateCache,
  menu: menuOverride,
  isFetchingMenu: isFetchingMenuOverride,
}: HeaderProps) => {
  const { useGetAdminMenuQuery } = useAdminKitHooks()
  const [drawerOpen, setDrawerOpen] = useState(false)

  const hasMenuOverride = menuOverride !== undefined

  const {
    data: fetchedMenu,
    isFetching: isFetchingFetchedMenu,
  } = useGetAdminMenuQuery(undefined, { skip: hasMenuOverride })

  const menu = hasMenuOverride ? menuOverride : ((fetchedMenu as AdminKitMenuItem[] | undefined) ?? [])
  const isFetchingMenu = hasMenuOverride ? Boolean(isFetchingMenuOverride) : isFetchingFetchedMenu

  return (
    <>
      <AppBar
        appTitle={appTitle}
        drawerOpen={drawerOpen}
        setDrawerOpen={setDrawerOpen}
        isFetchingMenu={isFetchingMenu}
        showInvalidateCache={showInvalidateCache}
        onInvalidateCache={onInvalidateCache}
      />

      <Drawer
        drawerOpen={drawerOpen}
        setDrawerOpen={setDrawerOpen}
        isFetchingMenu={isFetchingMenu}
        menu={menu}
      />
    </>
  )
}
