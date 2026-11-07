import type { Meta, StoryObj } from '@storybook/react'
import { UploadImage } from './UploadImage'

const meta = {
  title: 'UI/UploadImage',
  component: UploadImage,
  tags: ['autodocs'],
} satisfies Meta<typeof UploadImage>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    title: 'Upload cover',
    type: 'cover',
    folder: 'covers',
    setUrl: () => undefined,
    uploadFn: async () => ({
      succeeded: [{ url: 'https://picsum.photos/200' }],
      failed: [],
    }),
  },
}

export const MultipleWithMeta: Story = {
  args: {
    title: 'Upload gallery',
    type: 'gallery',
    multiple: true,
    withMeta: true,
    setUrl: () => undefined,
    uploadFn: async ({ files }) => ({
      succeeded: files.map((file, index) => ({
        url: `https://picsum.photos/200?i=${index}`,
        fileName: file.name,
      })),
      failed: [],
    }),
  },
}
