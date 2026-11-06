import { useRef } from 'react'
import { Box, Pagination, Paper, Stack, Typography } from '@mui/material'
import PropTypes from 'prop-types'

/**
 * @typedef {object} IProps
 * @property {React.ReactNode} children - Elements of list.
 * @property {Pagination} [paginationData] - The pagination data.
 * @property {number} [page] - The pagination data.
 * @property {function} [setPage] - The pagination data.
 * @property {React.ReactNode} [actions] - Optional controls between count and list items.
 */

/**
 * Custom List component.
 * @type {React.FC<IProps>}
 * @returns {React.ReactElement} The custom List component.
 */
export const List = ({ children, paginationData, page, setPage, actions = null }) => {
  const topRef = useRef(null)

  const handlePageChange = (_event, value) => {
    setPage(value)
    topRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <Stack
      ref={topRef}
      spacing={2}
      width='100%'
      alignItems='center'
      sx={{ scrollMarginTop: 80 }}
    >
      {paginationData && (
        <Typography variant='overline' color={theme => theme.palette.grey[500]}>
          Всего: {paginationData?.count || 0}
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
        sx={{ pb: paginationData?.totalPages > 1 ? '5rem' : 0 }}
      >
        {children}
      </Stack>

      {paginationData?.totalPages > 1 && (
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

List.propTypes = {
  children: PropTypes.node.isRequired,
  paginationData: PropTypes.object,
  page: PropTypes.number,
  setPage: PropTypes.func,
  actions: PropTypes.node,
}
