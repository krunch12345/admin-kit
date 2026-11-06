import { Children, useRef } from 'react'
import PropTypes from 'prop-types'
import { Box, Stack, TextField } from '@mui/material'
import { formatMessage } from '../../locale/formatMessage.js'
import { useAdminKitMessages } from '../../locale/useAdminKitMessages.js'

const digitsOnly = (value) => String(value || '').replace(/\D/g, '')

/**
 * @typedef {object} IProps
 * @property {string} value - Full OTP string.
 * @property {function(string): void} onChange - Called with the updated OTP string.
 * @property {number} [length] - Number of digit boxes.
 * @property {boolean} [disabled] - Disable all inputs.
 * @property {boolean} [autoFocus] - Focus the first cell on mount.
 */

/**
 * Multi-box OTP input with paste support for the full code.
 * @type {React.FC<IProps>}
 */
export const OtpCodeInputs = ({
  value,
  onChange,
  length = 6,
  disabled = false,
  autoFocus = true,
}) => {
  const m = useAdminKitMessages()
  const inputsRef = useRef([])
  const digits = digitsOnly(value).slice(0, length).padEnd(length, ' ').split('').map((ch) => (
    ch === ' ' ? '' : ch
  ))

  const focusAt = (index) => {
    const clamped = Math.max(0, Math.min(length - 1, index))
    inputsRef.current[clamped]?.focus()
    inputsRef.current[clamped]?.select()
  }

  const emit = (nextDigits) => {
    onChange(nextDigits.join('').slice(0, length))
  }

  const handleChange = (index, raw) => {
    const cleaned = digitsOnly(raw)

    if (cleaned.length > 1) {
      const merged = [...digits]
      cleaned.split('').forEach((digit, offset) => {
        if (index + offset < length) {
          merged[index + offset] = digit
        }
      })
      emit(merged)
      focusAt(Math.min(index + cleaned.length, length - 1))
      return
    }

    const next = [...digits]
    next[index] = cleaned.slice(-1)
    emit(next)

    if (cleaned) {
      focusAt(index + 1)
    }
  }

  const handleKeyDown = (index, event) => {
    if (event.key === 'Backspace' && !digits[index] && index > 0) {
      event.preventDefault()
      const next = [...digits]
      next[index - 1] = ''
      emit(next)
      focusAt(index - 1)
      return
    }

    if (event.key === 'ArrowLeft') {
      event.preventDefault()
      focusAt(index - 1)
      return
    }

    if (event.key === 'ArrowRight') {
      event.preventDefault()
      focusAt(index + 1)
    }
  }

  const handlePaste = (index, event) => {
    event.preventDefault()
    const pasted = digitsOnly(event.clipboardData.getData('text'))
    if (!pasted) {
      return
    }

    const next = [...digits]
    pasted.split('').forEach((digit, offset) => {
      if (index + offset < length) {
        next[index + offset] = digit
      }
    })
    emit(next)
    focusAt(Math.min(index + pasted.length, length - 1))
  }

  return (
    <Stack direction='row' spacing={1} justifyContent='center' width='100%'>
      {Children.toArray(
        Array.from({ length }, (_, index) => (
          <Box width={48}>
            <TextField
              inputRef={(node) => {
                inputsRef.current[index] = node
              }}
              value={digits[index]}
              disabled={disabled}
              autoFocus={autoFocus && index === 0}
              onChange={(event) => handleChange(index, event.target.value)}
              onKeyDown={(event) => handleKeyDown(index, event)}
              onPaste={(event) => handlePaste(index, event)}
              onFocus={(event) => event.target.select()}
              inputProps={{
                inputMode: 'numeric',
                autoComplete: index === 0 ? 'one-time-code' : 'off',
                maxLength: length,
                'aria-label': formatMessage(m.otp.digitAriaLabel, { index: index + 1 }),
                style: {
                  textAlign: 'center',
                  fontSize: '1.5rem',
                  fontWeight: 600,
                  padding: '12px 0',
                },
              }}
              fullWidth
            />
          </Box>
        )),
      )}
    </Stack>
  )
}

OtpCodeInputs.propTypes = {
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  length: PropTypes.number,
  disabled: PropTypes.bool,
  autoFocus: PropTypes.bool,
}
