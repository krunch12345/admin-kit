import { useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import { Typography } from '@mui/material'
import { ConfirmYesNoActions } from '../ui/ConfirmYesNo/ConfirmYesNoActions'
import { ModalData } from '../ui/Modal/ModalData'
import { createFormDraftStorage } from '../utils/formDraftStorage'
import { useAdminKitMessages } from '../locale/useAdminKitMessages'

const PERSIST_DEBOUNCE_MS = 400

export interface UseFormDraftParams {
  /** Key prefix, e.g. `postDraft:` / `placeDraft:`. */
  storagePrefix: string
  /** Entity id or `add-new`. */
  entityId: string | null | undefined
  /** True when form baseline is applied (create or server hydrate). */
  isReady: boolean
  /** Current form snapshot to persist. */
  value: unknown
  /** Applies a revived draft into form state. */
  onRestore: (value: unknown) => void
  /** Transform before save. */
  serialize?: (value: unknown) => Record<string, unknown>
  /** Transform after load (receives full stored draft). */
  revive?: (stored: Record<string, unknown>) => unknown
  ttlMs?: number
  debounceMs?: number
}

export interface UseFormDraftResult {
  clearDraft: () => void
}

/**
 * Strips `savedAt` from a stored draft object.
 */
const defaultRevive = (stored: Record<string, unknown>): Record<string, unknown> => {
  const { savedAt: _savedAt, ...rest } = stored
  return rest
}

/**
 * Persists an edit-form snapshot in localStorage and offers restore on mount.
 */
export const useFormDraft = ({
  storagePrefix,
  entityId,
  isReady,
  value,
  onRestore,
  serialize,
  revive = defaultRevive,
  ttlMs,
  debounceMs = PERSIST_DEBOUNCE_MS,
}: UseFormDraftParams): UseFormDraftResult => {
  const messages = useAdminKitMessages()
  const { setModalData, closeModal } = useContext(ModalData)
  const [isPersistenceEnabled, setIsPersistenceEnabled] = useState(false)
  const hasPromptedRef = useRef(false)
  const baselineJsonRef = useRef<string | null>(null)
  const persistGenerationRef = useRef(0)
  const onRestoreRef = useRef(onRestore)
  const serializeRef = useRef(serialize)
  const reviveRef = useRef(revive)

  onRestoreRef.current = onRestore
  serializeRef.current = serialize
  reviveRef.current = revive

  const storage = useMemo(
    () => createFormDraftStorage({
      prefix: storagePrefix,
      ...(ttlMs !== undefined ? { ttlMs } : {}),
    }),
    [storagePrefix, ttlMs]
  )

  const toPayload = useCallback((snapshot: unknown): Record<string, unknown> => (
    serializeRef.current ? serializeRef.current(snapshot) : snapshot as Record<string, unknown>
  ), [])

  const enablePersistence = useCallback(() => {
    baselineJsonRef.current = null
    setIsPersistenceEnabled(true)
  }, [])

  const clearDraft = useCallback(() => {
    persistGenerationRef.current += 1
    storage.clear(entityId)
    setIsPersistenceEnabled(false)
    baselineJsonRef.current = null
  }, [entityId, storage])

  useEffect(() => {
    storage.clearExpired()
  }, [storage])

  useEffect(() => {
    hasPromptedRef.current = false
    baselineJsonRef.current = null
    persistGenerationRef.current += 1
    setIsPersistenceEnabled(false)
  }, [entityId])

  useEffect(() => {
    if (!isReady) {
      hasPromptedRef.current = false
      return
    }

    if (!entityId || hasPromptedRef.current) {
      return
    }

    hasPromptedRef.current = true

    const draft = storage.get(entityId)

    if (!draft) {
      enablePersistence()
      return
    }

    const applyDraft = () => {
      onRestoreRef.current(reviveRef.current(draft))
      enablePersistence()
      closeModal()
    }

    const discardDraft = () => {
      storage.clear(entityId)
      enablePersistence()
      closeModal()
    }

    setModalData({
      open: true,
      title: messages.formDraft.restoreTitle,
      isActions: true,
      maxWidth: 'md',
      children: (
        <Typography variant='body1'>
          {messages.formDraft.restoreMessage}
        </Typography>
      ),
      additionalButtons: (
        <ConfirmYesNoActions
          onNo={discardDraft}
          onYes={applyDraft}
        />
      ),
    })
  }, [
    closeModal,
    enablePersistence,
    entityId,
    isReady,
    messages.formDraft.restoreMessage,
    messages.formDraft.restoreTitle,
    setModalData,
    storage,
  ])

  useEffect(() => {
    if (!isPersistenceEnabled || !entityId) {
      return
    }

    const payload = toPayload(value)
    const snapshot = JSON.stringify(payload)

    if (baselineJsonRef.current === null) {
      baselineJsonRef.current = snapshot
      return
    }

    if (snapshot === baselineJsonRef.current) {
      return
    }

    const generation = persistGenerationRef.current

    const timeoutId = window.setTimeout(() => {
      if (generation !== persistGenerationRef.current) {
        return
      }

      storage.save(entityId, payload)
    }, debounceMs)

    return () => window.clearTimeout(timeoutId)
  }, [debounceMs, entityId, isPersistenceEnabled, storage, toPayload, value])

  return { clearDraft }
}
