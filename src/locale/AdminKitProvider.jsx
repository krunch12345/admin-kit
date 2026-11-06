import { useMemo } from 'react'
import PropTypes from 'prop-types'
import { ModalDataProvider } from '../ui/Modal/ModalDataProvider.jsx'
import { AdminKitContext } from './AdminKitContext.js'
import { configureAdminKit } from './runtime.js'

/**
 * Root admin-kit provider: locale/messages runtime + ModalDataProvider.
 *
 * Optional — without it, the kit silently uses English defaults.
 * Pass `locale="ru"` and/or partial `messages` to override (deep-merged onto the locale).
 *
 * @param {object} props
 * @param {import('./types.js').AdminKitLocale} [props.locale='en']
 * @param {Partial<import('./types.js').AdminKitMessages>} [props.messages]
 * @param {boolean} [props.includeModalProvider=true] - Set false if you mount ModalDataProvider yourself.
 * @param {React.ReactNode} props.children
 */
export const AdminKitProvider = ({
  locale = 'en',
  messages,
  includeModalProvider = true,
  children,
}) => {
  const value = useMemo(() => {
    const resolvedLocale = locale === 'ru' ? 'ru' : 'en'
    const resolvedMessages = configureAdminKit({
      locale: resolvedLocale,
      messages,
    })

    return {
      locale: resolvedLocale,
      messages: resolvedMessages,
    }
  }, [locale, messages])

  const content = (
    <AdminKitContext.Provider value={value}>
      {children}
    </AdminKitContext.Provider>
  )

  if (!includeModalProvider) {
    return content
  }

  return (
    <ModalDataProvider>
      {content}
    </ModalDataProvider>
  )
}

AdminKitProvider.propTypes = {
  locale: PropTypes.oneOf(['en', 'ru']),
  messages: PropTypes.object,
  includeModalProvider: PropTypes.bool,
  children: PropTypes.node.isRequired,
}
