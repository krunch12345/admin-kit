import type { Meta, StoryObj } from '@storybook/react'
import { StatusIndicators } from '../StatusIndicators/StatusIndicators'
import { ListItem } from './ListItem'

const meta = {
  title: 'UI/ListItem',
  component: ListItem,
  tags: ['autodocs'],
} satisfies Meta<typeof ListItem>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    itemId: 1,
    firstName: 'Alpha map',
    secondName: 'MAP-001',
    mainInfo: 'Europe',
    additionalInfo: 'draft',
    updatedAt: new Date().toISOString(),
    indicators: <StatusIndicators values={{ telegram: true, bluesky: false }} />,
  },
}

export const WithWarning: Story = {
  args: {
    itemId: 2,
    firstName: 'Beta map',
    warning: 'Missing cover',
  },
}

export const WithError: Story = {
  args: {
    itemId: 3,
    firstName: 'Gamma map',
    error: 'Invalid coordinates',
  },
}
