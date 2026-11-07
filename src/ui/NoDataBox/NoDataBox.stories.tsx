import type { Meta, StoryObj } from '@storybook/react'
import { NoDataBox } from './NoDataBox'

const meta = {
  title: 'UI/NoDataBox',
  component: NoDataBox,
  tags: ['autodocs'],
} satisfies Meta<typeof NoDataBox>

export default meta
type Story = StoryObj<typeof meta>

export const MissingEntity: Story = {
  args: {
    noDataObject: 'map',
    id: '42',
  },
}

export const EmptyList: Story = {
  args: {
    noDataObject: 'No maps found',
    isListEmpty: true,
  },
}

export const Fetching: Story = {
  args: {
    noDataObject: 'map',
    isFetching: true,
  },
}
