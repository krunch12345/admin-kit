import { Badge, Box, Tooltip } from '@mui/material'
import { Check } from '@mui/icons-material'
import type { ImageMeta } from '../ImageMetaFields/imageMetaFieldsConfig'
import { buildFilledFieldsTooltip } from '../ImageMetaFields/buildFilledFieldsTooltip'

export interface ThumbImage extends ImageMeta {
  imageSrc?: string
  url?: string
  name?: string
  fileName?: string
}

interface SelectableImageThumbProps {
  image: ThumbImage
  selected: boolean
  onClick?: () => void
  disableSelection?: boolean
}

/**
 * Selectable pending-image thumbnail with used-style badge and meta tooltip.
 */
export const SelectableImageThumb = ({
  image,
  selected,
  onClick,
  disableSelection = false,
}: SelectableImageThumbProps) => (
  <Tooltip title={buildFilledFieldsTooltip(image)} arrow>
    <Badge
      color='primary'
      overlap='circular'
      invisible={!selected}
      badgeContent={<Check sx={{ fontSize: 14 }} />}
      sx={{
        '& .MuiBadge-badge': {
          minWidth: 22,
          height: 22,
          p: 0,
        },
      }}
    >
      <Box
        component={disableSelection ? 'div' : 'button'}
        type={disableSelection ? undefined : 'button'}
        onClick={disableSelection ? undefined : onClick}
        sx={{
          display: 'block',
          width: 128,
          height: 128,
          borderRadius: 1,
          overflow: 'hidden',
          p: 0,
          border: selected ? '2px solid' : '2px solid transparent',
          borderColor: selected ? 'primary.main' : 'transparent',
          cursor: disableSelection ? 'default' : 'pointer',
          background: 'none',
        }}
      >
        <Box
          component='img'
          src={image.imageSrc || image.url || ''}
          alt={image.name || image.fileName || ''}
          sx={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
        />
      </Box>
    </Badge>
  </Tooltip>
)
