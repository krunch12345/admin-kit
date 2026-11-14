import { useState } from 'react'
import type { ComponentProps } from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { Stack, TextField as MuiTextField } from '@mui/material'
import { SlugField } from './SlugField'

const meta = {
  title: 'UI/SlugField',
  component: SlugField,
  tags: ['autodocs'],
} satisfies Meta<typeof SlugField>

export default meta
type Story = StoryObj<typeof meta>

const ControlledSlugField = (args: ComponentProps<typeof SlugField>) => {
  const [value, setValue] = useState(args.value ?? '')
  const [sourceName, setSourceName] = useState(args.sourceName ?? '')

  return (
    <Stack spacing={2} maxWidth={480}>
      <MuiTextField
        size='small'
        label='Name'
        value={sourceName}
        onChange={(event) => setSourceName(event.target.value)}
      />
      <SlugField
        {...args}
        sourceName={sourceName}
        value={value}
        onChange={setValue}
      />
    </Stack>
  )
}

export const Default: Story = {
  args: {
    value: '',
    onChange: () => undefined,
    sourceName: '',
  },
  render: (args) => <ControlledSlugField {...args} />,
}

export const FromRussianName: Story = {
  args: {
    value: '',
    onChange: () => undefined,
    sourceName: 'Город Кутежа',
  },
  render: (args) => <ControlledSlugField {...args} />,
}

export const ManualEditLocked: Story = {
  args: {
    value: 'custom-slug',
    onChange: () => undefined,
    sourceName: 'Entity Name',
    defaultIsManual: true,
  },
  render: (args) => <ControlledSlugField {...args} />,
}
