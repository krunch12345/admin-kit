import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { ImageMetaFields } from './ImageMetaFields'
import type { ImageMetaValues } from './ImageMetaFields'

const meta = {
  title: 'UI/ImageMetaFields',
  component: ImageMetaFields,
  tags: ['autodocs'],
} satisfies Meta<typeof ImageMetaFields>

export default meta
type Story = StoryObj<typeof meta>

const Controlled = () => {
  const [values, setValues] = useState<ImageMetaValues>({
    name: 'Cover',
    nameEN: 'Cover',
    description: '',
    descriptionEN: '',
  })

  return (
    <ImageMetaFields
      values={values}
      onChange={(patch) => setValues((prev) => ({ ...prev, ...patch }))}
    />
  )
}

export const Default: Story = {
  render: () => <Controlled />,
}
