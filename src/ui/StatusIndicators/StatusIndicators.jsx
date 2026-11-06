import { Children } from 'react'
import PropTypes from 'prop-types'
import { Box, IconButton, Stack, SvgIcon, Tooltip } from '@mui/material'
import { grey } from '@mui/material/colors'
import { FaDiscord, FaInstagram, FaTelegramPlane } from 'react-icons/fa'
import { SiBluesky, SiThreads } from 'react-icons/si'

const MUTED_COLOR = grey[400]

/**
 * @typedef {object} PlatformDefinition
 * @property {string} key - Key in `values`.
 * @property {string} label - Tooltip text.
 * @property {React.ElementType} Icon - Icon component.
 * @property {string} brandColor - Icon color when the value is truthy.
 */

/**
 * @type {PlatformDefinition[]}
 */
export const DEFAULT_STATUS_PLATFORMS = [
  { key: 'telegram', label: 'Telegram', Icon: FaTelegramPlane, brandColor: '#229ED9' },
  { key: 'bluesky', label: 'Bluesky', Icon: SiBluesky, brandColor: '#0085FF' },
  { key: 'instagram', label: 'Instagram', Icon: FaInstagram, brandColor: '#E4405F' },
  { key: 'threads', label: 'Threads', Icon: SiThreads, brandColor: '#000000' },
  { key: 'discord', label: 'Discord', Icon: FaDiscord, brandColor: '#5865F2' },
]

const resolvePlatform = (platform) => (
  typeof platform === 'string'
    ? DEFAULT_STATUS_PLATFORMS.find(({ key }) => key === platform)
    : platform
)

/**
 * @typedef {object} IProps
 * @property {Object.<string, boolean>} [values] - Status per platform key; `true` highlights the icon.
 * @property {Array<string | PlatformDefinition>} [platforms] - Default platform keys or custom definitions.
 * @property {function(string): void} [onPlatformClick] - Makes icons clickable and receives the platform key.
 */

/**
 * Row of platform status icons (e.g. "sent to").
 * @type {React.FC<IProps>}
 * @returns {React.ReactElement} The StatusIndicators component.
 */
export const StatusIndicators = ({
  values = {},
  platforms = DEFAULT_STATUS_PLATFORMS,
  onPlatformClick,
}) => {
  const resolvedPlatforms = platforms.map(resolvePlatform).filter(Boolean)

  const stopRowClick = (event) => {
    event.stopPropagation()
  }

  return (
    <Stack
      direction='row'
      spacing={0.75}
      alignItems='center'
      onClick={onPlatformClick ? undefined : stopRowClick}
      onMouseDown={onPlatformClick ? undefined : stopRowClick}
      sx={onPlatformClick ? undefined : { cursor: 'default' }}
    >
      {Children.toArray(
        resolvedPlatforms.map(({ key, label, Icon, brandColor }) => {
          const isActive = values[key] === true

          const icon = (
            <SvgIcon
              component={Icon}
              inheritViewBox
              fontSize='small'
              sx={{ color: isActive ? brandColor : MUTED_COLOR }}
            />
          )

          return (
            <Tooltip title={label} arrow>
              {onPlatformClick ? (
                <IconButton
                  size='small'
                  aria-label={label}
                  onClick={(event) => {
                    event.stopPropagation()
                    onPlatformClick(key)
                  }}
                >
                  {icon}
                </IconButton>
              ) : (
                <Box
                  component='span'
                  sx={{
                    display: 'inline-flex',
                    lineHeight: 0,
                    cursor: 'default',
                  }}
                >
                  {icon}
                </Box>
              )}
            </Tooltip>
          )
        })
      )}
    </Stack>
  )
}

StatusIndicators.propTypes = {
  values: PropTypes.objectOf(PropTypes.bool),
  platforms: PropTypes.arrayOf(
    PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.shape({
        key: PropTypes.string.isRequired,
        label: PropTypes.string.isRequired,
        Icon: PropTypes.elementType.isRequired,
        brandColor: PropTypes.string.isRequired,
      }),
    ])
  ),
  onPlatformClick: PropTypes.func,
}
