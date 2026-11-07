import { Box, Container, Paper, Stack, Typography } from '@mui/material'
import { ADMIN_KIT_VERSION } from '../version'

const getCopyrightYears = (startYear: number, currentYear: number): string | number => (
  currentYear > startYear ? `${startYear} - ${currentYear}` : startYear
)

export interface FooterProps {
  /** Developer name shown in the footer. */
  developer?: string
  /** First year of the project. */
  copyrightStartYear: number
  /** Show the developer name. */
  showDeveloper?: boolean
  /** Show the admin-kit version on the right. */
  showKitVersion?: boolean
}

/**
 * Footer component.
 */
export const Footer = ({
  developer,
  copyrightStartYear,
  showDeveloper = true,
  showKitVersion = true,
}: FooterProps) => {
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
