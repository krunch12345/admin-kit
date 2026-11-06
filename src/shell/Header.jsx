import { useState } from 'react'
import PropTypes from 'prop-types'
import { AppBar } from './AppBar.jsx'
import { Drawer } from './Drawer.jsx'
import { getShellHooks } from './runtimeHooks.js'

/**
 * @typedef {object} IProps
 * @property {string} appTitle - Title shown in the app bar.
 * @property {boolean} [showInvalidateCache] - Show the cache invalidation button.
 * @property {function(): (void|Promise<void>)} [onInvalidateCache] - Overrides the default cache invalidation.
 * @property {Array<{ name: string, path: string }>} [menu] - Overrides the menu fetched via the shell hooks.
 * @property {boolean} [isFetchingMenu] - Menu loading status when `menu` is provided.
 */

/**
 * Header component: app bar and navigation drawer.
 * Requires `initAdminKitShell` unless `menu` and `onInvalidateCache` are provided by the parent.
 * @type {React.FC<IProps>}
 * @returns {React.ReactElement} The Header component.
 */
export const Header = ({
  appTitle,
  showInvalidateCache = true,
  onInvalidateCache,
  menu: menuOverride,
  isFetchingMenu: isFetchingMenuOverride,
}) => {
  const { useGetAdminMenuQuery } = getShellHooks()
  const [drawerOpen, setDrawerOpen] = useState(false)

  const hasMenuOverride = menuOverride !== undefined

  const {
    data: fetchedMenu = [],
    isFetching: isFetchingFetchedMenu,
  } = useGetAdminMenuQuery({}, { skip: hasMenuOverride })

  const menu = hasMenuOverride ? menuOverride : fetchedMenu
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

Header.propTypes = {
  appTitle: PropTypes.string.isRequired,
  showInvalidateCache: PropTypes.bool,
  onInvalidateCache: PropTypes.func,
  menu: PropTypes.array,
  isFetchingMenu: PropTypes.bool,
}
