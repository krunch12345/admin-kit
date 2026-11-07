import { Children } from 'react'
import type { ElementType, SyntheticEvent } from 'react'
import { Box, IconButton, Stack, SvgIcon, Tooltip } from '@mui/material'
import { grey } from '@mui/material/colors'
import { FaDiscord, FaInstagram, FaTelegramPlane } from 'react-icons/fa'
import { SiBluesky, SiThreads } from 'react-icons/si'

const MUTED_COLOR = grey[400]

export interface PlatformDefinition {
  /** Key in `values`. */
  key: string
  /** Tooltip text. */
  label: string
  /** Icon component. */
  Icon: ElementType
  /** Icon color when the value is truthy. */
  brandColor: string
}

export const DEFAULT_STATUS_PLATFORMS: PlatformDefinition[] = [
  { key: 'telegram', label: 'Telegram', Icon: FaTelegramPlane, brandColor: '#229ED9' },
  { key: 'bluesky', label: 'Bluesky', Icon: SiBluesky, brandColor: '#0085FF' },
  { key: 'instagram', label: 'Instagram', Icon: FaInstagram, brandColor: '#E4405F' },
  { key: 'threads', label: 'Threads', Icon: SiThreads, brandColor: '#000000' },
  { key: 'discord', label: 'Discord', Icon: FaDiscord, brandColor: '#5865F2' },
]

const isPlatformDefinition = (platform: PlatformDefinition | undefined): platform is PlatformDefinition => (
  platform !== undefined
)

const resolvePlatform = (platform: string | PlatformDefinition): PlatformDefinition | undefined => (
  typeof platform === 'string'
    ? DEFAULT_STATUS_PLATFORMS.find(({ key }) => key === platform)
    : platform
)

export interface StatusIndicatorsProps {
  /** Status per platform key; `true` highlights the icon. */
  values?: Record<string, boolean>
  /** Default platform keys or custom definitions. */
  platforms?: Array<string | PlatformDefinition>
  /** Makes icons clickable and receives the platform key. */
  onPlatformClick?: (platformKey: string) => void
}

/**
 * Row of platform status icons (e.g. "sent to").
 */
export const StatusIndicators = ({
  values = {},
  platforms = DEFAULT_STATUS_PLATFORMS,
  onPlatformClick,
}: StatusIndicatorsProps) => {
  const resolvedPlatforms = platforms.map(resolvePlatform).filter(isPlatformDefinition)

  const stopRowClick = (event: SyntheticEvent) => {
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
