import { useEffect, useMemo, useRef, useState } from 'react'
import {
  Alert as MuiAlert,
  AlertTitle,
  Box,
} from '@mui/material'
import { useDispatch, useSelector } from 'react-redux'
import { showAlertSelector, hideAlert } from './showAlertSlice'

/**
 * Global alert host. Mount once (e.g. in Content / Storybook preview).
 *
 * Progress is rendered outside `.MuiAlert-message`: that slot uses
 * `overflow: auto` by default, and absolute children inside it create a
 * horizontal scrollbar in Firefox/Floorp that looks like a second bar.
 */
export const Alert = () => {
  const { isShowAlert, severity, message } = useSelector(showAlertSelector)
  const [progress, setProgress] = useState(100)
  const dispatch = useDispatch()
  const visibleAlertKeyRef = useRef<string | null>(null)

  const autoHideDuration = useMemo(
    () => severity !== 'error' ? 5000 : 10000,
    [severity],
  )

  const alertKey = isShowAlert ? `${severity ?? ''}:${message ?? ''}` : null

  useEffect(() => {
    if (!isShowAlert || !alertKey) {
      visibleAlertKeyRef.current = null
      return undefined
    }

    if (visibleAlertKeyRef.current !== alertKey) {
      visibleAlertKeyRef.current = alertKey
      setProgress(100)
    }

    const tickMs = 50
    const decrement = 100 / (autoHideDuration / tickMs)
    const tickTimer = setInterval(() => {
      setProgress((prev) => Math.max(prev - decrement, 0))
    }, tickMs)

    const hideTimer = setTimeout(() => {
      dispatch(hideAlert())
    }, autoHideDuration)

    return () => {
      clearInterval(tickTimer)
      clearTimeout(hideTimer)
    }
  }, [alertKey, autoHideDuration, dispatch, isShowAlert])

  if (!isShowAlert) {
    return null
  }

  return (
    <Box
      position='fixed'
      bottom={16}
      right={16}
      zIndex={(theme) => theme.zIndex.snackbar}
      maxWidth='min(100vw - 32px, 420px)'
    >
      <Box
        position='relative'
        overflow='hidden'
        borderRadius={1}
        minWidth={280}
      >
        <MuiAlert
          severity={severity}
          onClose={() => dispatch(hideAlert())}
          sx={{
            borderRadius: 0,
            // Never `auto`: avoids Firefox scrollbar-as-fake-progress.
            '& .MuiAlert-message': {
              overflow: 'hidden',
            },
          }}
        >
          <AlertTitle sx={{ textTransform: 'capitalize', mb: 0.5 }}>
            {severity}
          </AlertTitle>

          {message}
        </MuiAlert>

        <Box
          aria-hidden
          sx={{
            position: 'absolute',
            left: 0,
            right: 0,
            bottom: 0,
            height: 2,
            bgcolor: 'transparent',
            pointerEvents: 'none',
          }}
        >
          <Box
            role='progressbar'
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={Math.round(progress)}
            sx={{
              height: 2,
              width: `${progress}%`,
              bgcolor: severity ? `${severity}.main` : 'primary.main',
              transition: 'width 50ms linear',
            }}
          />
        </Box>
      </Box>
    </Box>
  )
}
