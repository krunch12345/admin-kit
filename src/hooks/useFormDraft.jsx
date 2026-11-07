import { useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import { Typography } from '@mui/material'
import { ConfirmYesNoActions } from '../ui/ConfirmYesNo/ConfirmYesNoActions.jsx'
import { ModalData } from '../ui/Modal/ModalData.js'
import { createFormDraftStorage } from '../utils/formDraftStorage.js'
import { useAdminKitMessages } from '../locale/useAdminKitMessages.js'

const PERSIST_DEBOUNCE_MS = 400

/**
 * Strips `savedAt` from a stored draft object.
 * @param {object} stored
 * @returns {object}
 */
const defaultRevive = (stored) => {
  if (!stored || typeof stored !== 'object') {
    return stored
  }

  const { savedAt: _savedAt, ...rest } = stored
  return rest
}

/**
 * Persists an edit-form snapshot in localStorage and offers restore on mount.
 * @param {object} params
 * @param {string} params.storagePrefix - Key prefix, e.g. `postDraft:` / `placeDraft:`.
 * @param {string} params.entityId - Entity id or `add-new`.
 * @param {boolean} params.isReady - True when form baseline is applied (create or server hydrate).
 * @param {unknown} params.value - Current form snapshot to persist.
 * @param {(value: unknown) => void} params.onRestore - Applies a revived draft into form state.
 * @param {(value: unknown) => Record<string, unknown>} [params.serialize] - Transform before save.
 * @param {(stored: object) => unknown} [params.revive] - Transform after load (receives full stored draft).
 * @param {number} [params.ttlMs]
 * @param {number} [params.debounceMs]
 * @returns {{ clearDraft: () => void }}
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
}) => {
  const messages = useAdminKitMessages()
  const { setModalData, closeModal } = useContext(ModalData)
  const [isPersistenceEnabled, setIsPersistenceEnabled] = useState(false)
  const hasPromptedRef = useRef(false)
  const baselineJsonRef = useRef(null)
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

  const toPayload = useCallback((snapshot) => (
    serializeRef.current ? serializeRef.current(snapshot) : snapshot
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
