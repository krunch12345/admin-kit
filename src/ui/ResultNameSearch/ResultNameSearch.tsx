import type { ReactNode } from 'react'
import { Accordion } from '../Accordion/Accordion'
import { Typography } from '@mui/material'
import { useAdminKitMessages } from '../../locale/useAdminKitMessages'

export interface ResultNameSearchProps {
  /** The Accordion details. */
  children: ReactNode
  /** Count of objects. */
  count?: number
  /** Status of error. */
  isErrorBackground?: boolean
  /** Title of Accordion. */
  summaryTitle?: string
}

/**
 * Result Name Search component.
 */
export const ResultNameSearch = ({
  children,
  count,
  isErrorBackground,
  summaryTitle,
}: ResultNameSearchProps) => {
  const messages = useAdminKitMessages()

  return (
    <Accordion
      summaryTitle={summaryTitle ?? messages.resultNameSearch.summaryTitle}
      count={count}
      isErrorBackground={isErrorBackground}
    >
      {(count ?? 0) > 0 ? children : <Typography>{messages.resultNameSearch.noMatches}</Typography>}
    </Accordion>
  )
}
