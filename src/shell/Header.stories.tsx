import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { Box, Typography } from '@mui/material'
import { Header } from './Header'
import { Drawer } from './Drawer'

const meta = {
  title: 'Shell/Header',
  component: Header,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    authenticated: true,
    docs: {
      story: {
        inline: false,
        iframeHeight: 360,
      },
    },
  },
} satisfies Meta<typeof Header>

export default meta
type Story = StoryObj<typeof meta>

const DEMO_MENU = [
  { name: 'Item 1', path: '/item-1' },
  { name: 'Item 2', path: '/item-2' },
  { name: 'Item 3', path: '/item-3' },
]

const HeaderDemo = () => {
  const [drawerOpen, setDrawerOpen] = useState(false)

  return (
    <Box minHeight={320} position='relative'>
      <Header
        appTitle='Admin Kit'
        drawerOpen={drawerOpen}
        setDrawerOpen={setDrawerOpen}
        showInvalidateCache
        onInvalidateCache={async () => undefined}
      />
      <Drawer
        drawerOpen={drawerOpen}
        setDrawerOpen={setDrawerOpen}
        menu={DEMO_MENU}
      />
      <Box component='main' sx={{ pt: 10, px: 3 }}>
        <Typography color='text.secondary'>
          Open the burger menu to show the drawer. Close it with the chevron or Escape.
        </Typography>
      </Box>
    </Box>
  )
}

export const Default: Story = {
  args: {
    appTitle: 'Admin Kit',
    drawerOpen: false,
    setDrawerOpen: () => undefined,
    showInvalidateCache: true,
  },
  render: () => <HeaderDemo />,
}
