export type SubscriptionStore<T> = {
  getSnapshot: () => T
  setState: (next: T | ((prev: T) => T)) => void
  subscribe: (listener: () => void) => () => void
}

/**
 * Tiny external store for syncing modal body props without pushing React
 * element trees through ModalData on every keystroke.
 */
export const createSubscriptionStore = <T>(initialState: T): SubscriptionStore<T> => {
  let state = initialState
  const listeners = new Set<() => void>()

  return {
    getSnapshot: () => state,
    setState: (next) => {
      const resolved = typeof next === 'function'
        ? (next as (prev: T) => T)(state)
        : next

      if (Object.is(resolved, state)) {
        return
      }

      state = resolved
      listeners.forEach((listener) => listener())
    },
    subscribe: (listener) => {
      listeners.add(listener)
      return () => {
        listeners.delete(listener)
      }
    },
  }
}
