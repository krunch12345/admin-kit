import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { DateRangePicker } from './DateRangePicker'

const meta = {
  title: 'UI/DateRangePicker',
  component: DateRangePicker,
  tags: ['autodocs'],
} satisfies Meta<typeof DateRangePicker>

export default meta
type Story = StoryObj<typeof meta>

type Filters = {
  startDate: Date | null
  endDate: Date | null
}

const Controlled = () => {
  const [filters, setFilters] = useState<Filters>({
    startDate: new Date('2026-01-01'),
    endDate: new Date('2026-01-31'),
  })

  return (
    <DateRangePicker
      filters={filters}
      setFilters={setFilters}
    />
  )
}

export const Default: Story = {
  render: () => <Controlled />,
}
