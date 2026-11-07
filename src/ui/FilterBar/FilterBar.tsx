import { useEffect, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import { Badge, Box, IconButton, Stack, Tooltip } from '@mui/material'
import { ExpandLess, ExpandMore, FilterAltOff, Refresh } from '@mui/icons-material'
import { isEqual } from 'lodash-es'
import { countNonEmptyFilters } from './countNonEmptyFilters'
import type { FilterValues } from './countNonEmptyFilters'
import { useAdminKitMessages } from '../../locale/useAdminKitMessages'

export interface FilterBarProps<T extends FilterValues = FilterValues> {
  /** The content for wrapper. */
  children?: ReactNode
  /** The function for change filters. */
  setFilters: (filters: T) => void
  /** The init values of filters. */
  initFilters: T
  /** The values of filters. */
  filters: T
  /** The func for refetch data. */
  refetch: () => void
  /** The refetch disabled status. */
  isDisabledRefetch?: boolean
}

/**
 * Filter bar component.
 */
export const FilterBar = <T extends FilterValues = FilterValues>({
  children,
  setFilters,
  initFilters,
  filters,
  refetch,
  isDisabledRefetch,
}: FilterBarProps<T>) => {
  const messages = useAdminKitMessages()
  const [extended, setExtended] = useState(false)
  const [isWrapped, setIsWrapped] = useState(false)
  const [hiddenElements, setHiddenElements] = useState(0)

  const stackRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
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
    if (!container) {
      return
    }

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
    if (stackRef.current) {
      resizeObserver.observe(stackRef.current)
    }

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
      <Tooltip title={messages.filterBar.refreshData}>
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
        <Tooltip title={extended ? messages.filterBar.collapseFilters : messages.filterBar.showAllFilters}>
          <IconButton
            onClick={() => setExtended(!extended)}
            color='primary'
          >
            {extended ? <ExpandLess /> : <ExpandMore />}
          </IconButton>
        </Tooltip>
      )}

      <Box pr={2}>
        <Tooltip title={messages.filterBar.clearFilters}>
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
