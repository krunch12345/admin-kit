import { format, parseISO } from 'date-fns'

export const formatStringISODate = (dateISO: string, mask = 'dd.MM.yyyy HH:mm'): string => {
  const date = parseISO(dateISO)
  return format(date, mask)
}
