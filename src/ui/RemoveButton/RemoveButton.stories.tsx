import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { Typography } from '@mui/material'
import { RemoveButton } from './RemoveButton'

const meta = {
  title: 'UI/RemoveButton',
  component: RemoveButton,
  tags: ['autodocs'],
} satisfies Meta<typeof RemoveButton>

export default meta
type Story = StoryObj<typeof meta>

const Controlled = () => {
  const [data, setData] = useState([
    { id: 1, name: 'Alpha' },
    { id: 2, name: 'Beta' },
  ])

  return (
    <>
      <Typography mb={2}>{data.map((item) => item.name).join(', ') || '(empty)'}</Typography>
      <RemoveButton
        data={data}
        setNewData={setData}
        removeObject={data[0] || { id: 0, name: 'gone' }}
      />
    </>
  )
}

export const Default: Story = {
  render: () => <Controlled />,
}
