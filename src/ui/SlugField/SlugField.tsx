import { useEffect, useRef, useState, type MouseEvent } from 'react'
import { Stack, type SxProps, type Theme } from '@mui/material'
import { AutoFixHigh } from '@mui/icons-material'
import { TextField, type AdminKitTextFieldProps } from '../TextField/TextField'
import { IconButton } from '../IconButton/IconButton'
import { slugify } from '../../utils/slugify'
import { useAdminKitMessages } from '../../locale/useAdminKitMessages'

type TextFieldPassthrough = Pick<
  AdminKitTextFieldProps,
  'error' | 'helperText' | 'fullWidth' | 'name' | 'id' | 'size'
>

export type SlugFieldProps = TextFieldPassthrough & {
  /** Controlled slug value. */
  value: string
  /** Called when the slug changes (typing, clear, regenerate, or auto from name). */
  onChange: (value: string) => void
  /**
   * Entity display name. When it changes and the slug is not manually locked,
   * the field updates to `slugify(sourceName)`.
   */
  sourceName?: string | null
  /**
   * Controlled manual-edit lock. When `true`, `sourceName` changes do not overwrite the slug.
   * Omit to track the lock internally (see `defaultIsManual`).
   */
  isManual?: boolean
  /** Initial manual lock when `isManual` is uncontrolled. Prefer `true` for edit forms. */
  defaultIsManual?: boolean
  /** Fires when the manual lock changes (typing, clear, regenerate). */
  onIsManualChange?: (isManual: boolean) => void
  label?: string
  placeholder?: string
  /** Tooltip / aria-label for the regenerate button. */
  regenerateTitle?: string
  required?: boolean
  disabled?: boolean
  sx?: SxProps<Theme>
}

/**
 * Required slug input with optional auto-fill from a source name and regenerate control.
 */
export const SlugField = ({
  value,
  onChange,
  sourceName,
  isManual: isManualProp,
  defaultIsManual = false,
  onIsManualChange,
  label,
  placeholder,
  regenerateTitle,
  required = true,
  disabled,
  sx,
  error,
  helperText,
  fullWidth,
  name,
  id,
  size,
}: SlugFieldProps) => {
  const messages = useAdminKitMessages()
  const isControlledManual = isManualProp !== undefined
  const [uncontrolledManual, setUncontrolledManual] = useState(defaultIsManual)
  const isManual = isControlledManual ? Boolean(isManualProp) : uncontrolledManual

  const onChangeRef = useRef(onChange)
  const valueRef = useRef(value)

  useEffect(() => {
    onChangeRef.current = onChange
  }, [onChange])

  useEffect(() => {
    valueRef.current = value
  }, [value])

  const setIsManual = (next: boolean) => {
    if (!isControlledManual) {
      setUncontrolledManual(next)
    }
    onIsManualChange?.(next)
  }

  useEffect(() => {
    if (isManual) {
      return
    }

    const next = slugify(sourceName)
    if (next === valueRef.current) {
      return
    }

    onChangeRef.current(next)
  }, [sourceName, isManual])

  const canRegenerate = Boolean(sourceName?.trim()) && !disabled

  const handleChange = (next: string) => {
    setIsManual(true)
    onChange(next)
  }

  const handleClear = () => {
    setIsManual(true)
    onChange('')
  }

  const handleRegenerate = (_event: MouseEvent<HTMLButtonElement>) => {
    setIsManual(true)
    onChange(slugify(sourceName))
  }

  return (
    <Stack
      direction='row'
      alignItems='center'
      spacing={1}
      flex={1}
      minWidth='15.5rem'
      sx={sx}
    >
      <TextField
        required={required}
        disabled={disabled}
        error={error}
        helperText={helperText}
        fullWidth={fullWidth}
        name={name}
        id={id}
        size={size}
        label={label ?? messages.slugField.label}
        placeholder={placeholder ?? messages.slugField.placeholder}
        value={value ?? ''}
        onChange={handleChange}
        onClear={handleClear}
        sx={{ display: 'flex', flex: 1 }}
      />
      <IconButton
        title={regenerateTitle ?? messages.slugField.regenerateTitle}
        disabled={!canRegenerate}
        onClick={handleRegenerate}
        icon={<AutoFixHigh fontSize='small' />}
      />
    </Stack>
  )
}
