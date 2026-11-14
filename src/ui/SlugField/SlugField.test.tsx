import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useState } from 'react'
import { AdminKitProvider } from '../../locale/AdminKitProvider'
import { createStorybookHooks } from '../../../.storybook/mockHooks'
import { SlugField } from './SlugField'

const Harness = ({
  initialSlug = '',
  initialName = '',
  defaultIsManual = false,
}: {
  initialSlug?: string
  initialName?: string
  defaultIsManual?: boolean
}) => {
  const [slug, setSlug] = useState(initialSlug)
  const [name, setName] = useState(initialName)

  return (
    <AdminKitProvider hooks={createStorybookHooks()}>
      <label>
        Name
        <input
          aria-label='source-name'
          value={name}
          onChange={(event) => setName(event.target.value)}
        />
      </label>
      <SlugField
        value={slug}
        onChange={setSlug}
        sourceName={name}
        defaultIsManual={defaultIsManual}
      />
      <output aria-label='slug-value'>{slug}</output>
    </AdminKitProvider>
  )
}

describe('SlugField', () => {
  it('auto-updates slug from source name when not manually edited', async () => {
    const user = userEvent.setup()
    render(<Harness />)

    await user.type(screen.getByLabelText('source-name'), 'Hello World')

    expect(screen.getByLabelText('slug-value')).toHaveTextContent('hello-world')
  })

  it('does not overwrite slug after manual edit when name changes', async () => {
    const user = userEvent.setup()
    render(<Harness initialName='Hello' initialSlug='hello' />)

    const slugInput = screen.getByRole('textbox', { name: /slug/i })
    await user.clear(slugInput)
    await user.type(slugInput, 'custom-slug')

    await user.type(screen.getByLabelText('source-name'), ' World')

    expect(screen.getByLabelText('slug-value')).toHaveTextContent('custom-slug')
  })

  it('regenerates slug from current name and locks further auto updates', async () => {
    const user = userEvent.setup()
    render(<Harness initialName='Old Name' initialSlug='custom' defaultIsManual />)

    await user.click(screen.getByRole('button', { name: /generate slug from name/i }))

    expect(screen.getByLabelText('slug-value')).toHaveTextContent('old-name')

    await user.type(screen.getByLabelText('source-name'), ' Extra')

    expect(screen.getByLabelText('slug-value')).toHaveTextContent('old-name')
  })

  it('clears slug and treats clear as a manual edit', async () => {
    const user = userEvent.setup()
    const onIsManualChange = vi.fn()

    const ClearHarness = () => {
      const [slug, setSlug] = useState('hello-world')
      const [name, setName] = useState('Hello World')

      return (
        <AdminKitProvider hooks={createStorybookHooks()}>
          <label>
            Name
            <input
              aria-label='source-name'
              value={name}
              onChange={(event) => setName(event.target.value)}
            />
          </label>
          <SlugField
            value={slug}
            onChange={setSlug}
            sourceName={name}
            onIsManualChange={onIsManualChange}
          />
          <output aria-label='slug-value'>{slug}</output>
        </AdminKitProvider>
      )
    }

    render(<ClearHarness />)

    await user.click(screen.getByRole('button', { name: /clear/i }))

    expect(screen.getByLabelText('slug-value')).toHaveTextContent('')
    expect(onIsManualChange).toHaveBeenCalledWith(true)

    await user.type(screen.getByLabelText('source-name'), '!')

    expect(screen.getByLabelText('slug-value')).toHaveTextContent('')
  })

  it('transliterates cyrillic source names', async () => {
    const user = userEvent.setup()
    render(<Harness />)

    await user.type(screen.getByLabelText('source-name'), 'Город Кутежа')

    expect(screen.getByLabelText('slug-value')).toHaveTextContent('gorod-kutezha')
  })
})
