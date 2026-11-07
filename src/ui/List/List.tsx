import { useRef } from 'react'
import type { ChangeEvent, ReactNode } from 'react'
import { Box, Pagination, Paper, Stack, Typography } from '@mui/material'
import { formatMessage } from '../../locale/formatMessage'
import { useAdminKitMessages } from '../../locale/useAdminKitMessages'

export interface ListPaginationData {
  count?: number
  totalPages?: number
}

export interface ListProps {
  /** Elements of list. */
  children?: ReactNode
  /** The pagination data. */
  paginationData?: ListPaginationData
  /** The current page. */
  page?: number
  /** The page change handler. */
  setPage?: (page: number) => void
  /** Optional controls between count and list items. */
  actions?: ReactNode
}

/**
 * Custom List component.
 */
export const List = ({ children, paginationData, page, setPage, actions = null }: ListProps) => {
  const messages = useAdminKitMessages()
  const topRef = useRef<HTMLDivElement>(null)

  const hasPagination = (paginationData?.totalPages ?? 0) > 1

  const handlePageChange = (_event: ChangeEvent<unknown>, value: number) => {
    setPage?.(value)
    topRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <Stack
      ref={topRef}
      spacing={2}
      width='100%'
      alignItems='center'
      position='relative'
      sx={{ scrollMarginTop: 80 }}
    >
      {paginationData && (
        <Typography variant='overline' color={theme => theme.palette.grey[500]}>
          {formatMessage(messages.list.total, { count: paginationData?.count || 0 })}
        </Typography>
      )}

      {actions && (
        <Stack direction='row' justifyContent='flex-end' width='100%'>
          {actions}
        </Stack>
      )}

      <Stack
        width='100%'
        flex={1}
        sx={{ pb: hasPagination ? '5rem' : 0 }}
      >
        {children}
      </Stack>

      {paginationData && hasPagination && (
        <Box component={Paper} position='absolute' bottom={5} p={1} elevation={3} sx={{ borderRadius: '30px' }}>
          <Pagination
            count={paginationData.totalPages}
            page={page}
            onChange={handlePageChange}
            color='primary'
            size='small'
            showFirstButton
            showLastButton
          />
        </Box>
      )}
    </Stack>
  )
}
