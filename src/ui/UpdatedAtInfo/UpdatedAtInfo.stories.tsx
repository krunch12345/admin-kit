import type { Meta, StoryObj } from '@storybook/react'
import { UpdatedAtInfo } from './UpdatedAtInfo'

const meta = {
  title: 'UI/UpdatedAtInfo',
  component: UpdatedAtInfo,
  tags: ['autodocs'],
} satisfies Meta<typeof UpdatedAtInfo>

export default meta
type Story = StoryObj<typeof meta>

export const Recent: Story = {
  args: {
    updatedAt: new Date().toISOString(),
  },
}

export const Older: Story = {
  args: {
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(),
  },
}
