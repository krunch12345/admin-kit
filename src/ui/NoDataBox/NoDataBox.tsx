import { Box, Button, Skeleton, Stack, Typography } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { formatMessage } from '../../locale/formatMessage'
import { useAdminKitMessages } from '../../locale/useAdminKitMessages'

export interface NoDataBoxProps {
  /** Shows a skeleton while data is being fetched. */
  isFetching?: boolean
  /** The Object of data or empty-list message. */
  noDataObject: string
  /** The ID of Object. */
  id?: string
  /** When true, shows noDataObject as the full message. */
  isListEmpty?: boolean
}

/**
 * No data box component.
 */
export const NoDataBox = ({
  isFetching,
  noDataObject,
  id,
  isListEmpty = false,
}: NoDataBoxProps) => {
  const messages = useAdminKitMessages()
  const navigate = useNavigate()

  const missingMessage = formatMessage(messages.noDataBox.missingInDb, {
    noDataObject,
    idPart: id ? formatMessage(messages.noDataBox.idPart, { id }) : '',
  })

  return (
    <Box
      display='flex'
      height={isListEmpty ? 'auto' : '100%'}
      width='100%'
      alignItems='center'
      justifyContent='center'
      p={2}
    >
      {isFetching ? (
        <Skeleton
          variant='rectangular'
          width={isListEmpty ? '100%' : '90vw'}
          height={isListEmpty ? '4rem' : '60vh'}
        />
      ) : (
        <Stack alignItems='center' spacing={2}>
          <Stack direction='row' spacing={1} alignItems='center'>
            <Typography>
              {isListEmpty
                ? noDataObject
                : missingMessage}
            </Typography>
          </Stack>

          {!isListEmpty && (
            <Button variant='contained' onClick={() => navigate('/')}>
              {messages.noDataBox.goHome}
            </Button>
          )}
        </Stack>
      )}
    </Box>
  )
}
