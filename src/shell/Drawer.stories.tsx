import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { Box, IconButton, Typography } from '@mui/material'
import { Menu } from '@mui/icons-material'
import { Drawer } from './Drawer'

const meta = {
  title: 'Shell/Drawer',
  component: Drawer,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: {
      story: {
        inline: false,
        iframeHeight: 420,
      },
    },
  },
} satisfies Meta<typeof Drawer>

export default meta
type Story = StoryObj<typeof meta>

const DEMO_MENU = [
  { name: 'Item 1', path: '/item-1' },
  { name: 'Item 2', path: '/item-2' },
  { name: 'Item 3', path: '/item-3' },
]

const DrawerDemo = ({ initiallyOpen = false }: { initiallyOpen?: boolean }) => {
  const [drawerOpen, setDrawerOpen] = useState(initiallyOpen)

  return (
    <Box minHeight={400} position='relative'>
      {!drawerOpen && (
        <IconButton
          color='inherit'
          aria-label='Open menu'
          onClick={() => setDrawerOpen(true)}
          edge='start'
          sx={{ m: 1 }}
        >
          <Menu />
        </IconButton>
      )}

      <Drawer
        drawerOpen={drawerOpen}
        setDrawerOpen={setDrawerOpen}
        menu={DEMO_MENU}
      />

      <Box component='main' sx={{ pt: 2, px: 3, pl: drawerOpen ? 34 : 3 }}>
        <Typography color='text.secondary'>
          Use the burger icon to open the drawer. Close it with the chevron or Escape.
        </Typography>
      </Box>
    </Box>
  )
}

export const Default: Story = {
  args: {
    drawerOpen: false,
    setDrawerOpen: () => undefined,
    menu: DEMO_MENU,
  },
  render: () => <DrawerDemo />,
}
