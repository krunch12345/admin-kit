import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { configureStore } from '@reduxjs/toolkit'
import type { BaseQueryApi } from '@reduxjs/toolkit/query'
import { createAdminBaseQuery } from './createAdminBaseQuery'
import { loginSlice } from './loginSlice'
import { showAlertSlice } from '../ui/Alert/showAlertSlice'

const jsonResponse = (status: number, body: unknown): Response => (
  new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  })
)

const getFetchUrl = (input: RequestInfo | URL): string => {
  if (typeof input === 'string') return input
  if (input instanceof URL) return input.href
  return input.url
}

const getFetchHeader = (
  input: RequestInfo | URL,
  init: RequestInit | undefined,
  name: string,
): string | null => {
  if (input instanceof Request) return input.headers.get(name)

  const { headers } = init ?? {}
  if (headers instanceof Headers) return headers.get(name)
  if (Array.isArray(headers)) {
    const found = headers.find(([key]) => key.toLowerCase() === name.toLowerCase())
    return found?.[1] ?? null
  }
  if (headers && typeof headers === 'object') {
    const record = headers as Record<string, string>
    return record[name] ?? record[name.toLowerCase()] ?? null
  }
  return null
}

const createTestStore = () => configureStore({
  reducer: {
    [loginSlice.name]: loginSlice.reducer,
    [showAlertSlice.name]: showAlertSlice.reducer,
  },
  preloadedState: {
    login: {
      ...loginSlice.getInitialState(),
      accessToken: 'access-token',
      isAuthChecked: true,
    },
  },
})

const createBaseQueryApi = (store: ReturnType<typeof createTestStore>): BaseQueryApi => ({
  signal: new AbortController().signal,
  abort: () => undefined,
  dispatch: store.dispatch,
  getState: store.getState,
  extra: undefined,
  endpoint: 'testEndpoint',
  type: 'mutation',
})

describe('createAdminBaseQuery CSRF recovery', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn())
  })

  afterEach(() => {
    vi.unstubAllGlobals()
    vi.restoreAllMocks()
  })

  it('retries CSRF fetch when 403 message mentions CSRF without a code', async () => {
    const fetchMock = vi.mocked(fetch)
    fetchMock
      .mockResolvedValueOnce(jsonResponse(403, { message: 'Invalid CSRF token' }))
      .mockResolvedValueOnce(jsonResponse(200, { csrfToken: 'fresh-csrf' }))
      .mockResolvedValueOnce(jsonResponse(200, { ok: true }))

    const store = createTestStore()
    const baseQuery = createAdminBaseQuery({ baseUrl: 'http://localhost/api' })
    const result = await baseQuery(
      { url: '/mutate', method: 'POST', body: { value: 1 } },
      createBaseQueryApi(store),
      {},
    )

    expect(result.data).toEqual({ ok: true })
    expect(fetchMock).toHaveBeenCalledTimes(3)

    const urls = fetchMock.mock.calls.map(([input]) => getFetchUrl(input))
    expect(urls[0]).toContain('/api/mutate')
    expect(urls[1]).toContain('/api/csrfToken')
    expect(urls[2]).toContain('/api/mutate')

    const retryCall = fetchMock.mock.calls[2]
    expect(getFetchHeader(retryCall?.[0] as RequestInfo | URL, retryCall?.[1], 'csrf-token')).toBe('fresh-csrf')
  })

  it('does not CSRF-retry when 403 has a null code and a non-CSRF message', async () => {
    const fetchMock = vi.mocked(fetch)
    fetchMock.mockResolvedValueOnce(jsonResponse(403, { message: 'Forbidden', code: null }))

    const store = createTestStore()
    const baseQuery = createAdminBaseQuery({ baseUrl: 'http://localhost/api' })
    const result = await baseQuery(
      { url: '/mutate', method: 'POST', body: { value: 1 } },
      createBaseQueryApi(store),
      {},
    )

    expect(result.error?.status).toBe(403)
    expect(fetchMock).toHaveBeenCalledTimes(1)
    expect(getFetchUrl(fetchMock.mock.calls[0]?.[0] as RequestInfo | URL)).toContain('/api/mutate')
  })

  it('does not CSRF-retry when 403 omits code and the message is not CSRF-related', async () => {
    const fetchMock = vi.mocked(fetch)
    fetchMock.mockResolvedValueOnce(jsonResponse(403, { message: 'Insufficient permissions' }))

    const store = createTestStore()
    const baseQuery = createAdminBaseQuery({ baseUrl: 'http://localhost/api' })
    const result = await baseQuery(
      { url: '/mutate', method: 'POST', body: { value: 1 } },
      createBaseQueryApi(store),
      {},
    )

    expect(result.error?.status).toBe(403)
    expect(fetchMock).toHaveBeenCalledTimes(1)
  })
})
