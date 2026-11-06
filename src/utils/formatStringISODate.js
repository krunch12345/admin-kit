import { format, parseISO } from 'date-fns'

export const formatStringISODate = (dateISO, mask = 'dd.MM.yyyy HH:mm') => {
  const date = parseISO(dateISO)
  return format(date, mask)
}
