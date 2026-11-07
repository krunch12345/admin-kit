import { useSelector } from 'react-redux'
import { Stack, Typography } from '@mui/material'
import { loginSelector } from '../auth/loginSlice'
import { Page } from '../layouts/Page'
import { useAdminKitMessages } from '../locale/useAdminKitMessages'

export interface AccountProps {
  /** The page title. */
  title?: string
}

/**
 * Account page: read-only profile info.
 */
export const Account = ({ title }: AccountProps) => {
  const messages = useAdminKitMessages()
  const { nickname, email } = useSelector(loginSelector)

  const renderAttribute = (label: string, value: string | null) => (
    <Stack direction='row' spacing={1}>
      <Typography fontSize={18}>
        {label}:
      </Typography>

      <Typography color={theme => theme.palette.grey.A400} fontSize={18}>
        {value}
      </Typography>
    </Stack>
  )

  return (
    <Page title={title ?? messages.account.pageTitle}>
      <Stack>
        {renderAttribute(messages.account.nicknameLabel, nickname)}
        {renderAttribute(messages.login.emailLabel, email)}
      </Stack>
    </Page>
  )
}
