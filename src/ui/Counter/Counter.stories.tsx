import type { Meta, StoryObj } from '@storybook/react'
import { Counter } from './Counter'

const meta = {
  title: 'UI/Counter',
  component: Counter,
  tags: ['autodocs'],
} satisfies Meta<typeof Counter>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    value: 'Hello',
    effectiveMaxLength: 20,
  },
}

export const NearLimit: Story = {
  args: {
    value: 'Almost at the limit!!',
    effectiveMaxLength: 20,
  },
}

export const WithClear: Story = {
  args: {
    value: 'Clearable',
    effectiveMaxLength: 40,
    isOnClear: true,
  },
}
