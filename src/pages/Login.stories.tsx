import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { Box, Paper, Stack, Typography } from '@mui/material'
import { TwoFactorStep } from './login/TwoFactorStep'
import { Login } from './Login'

const meta = {
  title: 'Pages/Login',
  component: Login,
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta<typeof Login>

export default meta
type Story = StoryObj<typeof meta>

export const SignIn: Story = {
  name: 'Sign in',
}

const TwoFactorPreview = () => {
  const [code, setCode] = useState('')

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
        <Typography variant='h3' sx={{ textAlign: 'center' }} mx={10}>
          2FA
        </Typography>
        <TwoFactorStep
          code={code}
          otpLength={6}
          isVerifying={false}
          isCodeComplete={code.length >= 6}
          onCodeChange={setCode}
          onSubmit={() => undefined}
          onBack={() => undefined}
        />
      </Stack>
    </Box>
  )
}

export const TwoFactor: Story = {
  name: '2FA',
  render: () => <TwoFactorPreview />,
}
