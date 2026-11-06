/**
 * Endpoints required by Header/AppBar: admin menu and cache invalidation.
 * Spread into createApi endpoints: `...createShellEndpoints(builder)`.
 * @param {object} builder - RTK Query endpoint builder.
 */
export const createShellEndpoints = (builder) => ({
  /**
   * Retrieves admin menu.
   * @returns {Promise<Object>} - A Promise that resolves with the response data.
   */
  getAdminMenu: builder.query({
    query: () => ({
      url: '/adminMenu',
      params: undefined,
      method: 'GET',
      __meta: {
        requiresAuth: true,
      },
    }),
  }),

  /**
   * Invalidates server-side cache. Used to force data refresh.
   * @returns {Promise<Object>} - A Promise that resolves with the response data.
   */
  invalidateAllCache: builder.mutation({
    query: () => ({
      url: '/cacheInvalidate',
      method: 'POST',
      __meta: {
        requiresAuth: true,
      },
    }),
  }),
})
