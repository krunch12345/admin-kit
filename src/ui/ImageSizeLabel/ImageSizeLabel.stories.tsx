import type { Meta, StoryObj } from '@storybook/react'
import { ImageSizeLabel } from './ImageSizeLabel'

const meta = {
  title: 'UI/ImageSizeLabel',
  component: ImageSizeLabel,
  tags: ['autodocs'],
} satisfies Meta<typeof ImageSizeLabel>

export default meta
type Story = StoryObj<typeof meta>

export const FromUrl: Story = {
  args: {
    src: 'https://picsum.photos/640/360',
  },
}
