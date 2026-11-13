import { Box, Paper, Stack, Typography } from '@mui/material'
import { useLocation } from 'react-router-dom'
import { useAdminKitConfig } from '../config/useAdminKitRuntime'
import { useAdminKitMessages } from '../locale/useAdminKitMessages'
import { sanitizeAppPath } from '../utils/sanitizeAppPath'
import { CredentialsForm } from './login/CredentialsForm'
import { TwoFactorStep } from './login/TwoFactorStep'
import { STEP_OTP, useLoginFlow } from './login/useLoginFlow'

export interface LoginProps {
  /** The credentials-step form title. */
  title?: string
  /** Path to navigate to after successful login. Overrides `location.state.from` when set. */
  redirectPath?: string
  /** Number of 2FA digit boxes. */
  otpLength?: number
}

interface LoginLocationState {
  from?: {
    pathname?: string
    search?: string
  }
}

/**
 * Resolves post-login redirect: explicit prop, then PrivateRoute `state.from`, then home.
 */
export const resolveLoginRedirectPath = (
  redirectPath: string | undefined,
  from: LoginLocationState['from'] | undefined,
  homePath: string,
): string => {
  const fromPath = from?.pathname
    ? `${from.pathname}${from.search ?? ''}`
    : undefined

  return sanitizeAppPath(redirectPath ?? fromPath, homePath)
}

/**
 * Login page component with optional 2FA step.
 */
export const Login = ({
  title,
  redirectPath,
  otpLength = 6,
}: LoginProps) => {
  const messages = useAdminKitMessages()
  const { routes } = useAdminKitConfig()
  const location = useLocation()
  const locationState = location.state as LoginLocationState | null
  const safeRedirectPath = resolveLoginRedirectPath(
    redirectPath,
    locationState?.from,
    routes.home,
  )
  const flow = useLoginFlow({ redirectPath: safeRedirectPath, otpLength })
  const isOtpStep = flow.step === STEP_OTP

  return (
    <Box height='100vh' width='100%' display='flex' justifyContent='center' alignItems='center' flex={1}>
      <Stack
        justifyContent='space-evenly'
        component={Paper}
        minHeight='40rem'
        width='30rem'
        alignItems='center'
        px={4}
        py={4}
      >
        <Typography
          variant='h3'
          sx={{ textAlign: 'center' }}
          mx={10}
        >
          {isOtpStep ? '2FA' : title ?? messages.login.pageTitle}
        </Typography>

        {isOtpStep ? (
          <TwoFactorStep
            code={flow.code}
            otpLength={otpLength}
            error={flow.verifyError}
            isVerifying={flow.isVerifying}
            isCodeComplete={flow.isCodeComplete}
            onCodeChange={flow.changeCode}
            onSubmit={flow.submitCode}
            onBack={flow.goBack}
          />
        ) : (
          <CredentialsForm
            email={flow.email}
            password={flow.password}
            rememberMe={flow.rememberMe}
            error={flow.loginError}
            isSubmitting={flow.isLoggingIn}
            onEmailChange={flow.setEmail}
            onPasswordChange={flow.setPassword}
            onRememberMeChange={flow.setRememberMe}
            onSubmit={flow.submitCredentials}
          />
        )}
      </Stack>
    </Box>
  )
}
