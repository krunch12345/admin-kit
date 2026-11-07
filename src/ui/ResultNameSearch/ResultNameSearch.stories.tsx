import type { Meta, StoryObj } from '@storybook/react'
import { Typography } from '@mui/material'
import { ResultNameSearch } from './ResultNameSearch'

const meta = {
  title: 'UI/ResultNameSearch',
  component: ResultNameSearch,
  tags: ['autodocs'],
} satisfies Meta<typeof ResultNameSearch>

export default meta
type Story = StoryObj<typeof meta>

export const WithResults: Story = {
  args: {
    count: 2,
    children: (
      <>
        <Typography>Alpha</Typography>
        <Typography>Beta</Typography>
      </>
    ),
  },
}

export const Empty: Story = {
  args: {
    count: 0,
    children: null,
  },
}
