import type { Meta, StoryObj } from '@storybook/react'
import { ColorLegend } from './ColorLegend'

const meta = {
  title: 'UI/ColorLegend',
  component: ColorLegend,
  tags: ['autodocs'],
} satisfies Meta<typeof ColorLegend>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    warning: 'Needs review',
    error: 'Broken link',
    showUpdatedAt: true,
  },
}

export const WarningsOnly: Story = {
  args: {
    warning: 'Needs review',
    showUpdatedAt: false,
  },
}
