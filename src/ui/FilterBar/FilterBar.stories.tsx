import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { TextField } from '../TextField/TextField'
import { FilterBar } from './FilterBar'

const meta = {
  title: 'UI/FilterBar',
  component: FilterBar,
  tags: ['autodocs'],
} satisfies Meta<typeof FilterBar>

export default meta
type Story = StoryObj<typeof meta>

type Filters = {
  q: string
  status: string
}

const initFilters: Filters = { q: '', status: '' }

const Controlled = () => {
  const [filters, setFilters] = useState(initFilters)

  return (
    <FilterBar
      filters={filters}
      setFilters={setFilters}
      initFilters={initFilters}
      refetch={() => undefined}
    >
      <TextField
        label='Query'
        value={filters.q}
        onChange={(q) => setFilters((prev) => ({ ...prev, q }))}
      />
      <TextField
        label='Status'
        value={filters.status}
        onChange={(status) => setFilters((prev) => ({ ...prev, status }))}
      />
    </FilterBar>
  )
}

export const Default: Story = {
  render: () => <Controlled />,
}
