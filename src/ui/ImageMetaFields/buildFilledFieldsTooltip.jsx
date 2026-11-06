import { Children } from 'react'
import PropTypes from 'prop-types'
import { Stack, Typography } from '@mui/material'
import {
  COPYABLE_META_FIELDS,
  isMetaValueFilled,
} from './imageMetaFields.js'
import { getAdminKitMessages } from '../../locale/runtime.js'

/**
 * @param {string} label
 * @param {string} value
 * @returns {React.ReactElement}
 */
const TooltipFieldCell = ({ label, value }) => (
  <Typography
    variant='caption'
    component='div'
    sx={{ flex: 1, minWidth: 0 }}
  >
    <strong>{label}:</strong>
    {' '}
    {value}
  </Typography>
)

TooltipFieldCell.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
}

/**
 * Builds a bilingual RU/EN tooltip for filled image meta fields.
 * @param {object} image
 * @returns {React.ReactNode}
 */
export const buildFilledFieldsTooltip = (image) => {
  const rows = COPYABLE_META_FIELDS
    .map(({ ruKey, enKey, ruLabel, enLabel }) => {
      const ruValue = image?.[ruKey]
      const enValue = image?.[enKey]
      const hasRu = isMetaValueFilled(ruValue)
      const hasEn = isMetaValueFilled(enValue)

      if (!hasRu && !hasEn) {
        return null
      }

      return {
        ruLabel,
        enLabel,
        ruValue: hasRu ? ruValue : '—',
        enValue: hasEn ? enValue : '—',
      }
    })
    .filter(Boolean)

  if (!rows.length) {
    return getAdminKitMessages().imageMeta.emptyFilledFields
  }

  return (
    <Stack spacing={0.5} minWidth={280}>
      {Children.toArray(
        rows.map(({ ruLabel, enLabel, ruValue, enValue }) => (
          <Stack direction='row' spacing={2}>
            <TooltipFieldCell label={ruLabel} value={ruValue} />
            <TooltipFieldCell label={enLabel} value={enValue} />
          </Stack>
        ))
      )}
    </Stack>
  )
}
