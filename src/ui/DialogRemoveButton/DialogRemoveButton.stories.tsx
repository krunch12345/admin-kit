import type { Meta, StoryObj } from '@storybook/react'
import { DialogRemoveButton } from './DialogRemoveButton'

const meta = {
  title: 'UI/DialogRemoveButton',
  component: DialogRemoveButton,
  tags: ['autodocs'],
} satisfies Meta<typeof DialogRemoveButton>

export default meta
type Story = StoryObj<typeof meta>

export const Icon: Story = {
  args: {
    name: 'Alpha map',
    nameObject: 'map',
    onRemove: () => undefined,
  },
}

export const TextButton: Story = {
  args: {
    name: 'Alpha map',
    nameObject: 'map',
    variant: 'text',
    onRemove: () => undefined,
  },
}
