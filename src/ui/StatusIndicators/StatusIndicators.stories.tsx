import type { Meta, StoryObj } from '@storybook/react'
import { StatusIndicators } from './StatusIndicators'

const meta = {
  title: 'UI/StatusIndicators',
  component: StatusIndicators,
  tags: ['autodocs'],
} satisfies Meta<typeof StatusIndicators>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    values: {
      telegram: true,
      bluesky: true,
      instagram: false,
      threads: false,
      discord: true,
    },
  },
}

export const Clickable: Story = {
  args: {
    values: {
      telegram: true,
      bluesky: false,
    },
    onPlatformClick: () => undefined,
  },
}
