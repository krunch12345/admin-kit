import { describe, expect, it } from 'vitest'
import { configureStore } from '@reduxjs/toolkit'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { Provider } from 'react-redux'
import { render, screen } from '@testing-library/react'
import { loginSlice } from './loginSlice'
import type { LoginState } from './loginSlice'
import { RequireAdmin } from './RequireAdmin'
import { AdminKitProvider } from '../locale/AdminKitProvider'
import { createStorybookHooks } from '../../.storybook/mockHooks'

const renderRequireAdmin = (loginOverrides: Partial<LoginState>) => {
  const store = configureStore({
    reducer: {
      [loginSlice.name]: loginSlice.reducer,
    },
    preloadedState: {
      login: {
        ...loginSlice.getInitialState(),
        isAuthChecked: true,
        accessToken: 'token',
        ...loginOverrides,
      },
    },
  })

  return render(
    <Provider store={store}>
      <AdminKitProvider hooks={createStorybookHooks()}>
        <MemoryRouter initialEntries={['/secret']}>
          <Routes>
            <Route
              path='/secret'
              element={(
                <RequireAdmin>
                  <div>admin only</div>
                </RequireAdmin>
              )}
            />
            <Route path='/' element={<div>home</div>} />
          </Routes>
        </MemoryRouter>
      </AdminKitProvider>
    </Provider>,
  )
}

describe('RequireAdmin', () => {
  it('renders children when role is admin', () => {
    renderRequireAdmin({ role: 'admin' })

    expect(screen.getByText('admin only')).toBeInTheDocument()
  })

  it('redirects to home when role is not admin', () => {
    renderRequireAdmin({ role: 'user' })

    expect(screen.getByText('home')).toBeInTheDocument()
    expect(screen.queryByText('admin only')).not.toBeInTheDocument()
  })

  it('redirects to home when role is null', () => {
    renderRequireAdmin({ role: null })

    expect(screen.getByText('home')).toBeInTheDocument()
  })
})
