export const createAuthEndpoints = (builder) => ({
  /**
   * Method for login.
   * @param {Object} [params] - The query parameters.
   * @param {string} [params.query.email] - The email of user.
   * @param {string} [params.query.password] - The password of user.
   * @returns {Promise<Object>} - A Promise that resolves with the response data.
   */
  loginAdmin: builder.mutation({
    query: (params) => ({
      url: '/auth/loginAdmin',
      method: 'POST',
      body: params,
      __meta: {
        requiresAuth: false,
      },
    }),
  }),

  /**
   * Method for activate 2FA.
   * @returns {Promise<Object>} - A Promise that resolves with the response data.
   */
  enable2FA: builder.mutation({
    query: () => ({
      url: '/auth/enable2FA',
      method: 'POST',
      __meta: {
        requiresAuth: true,
      },
    }),
  }),

  /**
   * Method for verifying 2FA code and receiving access token.
   * @param {Object} params
   * @param {string} params.email - Email of the user
   * @param {string} params.token - 2FA code from the authenticator app
   * @returns {Promise<Object>} - A Promise that resolves with { accessToken }
   */
  verify2FA: builder.mutation({
    query: ({ email, token }) => ({
      url: '/auth/verify2FACode',
      method: 'POST',
      body: { email, token },
      __meta: {
        requiresAuth: false,
      },
    }),
  }),

  /**
   * Method for restoring current authenticated admin session.
   * Uses httpOnly refresh token and returns fresh access token and profile.
   * Auth failures are handled silently without global alerts.
   * @returns {Promise<Object>} - A Promise that resolves with { accessToken, email, nickname, avatar, id, is2FARequired }
   */
  getCurrentUser: builder.query({
    query: () => ({
      url: '/auth/me',
      method: 'GET',
      __meta: {
        requiresAuth: true,
        silentAuthFailure: true,
        suppressGlobalError: true,
      },
    }),
  }),
})
