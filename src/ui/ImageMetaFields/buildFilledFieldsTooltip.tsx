import { Children } from 'react'
import type { ReactNode } from 'react'
import { Stack, Typography } from '@mui/material'
import {
  COPYABLE_META_FIELDS,
  isMetaValueFilled,
} from './imageMetaFieldsConfig'
import type { ImageMeta } from './imageMetaFieldsConfig'
import { getAdminKitMessages } from '../../locale/runtime'

interface TooltipFieldCellProps {
  label: string
  value: string
}

const TooltipFieldCell = ({ label, value }: TooltipFieldCellProps) => (
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

/**
 * Builds a bilingual RU/EN tooltip for filled image meta fields.
 */
export const buildFilledFieldsTooltip = (image: ImageMeta | null | undefined): ReactNode => {
  const rows = COPYABLE_META_FIELDS
    .flatMap(({ ruKey, enKey, ruLabel, enLabel }) => {
      const ruValue = String(image?.[ruKey] ?? '')
      const enValue = String(image?.[enKey] ?? '')
      const hasRu = isMetaValueFilled(ruValue)
      const hasEn = isMetaValueFilled(enValue)

      if (!hasRu && !hasEn) {
        return []
      }

      return [{
        ruLabel,
        enLabel,
        ruValue: hasRu ? ruValue : '—',
        enValue: hasEn ? enValue : '—',
      }]
    })

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
