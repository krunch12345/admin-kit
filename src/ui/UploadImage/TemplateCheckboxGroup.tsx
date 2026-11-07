import { Children } from 'react'
import { Checkbox, FormControlLabel, Stack } from '@mui/material'

export interface TemplateCheckboxOption {
  key: string
  label: string
}

export interface TemplateCheckboxGroupProps {
  options: TemplateCheckboxOption[]
  isChecked: (key: string) => boolean
  onChange: (key: string, checked: boolean) => void
}

/**
 * Wrapping row of labelled checkboxes.
 */
export const TemplateCheckboxGroup = ({ options, isChecked, onChange }: TemplateCheckboxGroupProps) => (
  <Stack
    direction='row'
    spacing={1}
    flexWrap='wrap'
    useFlexGap
    sx={{ pl: 1.375 }}
  >
    {Children.toArray(
      options.map(({ key, label }) => (
        <FormControlLabel
          label={label}
          control={
            <Checkbox
              color='primary'
              checked={isChecked(key)}
              onChange={(_, checked) => onChange(key, checked)}
            />
          }
        />
      ))
    )}
  </Stack>
)
