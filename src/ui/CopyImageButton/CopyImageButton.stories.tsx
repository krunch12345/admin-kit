import type { Meta, StoryObj } from '@storybook/react'
import { CopyImageButton } from './CopyImageButton'

const meta = {
  title: 'UI/CopyImageButton',
  component: CopyImageButton,
  tags: ['autodocs'],
} satisfies Meta<typeof CopyImageButton>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    url: 'https://picsum.photos/200',
  },
}
