import { Children } from 'react'
import { Stack } from '@mui/material'
import { SelectableImageThumb } from './SelectableImageThumb'
import type { PendingImage } from './types'

export interface ThumbGridProps {
  images: PendingImage[]
  isSelected?: (image: PendingImage) => boolean
  onSelect: (image: PendingImage) => void
}

/**
 * Wrapping grid of selectable image thumbnails.
 */
export const ThumbGrid = ({ images, isSelected = () => false, onSelect }: ThumbGridProps) => (
  <Stack
    direction='row'
    spacing={2}
    flexWrap='wrap'
    useFlexGap
  >
    {Children.toArray(
      images.map((image) => (
        <SelectableImageThumb
          image={image}
          selected={isSelected(image)}
          onClick={() => onSelect(image)}
        />
      ))
    )}
  </Stack>
)
