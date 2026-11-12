import { useContext, useState } from 'react'
import { describe, expect, it } from 'vitest'
import { act, render, screen } from '@testing-library/react'
import { ModalData } from './ModalData'
import type { ModalDataContextValue } from './ModalData'
import { ModalDataProvider } from './ModalDataProvider'

const Probe = ({ onValue }: { onValue: (value: ModalDataContextValue) => void }) => {
  const value = useContext(ModalData)
  onValue(value)
  return null
}

describe('ModalDataProvider', () => {
  it('keeps the same context value reference when modalData is unchanged', () => {
    const values: ModalDataContextValue[] = []

    const Harness = () => {
      const [, setTick] = useState(0)

      return (
        <ModalDataProvider>
          <button type='button' onClick={() => setTick((n) => n + 1)}>
            bump
          </button>
          <Probe onValue={(value) => values.push(value)} />
        </ModalDataProvider>
      )
    }

    render(<Harness />)

    expect(values).toHaveLength(1)

    act(() => {
      screen.getByRole('button', { name: 'bump' }).click()
    })

    expect(values).toHaveLength(2)
    expect(values[1]).toBe(values[0])
  })
})
