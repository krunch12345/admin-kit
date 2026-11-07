import { useState } from 'react'
import type { ComponentProps } from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { TextField } from './TextField'

const meta = {
  title: 'UI/TextField',
  component: TextField,
  tags: ['autodocs'],
} satisfies Meta<typeof TextField>

export default meta
type Story = StoryObj<typeof meta>

const ControlledTextField = (args: ComponentProps<typeof TextField>) => {
  const [value, setValue] = useState(args.value ?? '')

  return <TextField {...args} value={value} onChange={setValue} onClear={() => setValue('')} />
}

export const Default: Story = {
  args: {
    label: 'Name',
    value: '',
    onChange: () => undefined,
  },
  render: (args) => <ControlledTextField {...args} />,
}

export const WithValue: Story = {
  args: {
    label: 'Email',
    value: 'admin@example.com',
    onChange: () => undefined,
  },
  render: (args) => <ControlledTextField {...args} />,
}

export const Debounced: Story = {
  args: {
    label: 'Search',
    value: '',
    debounceMs: 400,
    onChange: () => undefined,
  },
  render: (args) => <ControlledTextField {...args} />,
}
