import type { Meta, StoryObj } from '@storybook/react'
import { ConfirmYesNoActions } from './ConfirmYesNoActions'

const meta = {
  title: 'UI/ConfirmYesNoActions',
  component: ConfirmYesNoActions,
  tags: ['autodocs'],
} satisfies Meta<typeof ConfirmYesNoActions>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    onNo: () => undefined,
    onYes: () => undefined,
  },
}
