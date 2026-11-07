import type { Meta, StoryObj } from '@storybook/react'
import { Box, TextField } from '@mui/material'
import { cyan } from '@mui/material/colors'
import { Main } from './Main'

const meta = {
  title: 'Pages/Main',
  component: Main,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta<typeof Main>

export default meta
type Story = StoryObj<typeof meta>

const AdminKitLogo = () => (
  <Box
    component='svg'
    xmlns='http://www.w3.org/2000/svg'
    viewBox='0 0 480 120'
    role='img'
    aria-label='admin-kit'
    sx={{
      width: { xs: '80%', sm: '40%', md: '30%' },
      maxWidth: 420,
      height: 'auto',
      display: 'block',
    }}
  >
    <text
      x='240'
      y='72'
      textAnchor='middle'
      fontFamily='ui-sans-serif, system-ui, -apple-system, Segoe UI, sans-serif'
      fontSize='56'
      fontWeight='700'
      letterSpacing='0.04em'
      fill={cyan.A200}
    >
      admin-kit
    </text>
  </Box>
)

export const Default: Story = {
  render: () => (
    <Box
      minHeight='100vh'
      width='100%'
      display='flex'
      flexDirection='column'
    >
      <Main
        logo={<AdminKitLogo />}
        SearchComponent={(
          <TextField
            fullWidth
            label='Site search'
            size='small'
          />
        )}
      />
    </Box>
  ),
}
