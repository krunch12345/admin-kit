import type { Meta, StoryObj } from '@storybook/react'
import { CropControls } from './CropControls'

const meta = {
  title: 'UI/CropControls',
  component: CropControls,
  tags: ['autodocs'],
} satisfies Meta<typeof CropControls>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    imageSrc: 'https://picsum.photos/800/600',
    fileName: 'demo.jpg',
    onCropped: () => undefined,
    onRemove: () => undefined,
  },
}
