import { useCallback, useEffect, useRef, useState } from 'react'
import type { FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import type { ThunkDispatch, UnknownAction } from '@reduxjs/toolkit'
import { loginSelector, tokenReceived, doRememberMe } from '../../auth/loginSlice'
import type { LoginAdminResponse } from '../../auth/loginSlice'
import { handleLogout } from '../../auth/handleLogout'
import { useAdminKitHooks } from '../../config/useAdminKitRuntime'
import { sanitizeAppPath } from '../../utils/sanitizeAppPath'
import { useLoading } from '../../hooks/useLoading'
import { useNotify } from '../../hooks/useNotify'
import { useAdminKitMessages } from '../../locale/useAdminKitMessages'

export const STEP_CREDENTIALS = 'credentials'
export const STEP_OTP = 'otp'

const digitsOnly = (value: unknown): string => String(value || '').replace(/\D/g, '')

export type LoginStep = typeof STEP_CREDENTIALS | typeof STEP_OTP

export interface UseLoginFlowOptions {
  /** Path to open after a successful login. */
  redirectPath: string
  /** Number of OTP digits. */
  otpLength: number
}

interface LoginSessionPayload {
  accessToken?: string | null
  email?: string | null
  nickname?: string | null
  avatar?: string | null
  id?: string | null
}

/**
 * Credentials -> optional OTP login flow.
 */
export const useLoginFlow = ({ redirectPath, otpLength }: UseLoginFlowOptions) => {
  const messages = useAdminKitMessages()
  const { useLoginAdminMutation, useVerify2FAMutation } = useAdminKitHooks()
  const navigate = useNavigate()
  const dispatch = useDispatch<ThunkDispatch<unknown, unknown, UnknownAction>>()
  const { notify } = useNotify()
  const safeRedirectPath = sanitizeAppPath(redirectPath, '/')

  const {
    email: emailStore,
    nickname,
    id,
    accessToken,
  } = useSelector(loginSelector)

  const [loginAdmin, { isLoading: isLoggingIn }] = useLoginAdminMutation()
  const [verify2FA, { isLoading: isVerifying }] = useVerify2FAMutation()

  const [step, setStep] = useState<LoginStep>(STEP_CREDENTIALS)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [rememberMe, setRememberMe] = useState(false)
  const [code, setCode] = useState('')
  const [loginError, setLoginError] = useState<unknown>(null)
  const [verifyError, setVerifyError] = useState<unknown>(null)
  const lastSubmittedCodeRef = useRef('')
  const isSubmittingCredentialsRef = useRef(false)

  const isOtpStep = step === STEP_OTP

  useLoading(isLoggingIn || isVerifying)

  useEffect(() => {
    if (accessToken && !isOtpStep) {
      navigate(safeRedirectPath, { replace: true })
    }
  }, [accessToken, isOtpStep, navigate, safeRedirectPath])

  const resetOtp = useCallback(() => {
    setCode('')
    setVerifyError(null)
    lastSubmittedCodeRef.current = ''
  }, [])

  const completeLogin = useCallback((payload: LoginSessionPayload) => {
    notify('success', messages.login.loginSuccess)
    dispatch(tokenReceived({ ...payload, is2FARequired: false, rememberMe }))
    navigate(safeRedirectPath, { replace: true })
  }, [dispatch, messages.login.loginSuccess, navigate, notify, rememberMe, safeRedirectPath])

  const handleLoginResult = useCallback((data: LoginAdminResponse) => {
    if (data.is2FARequired) {
      dispatch(tokenReceived({
        accessToken: null,
        email: data.email,
        nickname: data.nickname,
        avatar: data.avatar || '',
        id: data.id,
        is2FARequired: true,
        rememberMe,
      }))

      notify('info', messages.login.authCodeRequired)
      resetOtp()
      setPassword('')
      setStep(STEP_OTP)
      return
    }

    if (data.accessToken) {
      completeLogin({
        accessToken: data.accessToken,
        email: data.email,
        nickname: data.nickname,
        avatar: data.avatar || '',
        id: data.id,
      })
    }
  }, [completeLogin, dispatch, messages.login.authCodeRequired, notify, rememberMe, resetOtp])

  const submitCredentials = useCallback(async (event: FormEvent) => {
    event.preventDefault()

    if (isLoggingIn || isSubmittingCredentialsRef.current) {
      return
    }

    isSubmittingCredentialsRef.current = true

    if (rememberMe) {
      dispatch(doRememberMe())
    }

    setLoginError(null)

    try {
      handleLoginResult(await loginAdmin({ email, password }).unwrap())
    } catch (error) {
      setLoginError(error)
      dispatch(handleLogout({ revokeServer: false }))
    } finally {
      isSubmittingCredentialsRef.current = false
    }
  }, [dispatch, email, handleLoginResult, isLoggingIn, loginAdmin, password, rememberMe])

  const submitCode = useCallback(async (rawCode = code) => {
    const token = digitsOnly(rawCode)

    if (token.length < otpLength || isVerifying) {
      return
    }

    setVerifyError(null)

    try {
      const data = await verify2FA({ email: emailStore || email, token }).unwrap()

      if (!data?.accessToken) {
        return
      }

      completeLogin({
        accessToken: data.accessToken,
        email: data.email ?? emailStore ?? email,
        nickname: data.nickname ?? nickname,
        avatar: data.avatar || '',
        id: data.id ?? id,
      })
      resetOtp()
      setStep(STEP_CREDENTIALS)
    } catch (error) {
      dispatch(handleLogout({ revokeServer: false }))
      notify('error', (error as { data?: { message?: string } })?.data?.message || JSON.stringify(error))
      resetOtp()
      setVerifyError(error)
    }
  }, [
    code,
    completeLogin,
    dispatch,
    email,
    emailStore,
    id,
    isVerifying,
    nickname,
    notify,
    otpLength,
    resetOtp,
    verify2FA,
  ])

  const changeCode = useCallback((nextCode: string) => {
    const trimmed = digitsOnly(nextCode).slice(0, otpLength)

    if (trimmed !== lastSubmittedCodeRef.current) {
      lastSubmittedCodeRef.current = ''
    }

    setCode(trimmed)
    setVerifyError(null)

    if (trimmed.length === otpLength && lastSubmittedCodeRef.current !== trimmed) {
      lastSubmittedCodeRef.current = trimmed
      submitCode(trimmed)
    }
  }, [otpLength, submitCode])

  const goBack = useCallback(() => {
    setStep(STEP_CREDENTIALS)
    setLoginError(null)
    resetOtp()
    dispatch(handleLogout({ revokeServer: false }))
  }, [dispatch, resetOtp])

  return {
    step,
    email,
    setEmail,
    password,
    setPassword,
    rememberMe,
    setRememberMe,
    code,
    loginError,
    verifyError,
    isLoggingIn,
    isVerifying,
    isCodeComplete: digitsOnly(code).length >= otpLength,
    submitCredentials,
    submitCode,
    changeCode,
    goBack,
  }
}
