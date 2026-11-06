import { useSelector } from 'react-redux'
import PropTypes from 'prop-types'
import { Stack, Typography } from '@mui/material'
import { loginSelector } from '../auth/loginSlice.js'
import { Page } from '../layouts/Page.jsx'

/**
 * @typedef {object} IProps
 * @property {string} [title] - The page title.
 */

/**
 * Account page: read-only profile info.
 * @type {React.FC<IProps>}
 * @returns {React.ReactElement} The Account page.
 */
export const Account = ({ title = 'Аккаунт' }) => {
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
    <Page title={title}>
      <Stack>
        {renderAttribute('Никнейм', nickname)}
        {renderAttribute('Email', email)}
      </Stack>
    </Page>
  )
}

Account.propTypes = {
  title: PropTypes.string,
}
