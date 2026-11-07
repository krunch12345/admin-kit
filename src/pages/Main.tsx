import { createElement, isValidElement, useContext, useEffect, useMemo } from 'react'
import type { ElementType, ReactNode } from 'react'
import { Box, Stack } from '@mui/material'
import { ModalData } from '../ui/Modal/ModalData'
import { useScreen } from '../hooks/useScreen'

const isElementType = (value: unknown): value is ElementType => (
  typeof value === 'function'
  || (
    typeof value === 'object'
    && value !== null
    && !Array.isArray(value)
    && !isValidElement(value)
    && '$$typeof' in value
  )
)

export interface MainProps {
  /** Logo node or image source url. */
  logo?: ReactNode
  /** Search component type or ready element. */
  SearchComponent?: ElementType | ReactNode
}

/**
 * Main page component.
 */
export const Main = ({ logo, SearchComponent }: MainProps) => {
  const { setModalData } = useContext(ModalData)
  const { isMaxWidth600, isMaxWidth900 } = useScreen()

  useEffect(() => {
    setModalData({ open: false })
  }, [setModalData])

  const width = useMemo(() => {
    if (isMaxWidth600) {
      return '80%'
    } else if (isMaxWidth900) {
      return '40%'
    } else {
      return '30%'
    }
  }, [isMaxWidth900, isMaxWidth600])

  const logoElement = typeof logo === 'string'
    ? <img src={logo} alt='logo' width={width} />
    : logo

  const searchElement = isElementType(SearchComponent)
    ? createElement(SearchComponent)
    : SearchComponent

  return (
    <Stack width='100%' justifyContent='center' alignItems='center' flex={1} spacing={10}>
      {logoElement}

      {searchElement && (
        <Box width='100%'>
          {searchElement}
        </Box>
      )}
    </Stack>
  )
}
