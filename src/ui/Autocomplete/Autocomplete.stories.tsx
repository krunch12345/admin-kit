import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { Autocomplete } from './Autocomplete'
import type { AutocompleteOption } from './Autocomplete'

const options: AutocompleteOption[] = [
  { id: 1, name: 'Alpha' },
  { id: 2, name: 'Beta' },
  { id: 3, name: 'Gamma' },
]

const meta = {
  title: 'UI/Autocomplete',
  component: Autocomplete,
  tags: ['autodocs'],
} satisfies Meta<typeof Autocomplete>

export default meta
type Story = StoryObj<typeof meta>

const Controlled = () => {
  const [value, setValue] = useState<AutocompleteOption | null>(null)
  const [inputValue, setInputValue] = useState('')

  return (
    <Autocomplete
      label='City'
      options={options}
      value={value}
      onChange={(_e, next) => setValue(next)}
      inputValue={inputValue}
      onInputChange={(_e, next) => setInputValue(next)}
      getOptionLabel={(option) => option.name || ''}
      isOptionEqualToValue={(a, b) => a.id === b.id}
      sx={{ minWidth: 280 }}
    />
  )
}

export const Default: Story = {
  args: {
    label: 'City',
    options,
  },
  render: () => <Controlled />,
}
