import { useContext, useEffect } from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { Button, Typography } from '@mui/material'
import { ModalData } from './ModalData'
import { Modal } from './Modal'

const meta = {
  title: 'UI/Modal',
  component: Modal,
  tags: ['autodocs'],
} satisfies Meta<typeof Modal>

export default meta
type Story = StoryObj<typeof meta>

const OpenModalButton = () => {
  const { setModalData, closeModal } = useContext(ModalData)

  return (
    <Button
      variant='contained'
      onClick={() => setModalData({
        open: true,
        title: 'Edit item',
        isActions: true,
        titleSubmit: 'Save',
        children: <Typography>Modal body content</Typography>,
        onSubmit: () => closeModal(),
        onCancel: () => closeModal(),
      })}
    >
      Open modal
    </Button>
  )
}

export const Interactive: Story = {
  render: () => <OpenModalButton />,
}

export const Preopened: Story = {
  render: () => {
    const Preopen = () => {
      const { setModalData, closeModal } = useContext(ModalData)

      useEffect(() => {
        setModalData({
          open: true,
          title: 'Confirm',
          isActions: true,
          shouldConfirmClose: true,
          children: <Typography>Close will ask for confirmation</Typography>,
          onSubmit: () => closeModal(),
        })
      }, [closeModal, setModalData])

      return null
    }

    return <Preopen />
  },
}
