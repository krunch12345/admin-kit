import { memo, useSyncExternalStore } from 'react'
import type { SubscriptionStore } from '../../utils/createSubscriptionStore'
import { UploadDialogContent, type UploadDialogContentProps } from './UploadDialogContent'
import { GeneralSettingsHeader } from './GeneralSettingsHeader'

export type UploadDialogStoreState = UploadDialogContentProps & {
  showHeader: boolean
}

export const UploadDialogContentHost = memo(({
  store,
}: {
  store: SubscriptionStore<UploadDialogStoreState>
}) => {
  const props = useSyncExternalStore(store.subscribe, store.getSnapshot, store.getSnapshot)
  const {
    showHeader: _showHeader,
    ...contentProps
  } = props

  return <UploadDialogContent {...contentProps} />
})

UploadDialogContentHost.displayName = 'UploadDialogContentHost'

export const GeneralSettingsHeaderHost = memo(({
  store,
}: {
  store: SubscriptionStore<UploadDialogStoreState>
}) => {
  const { showHeader, generalSettings } = useSyncExternalStore(
    store.subscribe,
    store.getSnapshot,
    store.getSnapshot,
  )

  if (!showHeader) {
    return null
  }

  return <GeneralSettingsHeader generalSettings={generalSettings} />
})

GeneralSettingsHeaderHost.displayName = 'GeneralSettingsHeaderHost'
