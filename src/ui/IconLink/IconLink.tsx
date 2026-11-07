import type { ReactNode } from 'react'
import { Link, Tooltip } from '@mui/material'
import type { Theme } from '@mui/material'

export interface IconLinkProps {
  /** The title for icon. */
  title: string
  /** The hover color (palette color name, e.g. `primary`). */
  color: string
  /** The link. */
  href: string
  /** The icon element. */
  icon: ReactNode
}

const getHoverColor = (theme: Theme, color: string): string => {
  const paletteColor = (theme.palette as unknown as Record<string, { light?: string } | undefined>)[color]

  return paletteColor?.light ?? color
}

/**
 * Icon link component.
 */
export const IconLink = ({ title, color, href, icon }: IconLinkProps) => (
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
          color: theme => getHoverColor(theme, color),
        }
      }}
    >
      {icon}
    </Link>
  </Tooltip>
)
