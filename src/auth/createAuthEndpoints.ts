import type { EndpointBuilder } from '@reduxjs/toolkit/query/react'
import type { AdminBaseQueryFn } from './createAdminBaseQuery'
import type { AdminKitCurrentUser, LoginAdminParams, Verify2FAParams } from '../config/AdminKitRuntimeContext'
import type { LoginAdminResponse, Verify2FAResponse } from './loginSlice'

export const createAuthEndpoints = <TagTypes extends string, ReducerPath extends string>(
  builder: EndpointBuilder<AdminBaseQueryFn, TagTypes, ReducerPath>,
) => ({
  /** Method for login. */
    loginAdmin: builder.mutation<LoginAdminResponse, LoginAdminParams>({
      query: (params) => ({
        url: '/auth/loginAdmin',
        method: 'POST',
        body: params,
      }),
      extraOptions: {
        requiresAuth: false,
        suppressGlobalError: true,
      },
    }),

    /** Method for activate 2FA. */
    enable2FA: builder.mutation<unknown, void>({
      query: () => ({
        url: '/auth/enable2FA',
        method: 'POST',
      }),
      extraOptions: {
        requiresAuth: true,
      },
    }),

    /** Method for verifying 2FA code and receiving access token. */
    verify2FA: builder.mutation<Verify2FAResponse, Verify2FAParams>({
      query: ({ email, token, rememberMe }) => ({
        url: '/auth/verify2FACode',
        method: 'POST',
        body: { email, token, rememberMe },
      }),
      extraOptions: {
        requiresAuth: false,
        suppressGlobalError: true,
      },
    }),

    /** Restores current authenticated admin session. */
    getCurrentUser: builder.query<AdminKitCurrentUser, void>({
      query: () => ({
        url: '/auth/me',
        method: 'GET',
      }),
      extraOptions: {
        requiresAuth: true,
        silentAuthFailure: true,
        suppressGlobalError: true,
      },
      keepUnusedDataFor: 0,
    }),

    /** Revokes the server-side refresh session (httpOnly cookie). */
    logoutAdmin: builder.mutation<unknown, void>({
      query: () => ({
        url: '/auth/logout',
        method: 'POST',
      }),
      extraOptions: {
        requiresAuth: false,
        silentAuthFailure: true,
        suppressGlobalError: true,
      },
    }),
  })
