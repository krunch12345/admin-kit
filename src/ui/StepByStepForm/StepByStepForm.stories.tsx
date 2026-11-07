import type { Meta, StoryObj } from '@storybook/react'
import { Box, Stack, TextField, Typography } from '@mui/material'
import { StepByStepForm } from './StepByStepForm'

const meta = {
  title: 'UI/StepByStepForm',
  component: StepByStepForm,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Generic multi-step form shell. Pass any number of steps via `steps`; locale pairs (RU/EN) are just one possible consumer pattern.',
      },
    },
  },
} satisfies Meta<typeof StepByStepForm>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    steps: [
      {
        id: 'basics',
        label: 'Basics',
        content: (
          <Stack spacing={2}>
            <Typography variant='body2' color='text.secondary'>
              First step content
            </Typography>
            <TextField fullWidth label='Title' size='small' />
          </Stack>
        ),
      },
      {
        id: 'details',
        label: 'Details',
        content: (
          <Stack spacing={2}>
            <Typography variant='body2' color='text.secondary'>
              Second step content
            </Typography>
            <TextField fullWidth label='Notes' size='small' multiline minRows={3} />
          </Stack>
        ),
      },
      {
        id: 'media',
        label: 'Media',
        content: (
          <Stack spacing={2}>
            <Typography variant='body2' color='text.secondary'>
              Third step content
            </Typography>
            <TextField fullWidth label='Cover URL' size='small' />
          </Stack>
        ),
      },
      {
        id: 'review',
        label: 'Review',
        content: (
          <Stack spacing={2}>
            <Typography variant='body2' color='text.secondary'>
              Fourth step content
            </Typography>
            <TextField fullWidth label='Summary' size='small' multiline minRows={2} />
          </Stack>
        ),
      },
    ],
  },
}

export const ManySteps: Story = {
  args: {
    steps: [
      { id: '1', label: 'One', content: <Box>Step one</Box> },
      { id: '2', label: 'Two', content: <Box>Step two</Box> },
      { id: '3', label: 'Three', content: <Box>Step three</Box> },
      { id: '4', label: 'Four', content: <Box>Step four</Box> },
    ],
  },
}

export const LocalePair: Story = {
  name: 'Locale pair (RU / EN)',
  args: {
    sharedFields: (
      <TextField fullWidth label='Slug' size='small' />
    ),
    steps: [
      {
        id: 'ru',
        label: 'RU',
        content: <TextField fullWidth label='Title RU' size='small' />,
      },
      {
        id: 'en',
        label: 'EN',
        content: <TextField fullWidth label='Title EN' size='small' />,
      },
    ],
  },
}
