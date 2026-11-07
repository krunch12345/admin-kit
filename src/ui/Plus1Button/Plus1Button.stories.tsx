import type { Meta, StoryObj } from '@storybook/react'
import { Plus1Button } from './Plus1Button'

const meta = {
  title: 'UI/Plus1Button',
  component: Plus1Button,
  tags: ['autodocs'],
} satisfies Meta<typeof Plus1Button>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    onClick: () => undefined,
  },
}

export const Fab: Story = {
  args: {
    isFab: true,
    onClick: () => undefined,
  },
}
