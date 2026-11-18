import { describe, expect, it, vi } from 'vitest'
import { createSubscriptionStore } from './createSubscriptionStore'

describe('createSubscriptionStore', () => {
  it('returns initial snapshot', () => {
    const store = createSubscriptionStore({ count: 1 })

    expect(store.getSnapshot()).toEqual({ count: 1 })
  })

  it('notifies subscribers when state changes', () => {
    const store = createSubscriptionStore({ count: 1 })
    const listener = vi.fn()
    const unsubscribe = store.subscribe(listener)

    store.setState({ count: 2 })
    store.setState((prev) => ({ count: prev.count + 1 }))

    expect(store.getSnapshot()).toEqual({ count: 3 })
    expect(listener).toHaveBeenCalledTimes(2)

    unsubscribe()
    store.setState({ count: 4 })
    expect(listener).toHaveBeenCalledTimes(2)
  })

  it('does not notify when next state is identical', () => {
    const initial = { count: 1 }
    const store = createSubscriptionStore(initial)
    const listener = vi.fn()

    store.subscribe(listener)
    store.setState(initial)

    expect(listener).not.toHaveBeenCalled()
  })
})
