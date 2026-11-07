import { Button, Stack, Typography } from '@mui/material'
import { ArrowBack, Login } from '@mui/icons-material'
import { OtpCodeInputs } from '../../ui/OtpCodeInputs/OtpCodeInputs'
import { useAdminKitMessages } from '../../locale/useAdminKitMessages'
import { toLoginApiError } from './loginError'

export interface TwoFactorStepProps {
  code: string
  otpLength: number
  error?: unknown
  isVerifying: boolean
  isCodeComplete: boolean
  onCodeChange: (code: string) => void
  onSubmit: () => void
  onBack: () => void
}

/**
 * One-time code step of the login page.
 */
export const TwoFactorStep = ({
  code,
  otpLength,
  error: rawError,
  isVerifying,
  isCodeComplete,
  onCodeChange,
  onSubmit,
  onBack,
}: TwoFactorStepProps) => {
  const messages = useAdminKitMessages()
  const error = toLoginApiError(rawError)

  return (
    <Stack width='100%' spacing={3} alignItems='center'>
      <Typography color='text.secondary' textAlign='center'>
        {messages.login.totpPrompt}
      </Typography>

      <OtpCodeInputs
        value={code}
        onChange={onCodeChange}
        length={otpLength}
        disabled={isVerifying}
      />

      {error && (
        <Typography color={(theme) => theme.palette.error.main} alignSelf='stretch'>
          {error?.data?.message || messages.login.errorVerify2FAFallback}
        </Typography>
      )}

      <Stack direction='row' spacing={2} width='100%'>
        <Button
          variant='outlined'
          color='error'
          fullWidth
          startIcon={<ArrowBack />}
          onClick={onBack}
          disabled={isVerifying}
        >
          {messages.common.back}
        </Button>

        <Button
          variant='contained'
          fullWidth
          startIcon={<Login />}
          disabled={!isCodeComplete || isVerifying}
          onClick={() => onSubmit()}
        >
          {messages.login.submit}
        </Button>
      </Stack>
    </Stack>
  )
}
