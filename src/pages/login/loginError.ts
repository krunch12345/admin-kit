export interface LoginApiError {
  status?: number | string
  data?: {
    message?: string
    code?: string
    remainingAttempts?: number | null
    /** Seconds until the client may retry (from 429 body or Retry-After). */
    retryAfter?: number
  }
}

/**
 * Narrows an unknown RTK Query error to the shape the login forms render.
 */
export const toLoginApiError = (error: unknown): LoginApiError | null => (
  error !== null && typeof error === 'object' ? error as LoginApiError : null
)
