import React, { useEffect, useState } from 'react'
import {
  Accordion as MuiAccordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Stack,
  Typography
} from '@mui/material'
import { ExpandMore } from '@mui/icons-material'
import PropTypes from 'prop-types'

/**
 * @typedef {object} IProps
 * @property {string} summaryTitle - The Summary title.
 * @property {React.ReactNode} children - The Accordion details.
 * @property {boolean} [defaultNotExpanded] - Default expanded.
 * @property {number} [count] - Count of objects.
 * @property {boolean} [isErrorBackground] - Status of error.
 */

/**
 * Custom Accordion component.
 * @type {React.FC<IProps>}
 * @returns {React.ReactElement} The Custom Accordion components.
 */
export const Accordion = ({
  summaryTitle,
  children,
  defaultNotExpanded,
  count,
  isErrorBackground,
}) => {
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

          {count >=0 && (
            <Typography variant='overline' color={theme => theme.palette.grey[500]}>
              всего: {count}
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

Accordion.propTypes = {
  summaryTitle: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
  defaultNotExpanded: PropTypes.bool,
  isErrorBackground: PropTypes.bool,
  count: PropTypes.number,
}
