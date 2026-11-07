import type { Meta, StoryObj } from '@storybook/react'
import { Typography } from '@mui/material'
import { Accordion } from './Accordion'

const meta = {
  title: 'UI/Accordion',
  component: Accordion,
  tags: ['autodocs'],
} satisfies Meta<typeof Accordion>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    summaryTitle: 'Details',
    count: 3,
    children: <Typography>Accordion body content</Typography>,
  },
}

export const ErrorBackground: Story = {
  args: {
    summaryTitle: 'Validation errors',
    count: 2,
    isErrorBackground: true,
    children: <Typography>Fix required fields</Typography>,
  },
}

export const CollapsedByDefault: Story = {
  args: {
    summaryTitle: 'Collapsed',
    defaultNotExpanded: true,
    children: <Typography>Hidden until expanded</Typography>,
  },
}
