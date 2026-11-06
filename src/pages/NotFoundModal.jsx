import React from 'react'
import { Stack, Typography } from '@mui/material'

/**
 * Not Found Modal component.
 * @type {React.FC}
 * @returns {React.ReactElement} The Not Found content.
 */
export const NotFoundModal = () => (
  <Stack spacing={2} alignItems='center'>
    <Typography textAlign='center' fontStyle='italic' variant='h6'>
      Error 404: Page not found.
    </Typography>
  </Stack>
)
