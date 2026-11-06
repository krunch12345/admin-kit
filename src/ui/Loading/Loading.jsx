import React from 'react'
import { useSelector } from 'react-redux'
import { Backdrop, CircularProgress } from '@mui/material'
import { showLoadingSelector } from './showLoadingSlice.js'

/**
 * Loading component.
 * @returns {React.ReactElement} The Loading components.
 */
export const Loading = () => {
  const { isShowLoading } = useSelector(showLoadingSelector)

  return (
    <Backdrop
      open={isShowLoading}
      sx={{
        color: theme => theme.palette.grey.A100,
        zIndex: theme => theme.zIndex.tooltip,
        marginTop: '0 !important'
      }}
    >
      <CircularProgress color='inherit' />
    </Backdrop>
  )
}
