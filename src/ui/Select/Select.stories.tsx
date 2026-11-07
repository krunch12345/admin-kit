import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { MenuItem } from '@mui/material'
import { Select } from './Select'

const meta = {
  title: 'UI/Select',
  component: Select,
  tags: ['autodocs'],
} satisfies Meta<typeof Select>

export default meta
type Story = StoryObj<typeof meta>

const ControlledSelect = () => {
  const [value, setValue] = useState('a')

  return (
    <Select id='status' label='Status' value={value} setValue={setValue}>
      <MenuItem value='a'>Active</MenuItem>
      <MenuItem value='b'>Draft</MenuItem>
      <MenuItem value='c'>Archived</MenuItem>
    </Select>
  )
}

export const Default: Story = {
  args: {
    id: 'status',
    label: 'Status',
    value: '',
    setValue: () => undefined,
  },
  render: () => <ControlledSelect />,
}
