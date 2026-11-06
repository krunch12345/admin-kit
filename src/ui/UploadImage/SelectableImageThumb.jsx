import PropTypes from 'prop-types'
import { Badge, Box, Tooltip } from '@mui/material'
import { Check } from '@mui/icons-material'
import { buildFilledFieldsTooltip } from '../ImageMetaFields/buildFilledFieldsTooltip.jsx'

/**
 * @typedef {object} SelectableImageThumbProps
 * @property {object} image
 * @property {boolean} selected
 * @property {function(): void} [onClick]
 * @property {boolean} [disableSelection]
 */

/**
 * Selectable pending-image thumbnail with used-style badge and meta tooltip.
 * @type {React.FC<SelectableImageThumbProps>}
 */
export const SelectableImageThumb = ({
  image,
  selected,
  onClick,
  disableSelection = false,
}) => (
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

SelectableImageThumb.propTypes = {
  image: PropTypes.shape({
    id: PropTypes.string.isRequired,
    imageSrc: PropTypes.string,
    url: PropTypes.string,
    fileName: PropTypes.string,
    name: PropTypes.string,
    nameEN: PropTypes.string,
    description: PropTypes.string,
    descriptionEN: PropTypes.string,
    source: PropTypes.string,
    sourceEN: PropTypes.string,
    comment: PropTypes.string,
    commentEN: PropTypes.string,
  }).isRequired,
  selected: PropTypes.bool.isRequired,
  onClick: PropTypes.func,
  disableSelection: PropTypes.bool,
}
