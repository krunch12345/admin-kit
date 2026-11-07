import { useEffect } from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { Button, Stack } from '@mui/material'
import { useDispatch } from 'react-redux'
import { hideLoading, showLoading } from './showLoadingSlice'
import { Loading } from './Loading'

const meta = {
  title: 'UI/Loading',
  component: Loading,
  tags: ['autodocs'],
} satisfies Meta<typeof Loading>

export default meta
type Story = StoryObj<typeof meta>

const LoadingDemo = () => {
  const dispatch = useDispatch()

  return (
    <Stack spacing={2} direction='row'>
      <Button variant='contained' onClick={() => dispatch(showLoading())}>Show</Button>
      <Button variant='outlined' onClick={() => dispatch(hideLoading())}>Hide</Button>
    </Stack>
  )
}

export const Interactive: Story = {
  render: () => <LoadingDemo />,
}

export const Visible: Story = {
  render: () => {
    const VisibleLoading = () => {
      const dispatch = useDispatch()

      useEffect(() => {
        dispatch(showLoading())
        return () => {
          dispatch(hideLoading())
        }
      }, [dispatch])

      return null
    }

    return <VisibleLoading />
  },
}
