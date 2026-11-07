import React from 'react'
import { Link, Tooltip } from '@mui/material'
import PropTypes from 'prop-types'

/**
 * @typedef {object} IIconLink
 * @property {string} title - The title for icon.
 * @property {string} color - The hover color.
 * @property {string} href - The link.
 * @property {ReactNode} icon - The icon element.
 */

/**
 * Icon link component.
 * @type {React.FC<IIconLink>}
 * @returns {React.ReactElement} The Icon link component.
 */
export const IconLink = ({ title, color, href, icon }) => (
  <Tooltip
    title={title}
  >
    <Link
      href={href}
      target='_blank'
      rel='noopener noreferrer'
      sx={{
        color: theme => theme.palette.grey.A400,
        '&:hover': {
          color: theme => theme.palette[color].light,
        }
      }}
    >
      {icon}
    </Link>
  </Tooltip>
)

IconLink.propTypes = {
  title: PropTypes.string.isRequired,
  color: PropTypes.string.isRequired,
  href: PropTypes.string.isRequired,
  icon: PropTypes.node.isRequired,
}
