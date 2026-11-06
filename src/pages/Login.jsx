import { useCallback, useEffect, useRef, useState } from 'react'
import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  IconButton,
  InputAdornment,
  Paper,
  Stack,
  Typography,
} from '@mui/material'
import { Visibility, VisibilityOff } from '@mui/icons-material'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import PropTypes from 'prop-types'
import { loginSelector, tokenReceived, doRememberMe } from '../auth/loginSlice.js'
import { handleLogout } from '../auth/handleLogout.js'
import { getAuthHooks } from '../auth/runtimeHooks.js'
import { useLoading } from '../hooks/useLoading.js'
import { TextField } from '../ui/TextField/TextField.jsx'
import { OtpCodeInputs } from '../ui/OtpCodeInputs/OtpCodeInputs.jsx'
import { showAlert } from '../ui/Alert/showAlertSlice.js'
import { formatMessage } from '../locale/formatMessage.js'
import { useAdminKitMessages } from '../locale/useAdminKitMessages.js'

/**
 * @typedef {object} IProps
 * @property {string} [title] - The credentials-step form title.
 * @property {string} [redirectPath] - Path to navigate to after successful login.
 * @property {number} [otpLength] - Number of 2FA digit boxes.
 */

/**
 * Login page component with optional 2FA step.
 * @type {React.FC<IProps>}
 * @returns {React.ReactElement} The Login page.
 */
