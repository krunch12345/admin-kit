import type { Meta, StoryObj } from '@storybook/react'
import { EditControls } from './EditControls'

const meta = {
  title: 'UI/EditControls',
  component: EditControls,
  tags: ['autodocs'],
} satisfies Meta<typeof EditControls>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    name: 'Sample item',
    cancelOnClick: () => undefined,
    saveOnClick: () => undefined,
    removeOnClick: () => undefined,
    changedFieldLabels: ['Title', 'Slug'],
  },
}

export const AddNew: Story = {
  args: {
    name: 'New item',
    isAddNew: true,
    cancelOnClick: () => undefined,
    saveOnClick: () => undefined,
  },
}
