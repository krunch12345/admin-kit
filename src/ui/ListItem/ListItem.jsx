import React, { useMemo } from 'react'
import PropTypes from 'prop-types'
import { ListItemButton, Stack, Typography } from '@mui/material'
import { FaCircle } from 'react-icons/fa'
import { red, yellow } from '@mui/material/colors'
import { trimText } from '../../utils/trimText.js'
import { useScreen } from '../../hooks/useScreen.js'
import { UpdatedAtInfo } from '../UpdatedAtInfo/UpdatedAtInfo.jsx'
import { getListItemDomId } from '../../utils/listPosition.js'

/**
 * @typedef {object} IProps
 * @property {string | number} [itemId] - Entity id for scroll restoration.
 * @property {string | ReactNode} firstName - The first info about object.
 * @property {string} [secondName] - The second info about object.
 * @property {function} [onClick] - The handle on click.
 * @property {string} [warning] - The yellow status with text about object.
 * @property {string} [error] - The red status with text about object.
 * @property {string} [mainInfo] - The main info about object.
 * @property {string} [additionalInfo] - The additional info about object.
 * @property {string} [additionalInfoColor] - The color of additional info about object.
 * @property {boolean} [additionalInfoUpper] - The uppercase status of additional info about object.
 * @property {boolean} [disabled] - Disabled status for ListItemButton.
 * @property {Date} [updatedAt] - Date of update an object.
 * @property {ReactNode} [indicators] - Indicators rendered below updatedAt.
 * @property {ReactNode} [functionButton] - The function button.
 */

/**
 * Custom List item component.
 * @type {React.FC<IProps>}
 * @returns {React.ReactElement} The custom List item component.
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
}) => {
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

ListItem.propTypes = {
  onClick: PropTypes.func,
  itemId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  firstName: PropTypes.node.isRequired,
  secondName: PropTypes.string,
  warning: PropTypes.string,
  error: PropTypes.string,
  mainInfo: PropTypes.string,
  additionalInfo: PropTypes.string,
  additionalInfoColor: PropTypes.string,
  additionalInfoUpper: PropTypes.bool,
  disabled: PropTypes.bool,
  updatedAt: PropTypes.object,
  indicators: PropTypes.node,
  functionButton: PropTypes.node,
}
