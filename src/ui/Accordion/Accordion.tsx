import { useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import {
  Accordion as MuiAccordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Stack,
  Typography
} from '@mui/material'
import { ExpandMore } from '@mui/icons-material'
import { formatMessage } from '../../locale/formatMessage'
import { useAdminKitMessages } from '../../locale/useAdminKitMessages'

export interface AccordionProps {
  /** The Summary title. */
  summaryTitle: string
  /** The Accordion details. */
  children: ReactNode
  /** Default expanded. */
  defaultNotExpanded?: boolean
  /** Count of objects. */
  count?: number
  /** Status of error. */
  isErrorBackground?: boolean
}

/**
 * Custom Accordion component.
 */
export const Accordion = ({
  summaryTitle,
  children,
  defaultNotExpanded,
  count,
  isErrorBackground,
}: AccordionProps) => {
  const messages = useAdminKitMessages()
  const [expanded, setExpanded] = useState(true)

  useEffect(() => {
    defaultNotExpanded && setExpanded(false)
  }, [defaultNotExpanded])

  return (
    <MuiAccordion
      expanded={expanded}
      onChange={() => setExpanded(!expanded)}
      sx={{
        boxShadow: 'none',
        p: '0 !important',
        backgroundColor: isErrorBackground ? 'rgba(183, 28, 28, 0.3)' : 'none',
        '::before': {
          backgroundColor: 'inherit',
        },
        width: '100%',
      }}
    >
      <AccordionSummary expandIcon={<ExpandMore />} sx={{ height: '4rem' }}>
        <Stack direction='row' spacing={1} alignItems='center'>
          <Typography variant='h5' fontWeight={500}>
            {summaryTitle}
          </Typography>

          {count !== undefined && count >= 0 && (
            <Typography variant='overline' color={theme => theme.palette.grey[500]}>
              {formatMessage(messages.accordion.total, { count })}
            </Typography>
          )}
        </Stack>
      </AccordionSummary>

      <AccordionDetails>
        <Box
          sx={{
            position: 'relative',
            zIndex: 2,
            // visible: sticky children (e.g. emoji picker) need a non-clipping ancestor
            overflow: 'visible',
          }}
        >
          {children}
        </Box>
      </AccordionDetails>
    </MuiAccordion>
  )
}
