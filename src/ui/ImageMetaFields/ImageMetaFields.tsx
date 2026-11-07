import { Children } from 'react'
import { Chip, Stack } from '@mui/material'
import { TextField } from '../TextField/TextField'
import { useAdminKitMessages } from '../../locale/useAdminKitMessages'
import { fieldSx } from '../fieldSx'
import type { ImageMetaTemplates } from './imageMetaFieldsConfig'

export type ImageMetaValues = {
  name?: string
  nameEN?: string
  description?: string
  descriptionEN?: string
  source?: string
  sourceEN?: string
  comment?: string
  commentEN?: string
}

export type ImageMetaFieldsProps = {
  values: ImageMetaValues
  onChange: (patch: Partial<ImageMetaValues>) => void
  disabled?: boolean
  templates?: ImageMetaTemplates
}

export const ImageMetaFields = ({
  values,
  onChange,
  disabled = false,
  templates = {},
}: ImageMetaFieldsProps) => {
  const messages = useAdminKitMessages()

  return (
    <Stack spacing={1} width='100%'>
      <Stack direction='row' spacing={0} width='100%' flexWrap='wrap'>
        <TextField
          sx={fieldSx}
          label={messages.imageMeta.name}
          placeholder={messages.imageMeta.namePlaceholder}
          value={values.name ?? ''}
          onChange={(name) => onChange({ name })}
          onClear={() => onChange({ name: '' })}
          disabled={disabled}
        />
        <TextField
          sx={fieldSx}
          label={messages.imageMeta.nameEN}
          placeholder={messages.imageMeta.nameENPlaceholder}
          value={values.nameEN ?? ''}
          onChange={(nameEN) => onChange({ nameEN })}
          onClear={() => onChange({ nameEN: '' })}
          disabled={disabled}
        />
      </Stack>

      <Stack direction='row' spacing={0} width='100%' flexWrap='wrap' alignItems='flex-start'>
        <Stack sx={fieldSx} spacing={1}>
          <TextField
            label={messages.imageMeta.description}
            placeholder={messages.imageMeta.descriptionPlaceholder}
            value={values.description ?? ''}
            onChange={(description) => onChange({ description })}
            onClear={() => onChange({ description: '' })}
            disabled={disabled}
            multiline
            minRows={4}
          />
          <Stack direction='row' spacing={1} flexWrap='wrap' useFlexGap>
            {Children.toArray(
              (templates.description || []).map(({ label, ru, en }) => (
                <Chip
                  label={label}
                  size='small'
                  variant='outlined'
                  clickable
                  disabled={disabled}
                  onClick={() => onChange({ description: ru, descriptionEN: en })}
                />
              )),
            )}
          </Stack>
        </Stack>
        <TextField
          sx={fieldSx}
          label={messages.imageMeta.descriptionEN}
          placeholder={messages.imageMeta.descriptionENPlaceholder}
          value={values.descriptionEN ?? ''}
          onChange={(descriptionEN) => onChange({ descriptionEN })}
          onClear={() => onChange({ descriptionEN: '' })}
          disabled={disabled}
          multiline
          minRows={4}
        />
      </Stack>

      <Stack direction='row' spacing={0} width='100%' flexWrap='wrap' alignItems='flex-start'>
        <Stack sx={fieldSx} spacing={1}>
          <TextField
            label={messages.imageMeta.source}
            placeholder={messages.imageMeta.sourcePlaceholder}
            value={values.source ?? ''}
            onChange={(source) => onChange({ source })}
            onClear={() => onChange({ source: '' })}
            disabled={disabled}
          />
          <Stack direction='row' spacing={1} flexWrap='wrap' useFlexGap>
            {Children.toArray(
              (templates.source || []).map(({ label, ru, en }) => (
                <Chip
                  label={label}
                  size='small'
                  variant='outlined'
                  clickable
                  disabled={disabled}
                  onClick={() => onChange({ source: ru, sourceEN: en })}
                />
              )),
            )}
          </Stack>
        </Stack>
        <TextField
          sx={fieldSx}
          label={messages.imageMeta.sourceEN}
          placeholder={messages.imageMeta.sourceENPlaceholder}
          value={values.sourceEN ?? ''}
          onChange={(sourceEN) => onChange({ sourceEN })}
          onClear={() => onChange({ sourceEN: '' })}
          disabled={disabled}
        />
      </Stack>

      <Stack direction='row' spacing={0} width='100%' flexWrap='wrap'>
        <TextField
          sx={fieldSx}
          label={messages.imageMeta.comment}
          placeholder={messages.imageMeta.commentPlaceholder}
          value={values.comment ?? ''}
          onChange={(comment) => onChange({ comment })}
          onClear={() => onChange({ comment: '' })}
          disabled={disabled}
          multiline
          minRows={4}
        />
        <TextField
          sx={fieldSx}
          label={messages.imageMeta.commentEN}
          placeholder={messages.imageMeta.commentENPlaceholder}
          value={values.commentEN ?? ''}
          onChange={(commentEN) => onChange({ commentEN })}
          onClear={() => onChange({ commentEN: '' })}
          disabled={disabled}
          multiline
          minRows={4}
        />
      </Stack>
    </Stack>
  )
}
