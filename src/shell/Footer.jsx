import React from 'react'
import PropTypes from 'prop-types'
import { Box, Container, Paper, Stack, Typography } from '@mui/material'
import { ADMIN_KIT_VERSION } from '../version.js'

/**
 * Formats the copyright period.
 * @param {number} startYear - First year of the project.
 * @param {number} currentYear - Current year.
 * @returns {string|number} Single year or "start - current" range.
 */
const getCopyrightYears = (startYear, currentYear) => (
  currentYear > startYear ? `${startYear} - ${currentYear}` : startYear
)

/**
 * @typedef {object} IProps
 * @property {string} [developer] - Developer name shown in the footer.
 * @property {number} copyrightStartYear - First year of the project.
 * @property {boolean} [showDeveloper] - Show the developer name.
 * @property {boolean} [showKitVersion] - Show the admin-kit version on the right.
 */

/**
 * Footer component.
 * @type {React.FC<IProps>}
 * @returns {React.ReactElement} The Footer component.
 */
export const Footer = ({
  developer,
  copyrightStartYear,
  showDeveloper = true,
  showKitVersion = true,
}) => {
  const years = getCopyrightYears(copyrightStartYear, new Date().getFullYear())
  const copyright = showDeveloper && developer
    ? `Dev by ${developer} \u00A9 ${years}`
    : `\u00A9 ${years}`

  return (
    <Stack>
      <Paper
        elevation={24}
        sx={{ backgroundColor: theme => theme.palette.grey['900'], zIndex: theme => theme.zIndex.drawer + 1 }}
      >
        <Container maxWidth={false} sx={{ mt: 'auto' }}>
          <Stack direction='row' alignItems='center' width='100%'>
            <Box flex={1} />

            <Typography fontSize={14} color={theme => theme.palette.grey['400']} m={1}>
              {copyright}
            </Typography>

            <Box flex={1} display='flex' justifyContent='flex-end'>
              {showKitVersion && (
                <Typography
                  fontSize={14}
                  fontWeight={600}
                  color={theme => theme.palette.grey['400']}
                  m={1}
                >
                  admin-kit v{ADMIN_KIT_VERSION}
                </Typography>
              )}
            </Box>
          </Stack>
        </Container>
      </Paper>
    </Stack>
  )
}

Footer.propTypes = {
  developer: PropTypes.string,
  copyrightStartYear: PropTypes.number.isRequired,
  showDeveloper: PropTypes.bool,
  showKitVersion: PropTypes.bool,
}
