import type { EndpointBuilder } from '@reduxjs/toolkit/query/react'
import type { AdminBaseQueryFn } from '../auth/createAdminBaseQuery'

/**
 * Endpoints required by Header/AppBar: admin menu and cache invalidation.
 * Spread into createApi endpoints: `...createShellEndpoints(builder)`.
 */
export const createShellEndpoints = <TagTypes extends string, ReducerPath extends string>(
  builder: EndpointBuilder<AdminBaseQueryFn, TagTypes, ReducerPath>,
) => ({
  /**
   * Retrieves admin menu.
   */
    getAdminMenu: builder.query<unknown, void>({
      query: () => ({
        url: '/adminMenu',
        method: 'GET',
      }),
      extraOptions: {
        requiresAuth: true,
      },
    }),

    /**
   * Invalidates server-side cache. Used to force data refresh.
   */
    invalidateAllCache: builder.mutation<unknown, void>({
      query: () => ({
        url: '/cacheInvalidate',
        method: 'POST',
      }),
      extraOptions: {
        requiresAuth: true,
      },
    }),
  })
