import { useEffect } from 'react'
import type { ReactNode } from 'react'
import { Stack, Typography } from '@mui/material'
import { useLocation } from 'react-router-dom'
import scroll from 'react-scroll'

export interface PageProps {
  /** The page content. */
  children?: ReactNode
  /** The page title. */
  title: string
}

/**
 * Page layout component.
 */
export const Page = ({ children, title }: PageProps) => {
  const { hash } = useLocation()
  const id = hash.slice(1) // remove symbol '#'

  useEffect(() => {
    if (!id) {
      return undefined
    }

    const timeoutId = setTimeout(() => {
      scroll.scroller.scrollTo(id, { smooth: true, offset: -80 })
    }, 500)

    return () => clearTimeout(timeoutId)
  }, [id])

  return (
    <Stack spacing={2} alignItems='center' width='100%' flex={1}>
      <Typography
        variant='h3'
        sx={theme => ({
          [theme.breakpoints.up('xs')]: { fontSize: '2rem' },
          [theme.breakpoints.up('sm')]: { fontSize: '3rem' },
        })}
        pb={1}
      >
        {title}
      </Typography>

      {children}
    </Stack>
  )
}
