import PropTypes from 'prop-types'
import { Typography } from '@mui/material'
import { useImageSizeInfo } from '../../hooks/useImageSizeInfo.js'
import { formatImageSizeLabel } from '../../utils/imageSize.js'

/**
 * @typedef {object} ImageSizeLabelProps
 * @property {string} [src]
 * @property {File|null} [file]
 * @property {object} [sx]
 */

/**
 * Compact caption with image pixel size and file size.
 * @type {React.FC<ImageSizeLabelProps>}
 */
export const ImageSizeLabel = ({ src = '', file = null, sx }) => {
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
      sx={{
        display: 'block',
        lineHeight: 1.3,
        fontSize: '0.7rem',
        ...sx,
      }}
    >
      {label}
    </Typography>
  )
}

ImageSizeLabel.propTypes = {
  src: PropTypes.string,
  file: PropTypes.instanceOf(File),
  sx: PropTypes.object,
}
