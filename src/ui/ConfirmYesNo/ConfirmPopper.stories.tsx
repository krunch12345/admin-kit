import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { Button } from '@mui/material'
import { ConfirmPopper } from './ConfirmPopper'

const meta = {
  title: 'UI/ConfirmPopper',
  component: ConfirmPopper,
  tags: ['autodocs'],
} satisfies Meta<typeof ConfirmPopper>

export default meta
type Story = StoryObj<typeof meta>

const Demo = () => {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null)
  const [open, setOpen] = useState(false)

  return (
    <>
      <Button
        variant='contained'
        onClick={(e) => {
          setAnchorEl(e.currentTarget)
          setOpen(true)
        }}
      >
        Open confirm
      </Button>
      <ConfirmPopper
        open={open}
        anchorEl={anchorEl}
        message='Delete this item?'
        onClose={() => setOpen(false)}
        onConfirm={() => setOpen(false)}
      />
    </>
  )
}

export const Default: Story = {
  args: {
    open: false,
    message: 'Confirm?',
    onClose: () => undefined,
    onConfirm: () => undefined,
  },
  render: () => <Demo />,
}
