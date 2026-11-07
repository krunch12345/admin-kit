import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { List } from '@mui/material'
import { MenuElement } from './MenuElement'

const meta = {
  title: 'Shell/MenuElement',
  component: MenuElement,
  tags: ['autodocs'],
} satisfies Meta<typeof MenuElement>

export default meta
type Story = StoryObj<typeof meta>

const Controlled = () => {
  const [drawerOpen, setDrawerOpen] = useState(true)

  return (
    <List sx={{ width: 240 }}>
      <MenuElement
        drawerOpen={drawerOpen}
        setDrawerOpen={setDrawerOpen}
        element={{ name: 'Item 1', path: '/item-1' }}
      />
      <MenuElement
        drawerOpen={drawerOpen}
        setDrawerOpen={setDrawerOpen}
        element={{ name: 'Item 2', path: '/item-2' }}
      />
      <MenuElement
        drawerOpen={drawerOpen}
        setDrawerOpen={setDrawerOpen}
        element={{ name: 'Item 3', path: '/item-3' }}
      />
    </List>
  )
}

export const Default: Story = {
  render: () => <Controlled />,
}
