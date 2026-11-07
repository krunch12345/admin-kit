import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { DatePicker } from './DatePicker'

const meta = {
  title: 'UI/DatePicker',
  component: DatePicker,
  tags: ['autodocs'],
} satisfies Meta<typeof DatePicker>

export default meta
type Story = StoryObj<typeof meta>

const Controlled = () => {
  const [value, setValue] = useState<Date | null>(new Date('2026-01-15'))

  return (
    <DatePicker
      label='Publish date'
      value={value}
      onChange={setValue}
    />
  )
}

export const Default: Story = {
  render: () => <Controlled />,
}
