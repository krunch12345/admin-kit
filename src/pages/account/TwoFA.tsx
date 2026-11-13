import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import {
  Button,
  Checkbox,
  FormControlLabel,
  IconButton,
  InputAdornment,
  Popover,
  Stack,
  Typography,
} from '@mui/material'
import { Visibility, VisibilityOff } from '@mui/icons-material'
import { MdDisabledByDefault } from 'react-icons/md'
import { TbAuth2Fa } from 'react-icons/tb'
import { loginSelector } from '../../auth/loginSlice'
import { isRememberMeSession } from '../../auth/sessionFlags'
import { useAdminKitHooks } from '../../config/useAdminKitRuntime'
import { useLoading } from '../../hooks/useLoading'
import { useNotify } from '../../hooks/useNotify'
import { useAdminKitMessages } from '../../locale/useAdminKitMessages'
import { TextField } from '../../ui/TextField/TextField'

/**
 * Account 2FA setup: enable (QR) → verify code; disable with password.
 */
export const TwoFA = () => {
  const messages = useAdminKitMessages()
  const { notify } = useNotify()
  const {
    useEnable2FAMutation,
    useVerify2FAMutation,
    useDisable2FAMutation,
  } = useAdminKitHooks()

  const [wantsEnable, setWantsEnable] = useState(false)
  const [qrCodeImageUrl, setQrCodeImageUrl] = useState<string | null>(null)
  const [setupCode, setSetupCode] = useState('')
  const [disablePassword, setDisablePassword] = useState('')
  const [showDisablePassword, setShowDisablePassword] = useState(false)
  const [anchorElInfo2FA, setAnchorElInfo2FA] = useState<HTMLElement | null>(null)

  const openInfo2FA = Boolean(anchorElInfo2FA)
  const { is2FARequired, email, rememberMe } = useSelector(loginSelector)

  const [
    enable2FA,
    {
      isLoading: isUpdatingEnable2FA,
      isSuccess: isSuccessEnable2FA,
      isError: isErrorEnable2FA,
      error: errorEnable2FA,
      data: dataEnable2FA,
      reset: resetEnable2FA,
    },
  ] = useEnable2FAMutation()

  const [
    verify2FA,
    {
      isLoading: isVerifyingSetup,
      isSuccess: isSuccessVerifySetup,
      isError: isErrorVerifySetup,
      error: errorVerifySetup,
      reset: resetVerify2FA,
    },
  ] = useVerify2FAMutation()

  const [
    disable2FA,
    {
      isSuccess: isSuccessDisable2FA,
      isLoading: isLoadingDisable2FA,
      isError: isErrorDisable2FA,
      error: errorDisable2FA,
      reset: resetDisable2FA,
    },
  ] = useDisable2FAMutation()

  useLoading(isUpdatingEnable2FA || isLoadingDisable2FA || isVerifyingSetup)

  const isPendingSetup = Boolean(qrCodeImageUrl) && !is2FARequired
  const is2FAActive = Boolean(is2FARequired)

  useEffect(() => {
    if (is2FARequired) {
      setWantsEnable(false)
      setQrCodeImageUrl(null)
      setSetupCode('')
    }
  }, [is2FARequired])

  useEffect(() => {
    if (isSuccessEnable2FA && dataEnable2FA?.qrCodeImageUrl) {
      setQrCodeImageUrl(dataEnable2FA.qrCodeImageUrl)
      setSetupCode('')
      notify('info', messages.account.twoFaQrGenerated)
    } else if (isErrorEnable2FA) {
      notify(
        'error',
        (errorEnable2FA as { data?: { message?: string } })?.data?.message
          || JSON.stringify(errorEnable2FA),
      )
      setQrCodeImageUrl(null)
    }
  }, [
    dataEnable2FA,
    errorEnable2FA,
    isErrorEnable2FA,
    isSuccessEnable2FA,
    messages.account.twoFaQrGenerated,
    notify,
  ])

  useEffect(() => {
    if (isSuccessVerifySetup) {
      notify('success', messages.account.twoFaEnabled)
      setQrCodeImageUrl(null)
      setSetupCode('')
      setWantsEnable(false)
      resetEnable2FA()
      resetVerify2FA()
    } else if (isErrorVerifySetup) {
      notify(
        'error',
        (errorVerifySetup as { data?: { message?: string } })?.data?.message
          || JSON.stringify(errorVerifySetup),
      )
    }
  }, [
    errorVerifySetup,
    isErrorVerifySetup,
    isSuccessVerifySetup,
    messages.account.twoFaEnabled,
    notify,
    resetEnable2FA,
    resetVerify2FA,
  ])

  useEffect(() => {
    if (isSuccessDisable2FA) {
      notify('success', messages.account.twoFaDisabled)
      setDisablePassword('')
      setQrCodeImageUrl(null)
      setWantsEnable(false)
      resetDisable2FA()
      resetEnable2FA()
      resetVerify2FA()
    } else if (isErrorDisable2FA) {
      notify(
        'error',
        (errorDisable2FA as { data?: { message?: string } })?.data?.message
          || JSON.stringify(errorDisable2FA),
      )
    }
  }, [
    errorDisable2FA,
    isErrorDisable2FA,
    isSuccessDisable2FA,
    messages.account.twoFaDisabled,
    notify,
    resetDisable2FA,
    resetEnable2FA,
    resetVerify2FA,
  ])

  const handleConfirmSetup = () => {
    if (!email || !setupCode) {
      return
    }

    verify2FA({
      email,
      token: setupCode,
      rememberMe: rememberMe || isRememberMeSession(),
    })
  }

  const handleDisable = () => {
    if (!disablePassword) {
      return
    }

    setAnchorElInfo2FA(null)
    setShowDisablePassword(false)
    disable2FA({ password: disablePassword })
  }

  return (
    <Stack spacing={1}>
      <Stack direction='row' alignItems='center' spacing={1}>
        <TbAuth2Fa fontSize={30} />

        <FormControlLabel
          control={
            <Checkbox
              checked={is2FAActive || wantsEnable || isPendingSetup}
              onChange={(event) => setWantsEnable(event.target.checked)}
              disabled={is2FAActive || isPendingSetup}
            />
          }
          label={messages.account.twoFaLabel}
          sx={{ alignSelf: 'flex-start' }}
        />

        {is2FAActive && (
          <>
            <IconButton
              onClick={(event) => setAnchorElInfo2FA(event.currentTarget)}
              title={messages.account.twoFaDisableTitle}
              color='inherit'
              sx={{
                '&:hover': {
                  color: 'error.main',
                },
              }}
            >
              <MdDisabledByDefault />
            </IconButton>

            <Popover
              open={openInfo2FA}
              anchorEl={anchorElInfo2FA}
              onClose={() => {
                setAnchorElInfo2FA(null)
                setDisablePassword('')
                setShowDisablePassword(false)
              }}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'center',
              }}
              transformOrigin={{
                vertical: 'top',
                horizontal: 'center',
              }}
              sx={{ mt: 1 }}
            >
              <Stack spacing={1} alignItems='stretch' p={2} maxWidth={360}>
                <Typography>
                  {messages.account.twoFaDisablePrompt}
                </Typography>

                <TextField
                  required
                  fullWidth
                  type={showDisablePassword ? 'text' : 'password'}
                  value={disablePassword}
                  placeholder={messages.login.passwordPlaceholder}
                  label={messages.login.passwordLabel}
                  onChange={setDisablePassword}
                  inputProps={{ maxLength: 64 }}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position='end'>
                        <IconButton
                          aria-label='toggle password visibility'
                          onClick={() => setShowDisablePassword((value) => !value)}
                          edge='end'
                        >
                          {showDisablePassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />

                <Button
                  color='error'
                  disabled={!disablePassword}
                  onClick={handleDisable}
                >
                  {messages.account.twoFaDisableAction}
                </Button>
              </Stack>
            </Popover>
          </>
        )}
      </Stack>

      {!is2FAActive && !isPendingSetup && (
        <Button
          variant='contained'
          size='small'
          disabled={!wantsEnable}
          onClick={() => enable2FA()}
        >
          {messages.account.twoFaGenerateQr}
        </Button>
      )}

      {isPendingSetup && (
        <Stack spacing={2}>
          <Typography>
            {messages.account.twoFaSetupHint}
          </Typography>

          <img
            src={qrCodeImageUrl!}
            alt={messages.account.twoFaQrAlt}
            style={{ marginTop: 8, maxWidth: 200 }}
          />

          <TextField
            fullWidth
            placeholder={messages.account.twoFaCodePlaceholder}
            label={messages.account.twoFaCodeLabel}
            value={setupCode}
            onChange={setSetupCode}
            onKeyDown={(event) => {
              if (event.key === 'Enter') {
                event.preventDefault()
                if (setupCode) {
                  handleConfirmSetup()
                }
              }
            }}
          />

          <Button
            variant='contained'
            size='small'
            disabled={!setupCode}
            onClick={handleConfirmSetup}
          >
            {messages.account.twoFaConfirmActivate}
          </Button>
        </Stack>
      )}
    </Stack>
  )
}
