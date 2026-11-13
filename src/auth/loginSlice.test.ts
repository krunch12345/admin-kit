import { describe, expect, it } from 'vitest'
import {
  authChecked,
  loggedOut,
  loginSlice,
  tokenReceived,
} from './loginSlice'
import type { LoginAdminResponse, LoginState, Verify2FAResponse } from './loginSlice'

const fulfilled = <Payload>(endpointName: string, payload: Payload) => ({
  type: 'api/executeMutation/fulfilled',
  payload,
  meta: {
    requestId: 'test-request',
    requestStatus: 'fulfilled' as const,
    arg: { endpointName },
  },
})

const getState = (overrides?: Partial<LoginState>): LoginState => ({
  ...loginSlice.getInitialState(),
  ...overrides,
})

describe('loginSlice', () => {
  it('stores role from tokenReceived when present', () => {
    const state = loginSlice.reducer(
      getState(),
      tokenReceived({
        accessToken: 'token',
        role: 'admin',
        email: 'a@b.c',
      }),
    )

    expect(state.role).toBe('admin')
    expect(state.accessToken).toBe('token')
    expect(state.isAuthChecked).toBe(true)
  })

  it('stores role from loginAdmin when present', () => {
    const payload: LoginAdminResponse = {
      email: 'a@b.c',
      nickname: 'Admin',
      avatar: null,
      is2FARequired: false,
      id: '1',
      accessToken: 'token',
      role: 'admin',
    }

    const state = loginSlice.reducer(getState(), fulfilled('loginAdmin', payload))

    expect(state.role).toBe('admin')
    expect(state.accessToken).toBe('token')
  })

  it('stores role from verify2FA and marks 2FA active', () => {
    const payload: Verify2FAResponse = {
      accessToken: 'token',
      role: 'admin',
      email: 'a@b.c',
    }

    const state = loginSlice.reducer(getState(), fulfilled('verify2FA', payload))

    expect(state.role).toBe('admin')
    expect(state.is2FARequired).toBe(true)
    expect(state.accessToken).toBe('token')
  })

  it('clears is2FARequired when disable2FA fulfills', () => {
    const state = loginSlice.reducer(
      getState({ is2FARequired: true }),
      fulfilled('disable2FA', { message: 'ok' }),
    )

    expect(state.is2FARequired).toBe(false)
  })

  it('clears role on loggedOut', () => {
    const state = loginSlice.reducer(
      getState({ role: 'admin', accessToken: 'token' }),
      loggedOut(),
    )

    expect(state.role).toBeNull()
    expect(state.accessToken).toBeNull()
    expect(state.isAuthChecked).toBe(true)
  })

  it('marks auth checked without changing role', () => {
    const state = loginSlice.reducer(
      getState({ role: 'admin' }),
      authChecked(),
    )

    expect(state.isAuthChecked).toBe(true)
    expect(state.role).toBe('admin')
  })
})
