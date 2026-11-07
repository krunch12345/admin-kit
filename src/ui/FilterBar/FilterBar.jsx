import { useEffect, useRef, useState } from 'react'
import PropTypes from 'prop-types'
import { Badge, Box, IconButton, Stack, Tooltip } from '@mui/material'
import { ExpandLess, ExpandMore, FilterAltOff, Refresh } from '@mui/icons-material'
import { isEqual } from 'lodash-es'
import { countNonEmptyFilters } from './countNonEmptyFilters.js'
import { useAdminKitMessages } from '../../locale/useAdminKitMessages.js'

/**
 * @typedef {object} IProps
 * @property {ReactNode} children - The content for wrapper.
 * @property {function} setFilters - The function for change filters.
 * @property {Object} initFilters - The init values of filters.
 * @property {Object} filters - The values of filters.
 * @property {function} refetch - The func for refetch data.
 * @property {boolean} [isDisabledRefetch] - The refetch disabled status.
 */

/**
 * Filter bar component.
 * @type {React.FC<IProps>}
 * @returns {React.ReactElement} The Filter bar component.
 */
export const FilterBar = ({ children, setFilters, initFilters, filters, refetch, isDisabledRefetch }) => {
  const m = useAdminKitMessages()
  const [extended, setExtended] = useState(false)
  const [isWrapped, setIsWrapped] = useState(false)
  const [hiddenElements, setHiddenElements] = useState(0)

  const stackRef = useRef(null)

  useEffect(() => {
    const observer = new ResizeObserver((entries) => {
      for (let entry of entries) {
        // Compare container height with a single row height
        const isContentWrapped = entry.contentRect.height > 56 // 56px — one row height
        setIsWrapped(isContentWrapped)
      }
    })

    if (stackRef.current) {
      observer.observe(stackRef.current)
    }

    return () => {
      observer.disconnect()
    }
  }, [])

  const checkHiddenElements = () => {
    const container = stackRef.current
    const children = Array.from(container.children)
    const containerRect = container.getBoundingClientRect()

    const hidden = children.filter(child => {
      const childRect = child.getBoundingClientRect()
      return (
        childRect.bottom > containerRect.bottom ||
        childRect.right > containerRect.right ||
        childRect.top < containerRect.top ||
        childRect.left < containerRect.left
      )
    }).length

    setHiddenElements(hidden)
  }

  useEffect(() => {
    const resizeObserver = new ResizeObserver(checkHiddenElements)
    resizeObserver.observe(stackRef.current)

    return () => resizeObserver.disconnect()
  }, [])

  const isDisabledClearFilters = isEqual(initFilters, filters)

  const showExpandButton = !!hiddenElements || isWrapped

  const countFilters = countNonEmptyFilters(filters, initFilters)

  return (
    <Stack
      ref={stackRef}
      direction='row'
      spacing={0}
      width='100%'
      alignItems='center'
      alignContent='flex-start'
      flexWrap='wrap'
      maxHeight={extended ? 'fit-content' : '3.5rem'}
      overflow={extended ? 'auto' : 'hidden'}
    >
      <Tooltip title={m.filterBar.refreshData}>
        <div>
          <IconButton
            onClick={refetch}
            color='primary'
            disabled={isDisabledRefetch}
          >
            <Refresh />
          </IconButton>
        </div>
      </Tooltip>

      {showExpandButton && (
        <Tooltip title={extended ? m.filterBar.collapseFilters : m.filterBar.showAllFilters}>
          <IconButton
            onClick={() => setExtended(!extended)}
            color='primary'
          >
            {extended ? <ExpandLess /> : <ExpandMore />}
          </IconButton>
        </Tooltip>
      )}

      <Box pr={2}>
        <Tooltip title={m.filterBar.clearFilters}>
          <Badge color='error' badgeContent={countFilters}>
            <div>
              <IconButton
                size='small'
                onClick={() => setFilters(initFilters)}
                color='error'
                disabled={isDisabledClearFilters}
              >
                <FilterAltOff fontSize='medium' />
              </IconButton>
            </div>
          </Badge>
        </Tooltip>
      </Box>

      {children}
    </Stack>
  )
}

FilterBar.propTypes = {
  children: PropTypes.node.isRequired,
  setFilters: PropTypes.func.isRequired,
  initFilters: PropTypes.object.isRequired,
  filters: PropTypes.object.isRequired,
  refetch: PropTypes.func.isRequired,
  isDisabledRefetch: PropTypes.bool,
}
