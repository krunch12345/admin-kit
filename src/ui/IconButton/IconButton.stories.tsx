import type { Meta, StoryObj } from '@storybook/react'
import { Delete } from '@mui/icons-material'
import { IconButton } from './IconButton'

const meta = {
  title: 'UI/IconButton',
  component: IconButton,
  tags: ['autodocs'],
} satisfies Meta<typeof IconButton>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    title: 'Delete',
    icon: <Delete />,
    onClick: () => undefined,
  },
}

export const Colored: Story = {
  args: {
    title: 'Delete',
    icon: <Delete />,
    color: 'error',
    onClick: () => undefined,
  },
}
