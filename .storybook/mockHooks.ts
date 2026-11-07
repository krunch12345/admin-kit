import type { AdminKitApiHooks, AdminKitCurrentUser } from '../src/config/AdminKitRuntimeContext'
import type { LoginAdminResponse, Verify2FAResponse } from '../src/auth/loginSlice'
import type { AdminKitMenuItem } from '../src/shell/MenuElement'

const DEMO_MENU: AdminKitMenuItem[] = [
  { name: 'Item 1', path: '/item-1' },
  { name: 'Item 2', path: '/item-2' },
  { name: 'Item 3', path: '/item-3' },
]

const DEMO_USER: AdminKitCurrentUser = {
  accessToken: 'storybook-token',
  email: 'admin@example.com',
  nickname: 'Admin',
  avatar: null,
  is2FARequired: false,
  id: 'user-1',
}

const idleMutationResult = {
  isLoading: false,
  isError: false,
  isSuccess: false,
  isUninitialized: true,
  error: undefined,
  data: undefined,
  reset: () => undefined,
}

const createMockMutation = <Result, Arg>(
  impl?: (arg: Arg) => Promise<{ data: Result }>,
) => {
  const trigger = async (arg: Arg) => {
    if (impl) {
      return impl(arg)
    }

    return { data: undefined as Result }
  }

  return (() => [trigger, idleMutationResult]) as AdminKitApiHooks['useLoginAdminMutation']
}

const createMockQuery = <Result>(data: Result) => (
  () => ({
    data,
    currentData: data,
    isLoading: false,
    isFetching: false,
    isError: false,
    isSuccess: true,
    isUninitialized: false,
    error: undefined,
    refetch: () => ({ unwrap: async () => data }),
  })
) as AdminKitApiHooks['useGetCurrentUserQuery']

/**
 * RTK Query-shaped hooks for Storybook without a real backend.
 */
export const createStorybookHooks = (options?: {
  require2FA?: boolean
  menu?: AdminKitMenuItem[]
}): AdminKitApiHooks => {
  const require2FA = options?.require2FA ?? false
  const menu = options?.menu ?? DEMO_MENU

  return {
    useLoginAdminMutation: createMockMutation<LoginAdminResponse, { email: string; password: string }>(
      async ({ email }) => ({
        data: {
          email,
          nickname: 'Admin',
          avatar: null,
          is2FARequired: require2FA,
          id: 'user-1',
          accessToken: require2FA ? null : 'storybook-token',
        },
      }),
    ),
    useVerify2FAMutation: createMockMutation<Verify2FAResponse, { email: string; token: string }>(
      async () => ({
        data: {
          email: 'admin@example.com',
          nickname: 'Admin',
          avatar: null,
          id: 'user-1',
          accessToken: 'storybook-token',
        },
      }),
    ),
    useEnable2FAMutation: createMockMutation(async () => ({ data: { otpauthUrl: 'otpauth://totp/admin-kit' } })),
    useGetCurrentUserQuery: createMockQuery(DEMO_USER),
    useGetAdminMenuQuery: createMockQuery(menu) as AdminKitApiHooks['useGetAdminMenuQuery'],
    useInvalidateAllCacheMutation: createMockMutation(async () => ({ data: { ok: true } })),
    requestLogout: async () => undefined,
    resetApiState: () => undefined,
  }
}
