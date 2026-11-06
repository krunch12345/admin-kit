import React, { useEffect, useMemo, useState } from 'react'
import {
  Snackbar,
  Alert as MuiAlert,
  AlertTitle,
  IconButton,
  LinearProgress,
  Box,
} from '@mui/material'
import { useDispatch, useSelector } from 'react-redux'
import { showAlertSelector, hideAlert } from './showAlertSlice.js'
import { Close } from '@mui/icons-material'

export const Alert = () => {
  const { isShowAlert, severity, message } = useSelector(showAlertSelector)
  const [progress, setProgress] = useState(100)

  const dispatch = useDispatch()

  const autoHideDuration = useMemo(
    () => severity !== 'error' ? 5000 : 10000,
    [severity]
  )

  useEffect(() => {
    if (isShowAlert) {
      setProgress(100)
      const decrement = 100 / (autoHideDuration / 250)

      const timer = setInterval(() => {
        setProgress((prev) => Math.max(prev - decrement, 0))
      }, 250)

      return () => {
        clearInterval(timer)
      }
    }
  }, [isShowAlert, autoHideDuration])

  return (
    <Snackbar
      open={isShowAlert}
      autoHideDuration={autoHideDuration}
      onClose={() => dispatch(
        hideAlert(),
      )}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
    >
      <MuiAlert severity={severity}>
        <AlertTitle sx={{ textTransform: 'capitalize', display: 'flex', justifyContent: 'space-between', minWidth: '15rem' }}>
          {severity}

          <IconButton
            edge='end'
            size='small'
            onClick={() => dispatch(
              hideAlert(),
            )}
          >
            <Close />
          </IconButton>
        </AlertTitle>

        {message}

        <Box width='100%' mt={1}>
          <LinearProgress variant='determinate' value={progress} color={severity} />
        </Box>
      </MuiAlert>
    </Snackbar>
  )
}
