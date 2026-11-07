import { Tooltip, IconButton as MuiIconButton, type IconButtonProps } from '@mui/material'
import type { ReactNode, MouseEvent } from 'react'
import type { Theme } from '@mui/material/styles'

const resolvePaletteColor = (theme: Theme, color: string, tone: 'main' | 'dark' = 'main') => {
  const paletteColor = (theme.palette as unknown as Record<string, unknown>)[color]

  if (paletteColor && typeof paletteColor === 'object' && tone in (paletteColor as object)) {
    return (paletteColor as Record<string, string>)[tone]
  }

  return color
}

export type AdminKitIconButtonProps = Omit<IconButtonProps, 'children' | 'onClick' | 'color'> & {
  icon: ReactNode
  title: string
  onClick: (event: MouseEvent<HTMLButtonElement>) => void
  color?: string
}

export const IconButton = ({
  title,
  onClick,
  icon,
  color,
  sx,
  disabled,
  ...props
}: AdminKitIconButtonProps) => {
  const coloredSx = color
    ? {
      color: (theme: Theme) => resolvePaletteColor(theme, color, 'main'),
      ':hover': {
        color: (theme: Theme) => resolvePaletteColor(theme, color, 'dark'),
      },
    }
    : {
      ':hover': {
        color: (theme: Theme) => theme.palette.primary.main,
      },
    }

  return (
    <Tooltip title={title}>
      <span style={{ display: 'inline-flex', cursor: disabled ? 'default' : 'pointer' }}>
        <MuiIconButton
          size='small'
          color={color as IconButtonProps['color']}
          disabled={disabled}
          aria-label={title}
          onClick={(e) => {
            e.stopPropagation()
            onClick(e)
          }}
          sx={[
            coloredSx,
            ...(Array.isArray(sx) ? sx : sx ? [sx] : []),
          ]}
          {...props}
        >
          {icon}
        </MuiIconButton>
      </span>
    </Tooltip>
  )
}
