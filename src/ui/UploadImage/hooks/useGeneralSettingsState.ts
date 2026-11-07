import { useCallback, useMemo, useState } from 'react'
import type { GeneralSettingsState } from '../types'

/**
 * Open/dirty/session state of the general settings panel.
 * `session` changes on every open/close so the panel remounts with a fresh state.
 */
export const useGeneralSettingsState = (): GeneralSettingsState => {
  const [isOpen, setIsOpen] = useState(false)
  const [isDirty, setIsDirty] = useState(false)
  const [session, setSession] = useState(0)

  const open = useCallback(() => {
    setIsDirty(false)
    setSession((value) => value + 1)
    setIsOpen(true)
  }, [])

  const close = useCallback(() => {
    setIsOpen(false)
    setIsDirty(false)
    setSession((value) => value + 1)
  }, [])

  return useMemo(
    () => ({ isOpen, isDirty, session, open, close, setIsDirty }),
    [close, isDirty, isOpen, open, session],
  )
}
