import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { OtpCodeInputs } from './OtpCodeInputs'

const meta = {
  title: 'UI/OtpCodeInputs',
  component: OtpCodeInputs,
  tags: ['autodocs'],
} satisfies Meta<typeof OtpCodeInputs>

export default meta
type Story = StoryObj<typeof meta>

const Controlled = () => {
  const [code, setCode] = useState('')

  return (
    <OtpCodeInputs
      length={6}
      value={code}
      onChange={setCode}
    />
  )
}

export const Default: Story = {
  render: () => <Controlled />,
}
