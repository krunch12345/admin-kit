import type { Meta, StoryObj } from '@storybook/react'
import { OpenInNew } from '@mui/icons-material'
import { IconLink } from './IconLink'

const meta = {
  title: 'UI/IconLink',
  component: IconLink,
  tags: ['autodocs'],
} satisfies Meta<typeof IconLink>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    title: 'Open docs',
    href: 'https://example.com',
    icon: <OpenInNew fontSize='small' />,
    color: 'primary',
  },
}
