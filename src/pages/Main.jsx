import { createElement, isValidElement, useContext, useEffect, useMemo } from 'react'
import PropTypes from 'prop-types'
import { Box, Stack } from '@mui/material'
import { ModalData } from '../ui/Modal/ModalData.js'
import { useScreen } from '../hooks/useScreen.js'

/**
 * @typedef {object} IProps
 * @property {React.ReactNode} [logo] - Logo node or image source url.
 * @property {React.ElementType | React.ReactNode} [SearchComponent] - Search component type or ready element.
 */

/**
 * Main page component.
 * @type {React.FC<IProps>}
 * @returns {React.ReactElement} The Main page component.
 */
export const Main = ({ logo, SearchComponent }) => {
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

  const searchElement = SearchComponent && !isValidElement(SearchComponent) && typeof SearchComponent !== 'string'
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

Main.propTypes = {
  logo: PropTypes.node,
  SearchComponent: PropTypes.oneOfType([PropTypes.elementType, PropTypes.node]),
}
