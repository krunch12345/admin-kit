export interface LoginApiError {
  data?: {
    message?: string
    remainingAttempts?: number
  }
}

/**
 * Narrows an unknown RTK Query error to the shape the login forms render.
 */
export const toLoginApiError = (error: unknown): LoginApiError | null => (
  error !== null && typeof error === 'object' ? error as LoginApiError : null
)
