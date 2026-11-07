import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { IsBooleanSelect } from './IsBooleanSelect'

const meta = {
  title: 'UI/IsBooleanSelect',
  component: IsBooleanSelect,
  tags: ['autodocs'],
} satisfies Meta<typeof IsBooleanSelect>

export default meta
type Story = StoryObj<typeof meta>

const Controlled = () => {
  const [value, setValue] = useState(0)

  return (
    <IsBooleanSelect
      value={value}
      setValue={setValue}
      label='Published'
      menuItems={['All', 'Yes', 'No']}
    />
  )
}

export const Default: Story = {
  args: {
    value: 0,
    setValue: () => undefined,
    menuItems: ['All', 'Yes', 'No'],
    label: 'Published',
  },
  render: () => <Controlled />,
}
