import { useCallback, useContext, useEffect } from 'react'
import { Box } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { NotFoundModal } from './NotFoundModal.jsx'
import { ModalData } from '../ui/Modal/ModalData.js'
import { useLoading } from '../hooks/useLoading.js'
import { useAdminKitMessages } from '../locale/useAdminKitMessages.js'

/**
 * Page Not Found component.
 * @type {React.FC}
 * @returns {React.ReactElement} The Page Not Found.
 */
export const NotFound = () => {
  const messages = useAdminKitMessages()
  const { setModalData, closeModal } = useContext(ModalData)

  const navigate = useNavigate()

  const onSubmit = useCallback(
    () => {
      navigate('/')
      closeModal()
    }, [closeModal, navigate]
  )

  useEffect(
    () => {
      setModalData({
        open: true,
        title: messages.notFound.title,
        isActions: true,
        titleSubmit: messages.notFound.titleSubmit,
        onSubmit,
        maxWidth: 'sm',
        children: <NotFoundModal />,
      })
    },
    [messages.notFound.title, messages.notFound.titleSubmit, onSubmit, setModalData]
  )

  useLoading(false)

  return (
    <Box width='100rem' height='100vh'>
      <Box position='absolute' top={0} left={0} width='100%' height='100%' />
    </Box>
  )
}
