import { Typography } from '@mui/material'
import type { SxProps, Theme } from '@mui/material'
import { useImageSizeInfo } from '../../hooks/useImageSizeInfo'
import { formatImageSizeLabel } from '../../utils/imageSize'

export interface ImageSizeLabelProps {
  src?: string
  file?: File | null
  sx?: SxProps<Theme>
}

/**
 * Compact caption with image pixel size and file size.
 */
export const ImageSizeLabel = ({ src = '', file = null, sx }: ImageSizeLabelProps) => {
  const info = useImageSizeInfo({ src, file })
  const label = formatImageSizeLabel(info)

  if (!label) {
    return null
  }

  return (
    <Typography
      variant='caption'
      color='text.secondary'
      title={label}
      sx={[
        {
          display: 'block',
          lineHeight: 1.3,
          fontSize: '0.7rem',
        },
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
    >
      {label}
    </Typography>
  )
}
