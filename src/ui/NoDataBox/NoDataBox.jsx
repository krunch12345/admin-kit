import { Box, Button, Skeleton, Stack, Typography } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import PropTypes from 'prop-types'
import { formatMessage } from '../../locale/formatMessage.js'
import { useAdminKitMessages } from '../../locale/useAdminKitMessages.js'

/**
 * @typedef {object} IProps
 * @property {boolean} [isFetching] - The content for wrapper.
 * @property {string} noDataObject - The Object of data or empty-list message.
 * @property {string} [id] - The ID of Object.
 * @property {boolean} [isListEmpty] - When true, shows noDataObject as the full message.
 */

/**
 * No data box component.
 * @type {React.FC<IProps>}
 * @returns {React.ReactElement} The No data box components.
 */
export const NoDataBox = ({
  isFetching,
  noDataObject,
  id,
  isListEmpty = false,
}) => {
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

NoDataBox.propTypes = {
  isFetching: PropTypes.bool,
  noDataObject: PropTypes.string.isRequired,
  id: PropTypes.string,
  isListEmpty: PropTypes.bool,
}
