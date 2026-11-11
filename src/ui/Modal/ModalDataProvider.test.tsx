import { useContext, useState } from 'react'
import { describe, expect, it } from 'vitest'
import { act, render } from '@testing-library/react'
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
    let bumpRender: (() => void) | undefined

    const Harness = () => {
      const [, setTick] = useState(0)
      bumpRender = () => setTick((n) => n + 1)

      return (
        <ModalDataProvider>
          <Probe onValue={(value) => values.push(value)} />
        </ModalDataProvider>
      )
    }

    render(<Harness />)

    expect(values).toHaveLength(1)

    act(() => {
      bumpRender?.()
    })

    expect(values).toHaveLength(2)
    expect(values[1]).toBe(values[0])
  })
})