export const Login = ({
  title,
  redirectPath = '/',
  otpLength = 6,
}) => {
  const m = useAdminKitMessages()
  const { useLoginAdminMutation, useVerify2FAMutation } = getAuthHooks()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [is2FARequired, setIs2FARequired] = useState(false)
  const [code2FA, setCode2FA] = useState('')
  const [localRememberMe, setLocalRememberMe] = useState(false)
  const autoSubmittedCodeRef = useRef('')

  const navigate = useNavigate()
  const dispatch = useDispatch()

  const {
    email: emailStore,
    nickname,
    id,
    is2FARequired: is2FARequiredStore,
    accessToken,
  } = useSelector(loginSelector)

  const [loginAdmin,
    {
      isLoading: isLoadingLogin,
      isSuccess: isSuccessLogin,
      isError: isErrorLogin,
      error: errorLogin,
      data: dataLogin,
      reset: resetLoginAdmin,
    }
  ] = useLoginAdminMutation()

  const [
    verify2FA,
    {
      isLoading: isCheckingVerify2FA,
      isSuccess: isSuccessVerify2FA,
      isError: isErrorVerify2FA,
      error: errorVerify2FA,
      data: dataVerify2FA,
      reset: resetVerify2FA,
    }
  ] = useVerify2FAMutation()

  useEffect(() => {
    resetLoginAdmin()
    resetVerify2FA()
    // Only on mount: reset mutation cache so stale fulfilled state does not re-run effects.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (isErrorLogin) {
      dispatch(handleLogout())
    }
  }, [dispatch, isErrorLogin])

  useEffect(() => {
    if (!isSuccessLogin || !dataLogin) {
      return
    }

    if (dataLogin.is2FARequired) {
      if (accessToken) {
        return
      }

      dispatch(
        tokenReceived({
          email: dataLogin.email,
          nickname: dataLogin.nickname,
          avatar: dataLogin.avatar || '',
          id: dataLogin.id,
          is2FARequired: true,
          rememberMe: localRememberMe,
        }),
      )

      if (!is2FARequired) {
        dispatch(
          showAlert({
            isShowAlert: true,
            severity: 'info',
            message: m.login.authCodeRequired,
          }),
        )
        setIs2FARequired(true)
        setCode2FA('')
        autoSubmittedCodeRef.current = ''
      }
      return
    }

    if (dataLogin.accessToken) {
      dispatch(
        tokenReceived({
          accessToken: dataLogin.accessToken,
          email: dataLogin.email,
          nickname: dataLogin.nickname,
          avatar: dataLogin.avatar || '',
          is2FARequired: false,
          id: dataLogin.id,
          rememberMe: localRememberMe,
        }),
      )

      dispatch(
        showAlert({
          isShowAlert: true,
          severity: 'success',
          message: m.login.loginSuccess,
        }),
      )

      navigate(redirectPath, { replace: true })
    }
  }, [
    accessToken,
    dataLogin,
    dispatch,
    is2FARequired,
    isSuccessLogin,
    localRememberMe,
    m.login.authCodeRequired,
    m.login.loginSuccess,
    navigate,
    redirectPath,
  ])

  useEffect(() => {
    if (isSuccessVerify2FA && dataVerify2FA?.accessToken) {
      dispatch(
        showAlert({
          isShowAlert: true,
          severity: 'success',
          message: m.login.loginSuccess,
        }),
      )

      dispatch(
        tokenReceived({
          accessToken: dataVerify2FA.accessToken,
          email: dataVerify2FA.email ?? emailStore ?? email,
          nickname: dataVerify2FA.nickname ?? nickname,
          avatar: dataVerify2FA.avatar || '',
          id: dataVerify2FA.id ?? id,
          is2FARequired: false,
          rememberMe: localRememberMe,
        }),
      )

      setCode2FA('')
      setIs2FARequired(false)
      autoSubmittedCodeRef.current = ''
      resetLoginAdmin()
      resetVerify2FA()
      navigate(redirectPath, { replace: true })
    } else if (isErrorVerify2FA) {
      const message = errorVerify2FA?.data?.message || JSON.stringify(errorVerify2FA)
      dispatch(handleLogout())
      dispatch(
        showAlert({
          isShowAlert: true,
          severity: 'error',
          message,
        }),
      )
      setCode2FA('')
      autoSubmittedCodeRef.current = ''
      setIs2FARequired(true)
      resetVerify2FA()
    }
  }, [
    dataVerify2FA,
    dispatch,
    email,
    emailStore,
    errorVerify2FA,
    id,
    isErrorVerify2FA,
    isSuccessVerify2FA,
    localRememberMe,
    m.login.loginSuccess,
    nickname,
    navigate,
    redirectPath,
    resetLoginAdmin,
    resetVerify2FA,
  ])

  useEffect(() => {
    if (accessToken && !is2FARequiredStore && !is2FARequired) {
      navigate(redirectPath, { replace: true })
    }
  }, [accessToken, is2FARequired, is2FARequiredStore, navigate, redirectPath])

  useLoading(isLoadingLogin || isCheckingVerify2FA)

  const onVerify2FA = useCallback((token = code2FA) => {
    const trimmed = String(token || '').replace(/\D/g, '')
    if (trimmed.length < otpLength || isCheckingVerify2FA) {
      return
    }

    verify2FA({ email: emailStore || email, token: trimmed })
  }, [code2FA, email, emailStore, isCheckingVerify2FA, otpLength, verify2FA])

  useEffect(() => {
    const trimmed = code2FA.replace(/\D/g, '')
    if (
      trimmed.length !== otpLength
      || isCheckingVerify2FA
      || autoSubmittedCodeRef.current === trimmed
    ) {
      return
    }

    autoSubmittedCodeRef.current = trimmed
    onVerify2FA(trimmed)
  }, [code2FA, isCheckingVerify2FA, onVerify2FA, otpLength])

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword)
  }

  const onSubmit = (e) => {
    e.preventDefault()

    if (localRememberMe) {
      dispatch(doRememberMe())
    }

    loginAdmin({
      email,
      password,
    })
  }

  const handleBackFrom2FA = () => {
    setIs2FARequired(false)
    setCode2FA('')
    autoSubmittedCodeRef.current = ''
    resetLoginAdmin()
    resetVerify2FA()
    dispatch(handleLogout())
  }

  const handleOtpChange = (nextCode) => {
    const trimmed = String(nextCode || '').replace(/\D/g, '').slice(0, otpLength)
    if (trimmed !== autoSubmittedCodeRef.current) {
      autoSubmittedCodeRef.current = ''
    }
    setCode2FA(trimmed)
  }

  const credentialsForm = (
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
        placeholder={m.login.emailPlaceholder}
        label={m.login.emailLabel}
        required
        value={email}
        onChange={value => setEmail(value)}
      />

      <Stack width='100%' spacing={1}>
        <TextField
          required
          type={showPassword ? 'text' : 'password'}
          value={password}
          placeholder={m.login.passwordPlaceholder}
          label={m.login.passwordLabel}
          onChange={value => setPassword(value)}
          InputProps={{
            endAdornment: (
              <InputAdornment position='end'>
                <IconButton
                  aria-label='toggle password visibility'
                  onClick={handleClickShowPassword}
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
            checked={localRememberMe}
            onChange={(e) => setLocalRememberMe(e.target.checked)}
            color='primary'
          />
        }
        label={m.login.rememberMe}
        sx={{ alignSelf: 'flex-start' }}
      />

      {isErrorLogin && errorLogin && (
        <Stack alignSelf='flex-start'>
          <Typography color={theme => theme.palette.error.main}>
            {errorLogin?.data?.message || m.login.errorLoginFallback}
          </Typography>

          {errorLogin?.data?.remainingAttempts !== undefined && (
            <Typography color={theme => theme.palette.error.main}>
              {errorLogin.data.remainingAttempts > 0
                ? formatMessage(m.login.attemptsRemaining, {
                  remainingAttempts: errorLogin.data.remainingAttempts,
                })
                : m.login.userBlocked}
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
        {m.login.submit}
      </Button>
    </Stack>
  )

  const twoFactorStep = (
    <Stack width='100%' spacing={3} alignItems='center'>
      <Typography color='text.secondary' textAlign='center'>
        {m.login.totpPrompt}
      </Typography>

      <OtpCodeInputs
        value={code2FA}
        onChange={handleOtpChange}
        length={otpLength}
        disabled={isCheckingVerify2FA}
      />

      {isErrorVerify2FA && (
        <Typography color={theme => theme.palette.error.main} alignSelf='stretch'>
          {errorVerify2FA?.data?.message || m.login.errorVerify2FAFallback}
        </Typography>
      )}

      <Stack direction='row' spacing={2} width='100%'>
        <Button
          variant='outlined'
          color='error'
          fullWidth
          onClick={handleBackFrom2FA}
          disabled={isCheckingVerify2FA}
        >
          {m.common.back}
        </Button>

        <Button
          variant='contained'
          fullWidth
          disabled={code2FA.replace(/\D/g, '').length < otpLength || isCheckingVerify2FA}
          onClick={() => onVerify2FA()}
        >
          {m.login.submit}
        </Button>
      </Stack>
    </Stack>
  )

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
          {is2FARequired ? '2FA' : title ?? m.login.pageTitle}
        </Typography>

        {is2FARequired ? twoFactorStep : credentialsForm}
      </Stack>
    </Box>
  )
}

Login.propTypes = {
  title: PropTypes.string,
  redirectPath: PropTypes.string,
  otpLength: PropTypes.number,
}
