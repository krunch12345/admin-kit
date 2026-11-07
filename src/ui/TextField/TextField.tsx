import { useEffect, useMemo, useRef, useState, type ChangeEvent } from 'react'
import { IconButton, InputAdornment, TextField as MuiTextField, type TextFieldProps } from '@mui/material'
import { debounce, type DebouncedFunc } from 'lodash-es'
import { Clear } from '@mui/icons-material'
import { useAdminKitMessages } from '../../locale/useAdminKitMessages'

export type AdminKitTextFieldProps = Omit<TextFieldProps, 'onChange' | 'value'> & {
  value: string
  onChange: (value: string) => void
  debounceMs?: number
  onClear?: () => void
}

export const TextField = ({
  value,
  onChange,
  debounceMs = 0,
  onClear,
  ...props
}: AdminKitTextFieldProps) => {
  const messages = useAdminKitMessages()
  const [localValue, setLocalValue] = useState(value ?? '')
  const onChangeRef = useRef(onChange)

  useEffect(() => {
    onChangeRef.current = onChange
  }, [onChange])

  useEffect(() => {
    setLocalValue(value ?? '')
  }, [value])

  const debouncedOnChange = useMemo((): ((newValue: string) => void) | DebouncedFunc<(newValue: string) => void> => {
    if (!debounceMs) {
      return (newValue: string) => {
        onChangeRef.current(newValue)
      }
    }

    return debounce((newValue: string) => {
      onChangeRef.current(newValue)
    }, debounceMs)
  }, [debounceMs])

  useEffect(() => () => {
    if ('cancel' in debouncedOnChange) {
      debouncedOnChange.cancel()
    }
  }, [debouncedOnChange])

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value
    setLocalValue(newValue)
    debouncedOnChange(newValue)
  }

  return (
    <MuiTextField
      size='small'
      value={localValue}
      onChange={handleChange}
      InputProps={{
        endAdornment: !!onClear && localValue && (
          <InputAdornment position='end'>
            <IconButton
              aria-label={messages.common.clear}
              sx={{ maxHeight: 30, maxWidth: 30 }}
              onClick={() => {
                if ('cancel' in debouncedOnChange) {
                  debouncedOnChange.cancel()
                }
                onClear()
                setLocalValue('')
              }}
            >
              <Clear fontSize='small' />
            </IconButton>
          </InputAdornment>
        ),
      }}
      {...props}
    />
  )
}
