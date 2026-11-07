import type { KeyboardEvent } from 'react'
import { TextField, Autocomplete as MuiAutocomplete } from '@mui/material'
import type { AutocompleteProps as MuiAutocompleteProps } from '@mui/material'
import { useAdminKitMessages } from '../../locale/useAdminKitMessages'

export interface AutocompleteOption {
  id?: string | number
  name?: string
}

export type AutocompleteProps<
  Option = AutocompleteOption,
  Multiple extends boolean | undefined = false,
  DisableClearable extends boolean | undefined = false,
  FreeSolo extends boolean | undefined = false,
> = Omit<
  MuiAutocompleteProps<Option, Multiple, DisableClearable, FreeSolo>,
  'renderInput'
> & {
  /** The label. */
  label: string
  /** The no options text. */
  noOptionsText?: string
  /** Key handler on the input (runs after Autocomplete internal handler). */
  onInputKeyDown?: (event: KeyboardEvent<HTMLDivElement>) => void
}

/**
 * Autocomplete component.
 */
export const Autocomplete = <
  Option = AutocompleteOption,
  Multiple extends boolean | undefined = false,
  DisableClearable extends boolean | undefined = false,
  FreeSolo extends boolean | undefined = false,
>({
    label,
    noOptionsText,
    onInputKeyDown,
    ...props
  }: AutocompleteProps<Option, Multiple, DisableClearable, FreeSolo>) => {
  const messages = useAdminKitMessages()

  return (
    <MuiAutocomplete<Option, Multiple, DisableClearable, FreeSolo>
      size='small'
      loadingText={messages.autocomplete.loadingText}
      noOptionsText={!props.inputValue
        ? noOptionsText || messages.autocomplete.enterName
        : messages.autocomplete.nothingFound}
      clearText={messages.autocomplete.clearText}
      closeText={messages.autocomplete.closeText}
      openText={messages.autocomplete.openText}
      filterOptions={(options) => (props.inputValue ? options : [])}
      renderInput={(params) => (
        <TextField
          {...params}
          label={label}
          onKeyDown={onInputKeyDown}
        />
      )}
      openOnFocus
      getOptionLabel={(option) => (option as AutocompleteOption | null)?.name ?? ''}
      isOptionEqualToValue={(option, value) => (
        (option as AutocompleteOption).id === (value as AutocompleteOption).id
      )}
      sx={{ m: 1, flex: 1, minWidth: '15rem' }}
      {...props}
    />
  )
}
