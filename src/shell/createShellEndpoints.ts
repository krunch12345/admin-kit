import type { EndpointBuilder } from '@reduxjs/toolkit/query/react'
import type { AdminBaseQueryFn } from '../auth/createAdminBaseQuery'
import type { AdminKitMenuItem } from './MenuElement'

/**
 * Endpoints required by Header / Content shell: admin menu and cache invalidation.
 * Spread into createApi endpoints: `...createShellEndpoints(builder)`.
 */
export const createShellEndpoints = <TagTypes extends string, ReducerPath extends string>(
  builder: EndpointBuilder<AdminBaseQueryFn, TagTypes, ReducerPath>,
) => ({
  /**
   * Retrieves admin menu items shaped as `{ name, path }`.
   */
    getAdminMenu: builder.query<AdminKitMenuItem[], void>({
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
   * Response body is unused by shell UI; success is inferred from a non-error status.
   */
    invalidateAllCache: builder.mutation<void, void>({
      query: () => ({
        url: '/cacheInvalidate',
        method: 'POST',
      }),
      extraOptions: {
        requiresAuth: true,
      },
    }),
  })
