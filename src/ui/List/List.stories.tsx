import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { ListItem } from '../ListItem/ListItem'
import { List } from './List'

const meta = {
  title: 'UI/List',
  component: List,
  tags: ['autodocs'],
} satisfies Meta<typeof List>

export default meta
type Story = StoryObj<typeof meta>

const Controlled = () => {
  const [page, setPage] = useState(1)

  return (
    <List
      page={page}
      setPage={setPage}
      paginationData={{ count: 42, totalPages: 5 }}
    >
      <ListItem itemId={1} firstName='Alpha' secondName='MAP-001' />
      <ListItem itemId={2} firstName='Beta' secondName='MAP-002' warning='Needs review' />
      <ListItem itemId={3} firstName='Gamma' secondName='MAP-003' error='Broken' />
    </List>
  )
}

export const Default: Story = {
  render: () => <Controlled />,
}
