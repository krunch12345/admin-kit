import { useSelector } from 'react-redux'
import PropTypes from 'prop-types'
import { Stack, Typography } from '@mui/material'
import { loginSelector } from '../auth/loginSlice.js'
import { Page } from '../layouts/Page.jsx'
import { useAdminKitMessages } from '../locale/useAdminKitMessages.js'

/**
 * @typedef {object} IProps
 * @property {string} [title] - The page title.
 */

/**
 * Account page: read-only profile info.
 * @type {React.FC<IProps>}
 * @returns {React.ReactElement} The Account page.
 */
export const Account = ({ title }) => {
  const m = useAdminKitMessages()
  const { nickname, email } = useSelector(loginSelector)

  const renderAttribute = (label, value) => (
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
    <Page title={title ?? m.account.pageTitle}>
      <Stack>
        {renderAttribute(m.account.nicknameLabel, nickname)}
        {renderAttribute(m.login.emailLabel, email)}
      </Stack>
    </Page>
  )
}

Account.propTypes = {
  title: PropTypes.string,
}
