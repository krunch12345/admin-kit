import { useEffect, useMemo } from 'react'
import type { ReactNode } from 'react'
import type { Preview, Decorator } from '@storybook/react'
import { Box, CssBaseline, ThemeProvider, createTheme } from '@mui/material'
import { cyan } from '@mui/material/colors'
import { LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import { Provider } from 'react-redux'
import { MemoryRouter } from 'react-router-dom'
import { themes } from '@storybook/theming'
import { AdminKitProvider } from '../src/locale/AdminKitProvider'
import { Alert } from '../src/ui/Alert/Alert'
import { Loading } from '../src/ui/Loading/Loading'
import { Modal } from '../src/ui/Modal/Modal'
import { createStoryStore } from './createStoryStore'
import { createStorybookHooks } from './mockHooks'

/** Matches keepeternity-admin-panel dark theme primary (cyan / turquoise). */
const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: cyan.A200,
      light: cyan.A100,
      dark: cyan.A700,
    },
  },
})

interface StoryProvidersProps {
  locale: 'en' | 'ru'
  require2FA: boolean
  authenticated: boolean
  initialPath: string
  /** When false, skip the global Alert host (Alert stories mount their own). */
  mountAlert?: boolean
  /** When false, skip the global Loading host (Loading stories mount their own). */
  mountLoading?: boolean
  children: ReactNode
}

const StoryProviders = ({
  locale,
  require2FA,
  authenticated,
  initialPath,
  mountAlert = true,
  mountLoading = true,
  children,
}: StoryProvidersProps) => {
  const store = useMemo(
    () => createStoryStore(
      authenticated
        ? {
          login: {
            email: 'admin@example.com',
            nickname: 'Admin',
            avatar: '',
            is2FARequired: false,
            accessToken: 'storybook-token',
            rememberMe: true,
            id: 'user-1',
            isAuthChecked: true,
          },
        }
        : undefined,
      { restoreDemoUserAfterLogout: authenticated },
    ),
    [authenticated],
  )

  useEffect(() => {
    const bg = darkTheme.palette.background.default
    document.body.style.background = bg
    document.documentElement.style.background = bg
  }, [])

  return (
    <Provider store={store}>
      <ThemeProvider theme={darkTheme}>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <CssBaseline enableColorScheme />
          <MemoryRouter initialEntries={[initialPath]}>
            <AdminKitProvider
              locale={locale}
              hooks={createStorybookHooks({ require2FA })}
            >
              <Box
                sx={{
                  bgcolor: 'background.default',
                  color: 'text.primary',
                  minHeight: '100%',
                  p: 1,
                }}
              >
                {children}
              </Box>
              {mountAlert ? <Alert /> : null}
              {mountLoading ? <Loading /> : null}
              <Modal />
            </AdminKitProvider>
          </MemoryRouter>
        </LocalizationProvider>
      </ThemeProvider>
    </Provider>
  )
}

const withProviders: Decorator = (Story, context) => (
  <StoryProviders
    locale={context.parameters.locale === 'ru' ? 'ru' : 'en'}
    require2FA={Boolean(context.parameters.require2FA)}
    authenticated={Boolean(context.parameters.authenticated)}
    initialPath={context.parameters.initialPath || '/'}
    mountAlert={!context.parameters.disableGlobalAlert}
    mountLoading={!context.parameters.disableGlobalLoading}
  >
    <Story />
  </StoryProviders>
)

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    layout: 'padded',
    backgrounds: { disable: true },
    docs: {
      theme: themes.dark,
    },
    options: {
      storySort: {
        order: ['Introduction', 'Pages', 'Shell', 'UI'],
      },
    },
  },
  decorators: [withProviders],
}

export default preview
