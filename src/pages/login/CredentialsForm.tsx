import { useState } from 'react'
import type { FormEvent } from 'react'
import {
  Button,
  Checkbox,
  FormControlLabel,
  IconButton,
  InputAdornment,
  Stack,
  Typography,
} from '@mui/material'
import type { Theme } from '@mui/material'
import { Visibility, VisibilityOff } from '@mui/icons-material'
import { TextField } from '../../ui/TextField/TextField'
import { formatMessage } from '../../locale/formatMessage'
import { useAdminKitMessages } from '../../locale/useAdminKitMessages'
import { toLoginApiError } from './loginError'

const getErrorColor = (theme: Theme) => theme.palette.error.main

export interface CredentialsFormProps {
  email: string
  password: string
  rememberMe: boolean
  error?: unknown
  onEmailChange: (value: string) => void
  onPasswordChange: (value: string) => void
  onRememberMeChange: (checked: boolean) => void
  onSubmit: (event: FormEvent<HTMLFormElement>) => void
}

/**
 * Email/password step of the login page.
 */
export const CredentialsForm = ({
  email,
  password,
  rememberMe,
  error: rawError,
  onEmailChange,
  onPasswordChange,
  onRememberMeChange,
  onSubmit,
}: CredentialsFormProps) => {
  const messages = useAdminKitMessages()
  const [showPassword, setShowPassword] = useState(false)
  const error = toLoginApiError(rawError)
  const remainingAttempts = error?.data?.remainingAttempts

  return (
    <Stack
      width='100%'
      component='form'
      onSubmit={onSubmit}
      method='POST'
      alignItems='flex-end'
      spacing={4}
    >
      <TextField
        autoFocus
        fullWidth
        type='email'
        placeholder={messages.login.emailPlaceholder}
        label={messages.login.emailLabel}
        required
        value={email}
        onChange={onEmailChange}
      />

      <Stack width='100%' spacing={1}>
        <TextField
          required
          type={showPassword ? 'text' : 'password'}
          value={password}
          placeholder={messages.login.passwordPlaceholder}
          label={messages.login.passwordLabel}
          onChange={onPasswordChange}
          InputProps={{
            endAdornment: (
              <InputAdornment position='end'>
                <IconButton
                  aria-label='toggle password visibility'
                  onClick={() => setShowPassword((value) => !value)}
                  edge='end'
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
      </Stack>

      <FormControlLabel
        control={
          <Checkbox
            checked={rememberMe}
            onChange={(event) => onRememberMeChange(event.target.checked)}
            color='primary'
          />
        }
        label={messages.login.rememberMe}
        sx={{ alignSelf: 'flex-start' }}
      />

      {error && (
        <Stack alignSelf='flex-start'>
          <Typography color={getErrorColor}>
            {error?.data?.message || messages.login.errorLoginFallback}
          </Typography>

          {remainingAttempts !== undefined && (
            <Typography color={getErrorColor}>
              {remainingAttempts > 0
                ? formatMessage(messages.login.attemptsRemaining, { remainingAttempts })
                : messages.login.userBlocked}
            </Typography>
          )}
        </Stack>
      )}

      <Button
        type='submit'
        variant='contained'
        fullWidth
        disabled={!email || !password}
      >
        {messages.login.submit}
      </Button>
    </Stack>
  )
}
