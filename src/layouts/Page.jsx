import React, { useEffect } from 'react'
import { Stack, Typography } from '@mui/material'
import PropTypes from 'prop-types'
import { useLocation } from 'react-router-dom'
import scroll from 'react-scroll'

/**
 * @typedef {object} IProps
 * @property {ReactNode} children - The page content.
 * @property {string} title - The page title.
 */

/**
 * Page layout component.
 * @type {React.FC<IProps>}
 * @returns {React.ReactElement} The page wrapper components.
 */
export const Page = ({ children, title }) => {
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

Page.propTypes = {
  children: PropTypes.node.isRequired,
  title: PropTypes.string.isRequired,
}
