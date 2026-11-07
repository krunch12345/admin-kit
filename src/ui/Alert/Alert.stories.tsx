import { useEffect } from 'react'
import type { ReactNode } from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { Box, Button, Stack, Typography } from '@mui/material'
import { useDispatch } from 'react-redux'
import { showAlert } from './showAlertSlice'
import { Alert } from './Alert'

const meta = {
  title: 'UI/Alert',
  component: Alert,
  tags: ['autodocs'],
  parameters: {
    docs: {
      story: {
        inline: false,
        iframeHeight: 420,
      },
    },
  },
} satisfies Meta<typeof Alert>

export default meta
type Story = StoryObj<typeof meta>

const AlertCanvas = ({ children }: { children: ReactNode }) => (
  <Box
    minHeight={360}
    width='100%'
    position='relative'
    sx={{ overflow: 'visible' }}
  >
    {children}
  </Box>
)

const AlertDemo = () => {
  const dispatch = useDispatch()

  return (
    <Stack spacing={2} direction='row' flexWrap='wrap' useFlexGap>
      <Button
        variant='contained'
        onClick={() => dispatch(showAlert({ isShowAlert: true, severity: 'success', message: 'Saved' }))}
      >
        Success
      </Button>
      <Button
        variant='contained'
        color='error'
        onClick={() => dispatch(showAlert({ isShowAlert: true, severity: 'error', message: 'Something failed' }))}
      >
        Error
      </Button>
      <Button
        variant='outlined'
        onClick={() => dispatch(showAlert({ isShowAlert: true, severity: 'info', message: 'Heads up' }))}
      >
        Info
      </Button>
      <Button
        variant='contained'
        color='warning'
        onClick={() => dispatch(showAlert({
          isShowAlert: true,
          severity: 'warning',
          message: 'Preopened alert',
        }))}
      >
        Warning
      </Button>
    </Stack>
  )
}

export const Interactive: Story = {
  render: () => (
    <AlertCanvas>
      <AlertDemo />
    </AlertCanvas>
  ),
}

export const Warning: Story = {
  render: () => {
    const WarningDemo = () => {
      const dispatch = useDispatch()

      useEffect(() => {
        dispatch(showAlert({
          isShowAlert: true,
          severity: 'warning',
          message: 'Preopened alert',
        }))
      }, [dispatch])

      return (
        <Stack spacing={2}>
          <Typography color='text.secondary'>
            A warning alert opens automatically. It appears at the bottom-right of this preview.
          </Typography>
          <Button
            variant='contained'
            color='warning'
            onClick={() => dispatch(showAlert({
              isShowAlert: true,
              severity: 'warning',
              message: 'Preopened alert',
            }))}
          >
            Show again
          </Button>
        </Stack>
      )
    }

    return (
      <AlertCanvas>
        <WarningDemo />
      </AlertCanvas>
    )
  },
}
