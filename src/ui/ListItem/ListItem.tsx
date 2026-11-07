import { useMemo } from 'react'
import type { ReactNode } from 'react'
import { ListItemButton, Stack, Typography } from '@mui/material'
import { FaCircle } from 'react-icons/fa'
import { red, yellow } from '@mui/material/colors'
import { trimText } from '../../utils/trimText'
import { useScreen } from '../../hooks/useScreen'
import { UpdatedAtInfo } from '../UpdatedAtInfo/UpdatedAtInfo'
import { getListItemDomId } from '../../utils/listPosition'

export interface ListItemProps {
  /** Entity id for scroll restoration. */
  itemId?: string | number
  /** The first info about object. */
  firstName: ReactNode
  /** The second info about object. */
  secondName?: string
  /** The handle on click. */
  onClick?: () => void
  /** The yellow status with text about object. */
  warning?: string
  /** The red status with text about object. */
  error?: string
  /** The main info about object. */
  mainInfo?: string
  /** The additional info about object. */
  additionalInfo?: string
  /** The color of additional info about object. */
  additionalInfoColor?: string
  /** The uppercase status of additional info about object. */
  additionalInfoUpper?: boolean
  /** Disabled status for ListItemButton. */
  disabled?: boolean
  /** ISO date string of the last update. */
  updatedAt?: string
  /** Indicators rendered below updatedAt. */
  indicators?: ReactNode
  /** The function button. */
  functionButton?: ReactNode
}

/**
 * Custom List item component.
 */
export const ListItem = ({
  onClick = () => null,
  itemId,
  firstName,
  secondName,
  warning,
  error,
  mainInfo,
  additionalInfo,
  additionalInfoColor,
  additionalInfoUpper,
  disabled,
  updatedAt,
  indicators,
  functionButton,
}: ListItemProps) => {
  const {
    isMaxWidth1350,
    isMaxWidth1080,
    isMaxWidth900,
    isMaxWidth600,
    isMaxWidth499,
  } = useScreen()

  const symbolsCount = useMemo(() => {
    if (isMaxWidth499) {
      return 20
    } else if (isMaxWidth600) {
      return 30
    } else if (isMaxWidth900) {
      return 50
    } else if (isMaxWidth1080) {
      return 60
    } else if (isMaxWidth1350) {
      return 90
    } else {
      return 130
    }
  }, [isMaxWidth499, isMaxWidth600, isMaxWidth900, isMaxWidth1080, isMaxWidth1350])

  return (
    <ListItemButton
      id={itemId !== undefined && itemId !== null ? getListItemDomId(itemId) : undefined}
      data-list-item={itemId !== undefined && itemId !== null ? '' : undefined}
      onClick={onClick}
      divider
      disabled={disabled}
      sx={{
        py: 2,
        scrollMarginTop: 80,
        '&.Mui-disabled': {
          backgroundColor: 'transparent',
          opacity: 1,
        },
      }}
    >
      <Stack
        direction={isMaxWidth900 ? 'column' : 'row'}
        spacing={1}
        alignItems={isMaxWidth900 ? 'flex-start' : 'center'}
        width='100%'
        flexWrap={isMaxWidth900 ? 'wrap' : 'nowrap'}
        justifyContent='space-between'
      >
        <Stack
          direction={isMaxWidth900 ? 'column' : 'row'}
          spacing={1}
          alignItems='flex-start'
          flex={1}
          minWidth={0}
          overflow='hidden'
        >
          <Stack direction='row' spacing={1} alignItems='center' minWidth={0} maxWidth='100%'>
            {typeof firstName === 'string' ? (
              <Typography variant='body2' noWrap>
                {firstName}
              </Typography>
            ) : (
              firstName
            )}

            {warning && <FaCircle color={yellow[700]} size={10} title={warning} /> }
            {error && <FaCircle color={red[500]} size={10} title={error} /> }

            {secondName && (
              <Typography fontStyle='italic' noWrap>
                {secondName}
              </Typography>
            )}
          </Stack>

          {mainInfo && (
            <Typography variant='body2' color={theme => theme.palette.grey.A400}>
              {trimText(
                mainInfo, symbolsCount
              )}
            </Typography>
          )}
        </Stack>

        <Stack
          alignItems='flex-end'
          alignSelf={isMaxWidth900 ? 'flex-end' : 'center'}
          flexShrink={0}
        >
          {(additionalInfo || indicators || updatedAt || functionButton) && (
            <Stack alignItems='flex-end' spacing={0.5}>
              {(additionalInfo || updatedAt || functionButton) && (
                <Stack direction='row' alignItems='center' spacing={1}>
                  {additionalInfo && (
                    <Typography
                      variant='body2'
                      color={theme => additionalInfoColor ? additionalInfoColor : theme.palette.grey.A400}
                      sx={{
                        textTransform: additionalInfoUpper ? 'uppercase' : 'none'
                      }}
                    >
                      {additionalInfo}
                    </Typography>
                  )}

                  {updatedAt && <UpdatedAtInfo updatedAt={updatedAt} />}

                  {functionButton && functionButton}
                </Stack>
              )}

              {indicators}
            </Stack>
          )}
        </Stack>
      </Stack>
    </ListItemButton>
  )
}
