import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { DateTimePicker } from './DateTimePicker'

const meta = {
  title: 'UI/DateTimePicker',
  component: DateTimePicker,
  tags: ['autodocs'],
} satisfies Meta<typeof DateTimePicker>

export default meta
type Story = StoryObj<typeof meta>

const Controlled = () => {
  const [value, setValue] = useState<Date | null>(new Date('2026-01-15T14:30:00'))

  return (
    <DateTimePicker
      label='Scheduled at'
      value={value}
      onChange={setValue}
    />
  )
}

export const Default: Story = {
  render: () => <Controlled />,
}
