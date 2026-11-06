import { useMediaQuery } from '@mui/material'

/**
 * Custom hook for determine the width of the screen.
 * @returns {Object.<string, boolean>} - An object with width and corresponding boolean values.
 */
export const useScreen = () => {
  const isMaxWidth2200 = useMediaQuery('(max-width: 2200px)')
  const isMaxWidth1350 = useMediaQuery('(max-width: 1350px)')
  const isMaxWidth1080 = useMediaQuery('(max-width: 1080px)')
  const isMaxWidth1079 = useMediaQuery('(max-width: 1079px)')
  const isMaxWidth900 = useMediaQuery(theme => theme.breakpoints.down('md'))
  const isMaxWidth600 = useMediaQuery(theme => theme.breakpoints.down('sm'))
  const isMaxWidth499 = useMediaQuery('(max-width: 499px)')
  const isMaxWidth375 = useMediaQuery('(max-width: 375px)')

  return {
    isMaxWidth2200,
    isMaxWidth1350,
    isMaxWidth1080,
    isMaxWidth1079,
    isMaxWidth900,
    isMaxWidth600,
    isMaxWidth499,
    isMaxWidth375,
  }
}
