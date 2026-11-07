import type { Meta, StoryObj } from '@storybook/react'
import { CopyButton } from './CopyButton'

const meta = {
  title: 'UI/CopyButton',
  component: CopyButton,
  tags: ['autodocs'],
} satisfies Meta<typeof CopyButton>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    text: 'https://example.com/share',
    title: 'Copy link',
  },
}
