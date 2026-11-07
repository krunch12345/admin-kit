import { useRef, useState, useEffect, useCallback } from 'react'
import type { ChangeEvent } from 'react'
import ReactCrop from 'react-image-crop'
import type { Crop } from 'react-image-crop'
import 'react-image-crop/dist/ReactCrop.css'
import {
  Button,
  Checkbox, FormControl, FormControlLabel, InputLabel, MenuItem, Select, Stack,
} from '@mui/material'
import { FaCropAlt } from 'react-icons/fa'
import { DialogRemoveButton } from '../DialogRemoveButton/DialogRemoveButton'
import { useAdminKitMessages } from '../../locale/useAdminKitMessages'
import { getCroppedImg, isCropChanged } from '../../utils/cropImage'

const FREE_ASPECT = 'free'

export interface CropControlsProps {
  imageSrc?: string
  fileName?: string
  onCropped?: (file: File) => void
  onRemove?: () => void
}

export const CropControls = ({ imageSrc, fileName, onCropped, onRemove }: CropControlsProps) => {
  const messages = useAdminKitMessages()
  const [isCroppingEnabled, setIsCroppingEnabled] = useState(false)
  const [aspect, setAspect] = useState<number | typeof FREE_ASPECT>(FREE_ASPECT)
  const [crop, setCrop] = useState<Crop | null>(null)
  const imgRef = useRef<HTMLImageElement | null>(null)
  const [currentImageSrc, setCurrentImageSrc] = useState(imageSrc)
  const objectUrlRef = useRef<string | null>(null)

  const revokeObjectUrl = useCallback(() => {
    if (objectUrlRef.current) {
      URL.revokeObjectURL(objectUrlRef.current)
      objectUrlRef.current = null
    }
  }, [])

  useEffect(() => () => {
    revokeObjectUrl()
  }, [revokeObjectUrl])

  const onImageLoaded = useCallback((img: HTMLImageElement) => {
    imgRef.current = img

    setCrop({
      unit: '%',
      x: 0,
      y: 0,
      width: 100,
      height: 100,
    })
  }, [])

  const handleCrop = async () => {
    if (crop?.width && crop?.height && imgRef.current && isCropChanged(crop, imgRef.current)) {
      const { blob, fileUrl } = await getCroppedImg(imgRef.current, crop)
      const croppedFile = new File([blob], fileName || 'cropped.jpg', {
        type: 'image/jpeg',
      })
      revokeObjectUrl()
      objectUrlRef.current = fileUrl
      setCurrentImageSrc(fileUrl)
      onCropped?.(croppedFile)
    }
  }

  const handleCroppingToggle = useCallback((_event: ChangeEvent<HTMLInputElement>, checked: boolean) => {
    setIsCroppingEnabled(checked)

    if (checked && imgRef.current) {
      onImageLoaded(imgRef.current)
    } else {
      setCrop(null)
    }
  }, [onImageLoaded])

  useEffect(() => {
    revokeObjectUrl()
    setCurrentImageSrc(imageSrc)
    setIsCroppingEnabled(false)
    setCrop(null)
  }, [imageSrc, revokeObjectUrl])

  if (!currentImageSrc) return null

  const canApplyCrop = isCroppingEnabled && isCropChanged(crop, imgRef.current)
  const aspectLabelId = 'crop-aspect-label'

  const imageElement = (
    <img
      ref={imgRef}
      src={currentImageSrc}
      onLoad={(e) => {
        if (isCroppingEnabled) {
          onImageLoaded(e.currentTarget)
        }
      }}
      alt={messages.crop.label}
      style={{ maxHeight: '60vh', maxWidth: '100%' }}
    />
  )

  return (
    <Stack spacing={2} alignItems='center'>
      {isCroppingEnabled ? (
        <ReactCrop
          crop={crop ?? undefined}
          onChange={(c) => setCrop(c)}
          aspect={aspect === FREE_ASPECT ? undefined : aspect}
          minWidth={30}
          minHeight={30}
          keepSelection
        >
          {imageElement}
        </ReactCrop>
      ) : (
        imageElement
      )}

      <Stack direction='row' spacing={2} alignItems='center'>
        <FormControlLabel
          label={messages.crop.label}
          control={
            <Checkbox
              color='primary'
              checked={isCroppingEnabled}
              onChange={handleCroppingToggle}
            />
          }
        />

        <FormControl size='small' sx={{ minWidth: 200 }} disabled={!isCroppingEnabled}>
          <InputLabel id={aspectLabelId}>{messages.crop.aspectRatio}</InputLabel>
          <Select
            variant='outlined'
            labelId={aspectLabelId}
            label={messages.crop.aspectRatio}
            value={aspect}
            disabled={!isCroppingEnabled}
            onChange={(e) => setAspect(e.target.value === FREE_ASPECT ? FREE_ASPECT : Number(e.target.value))}
          >
            <MenuItem value={1}>1:1</MenuItem>
            <MenuItem value={16 / 9}>16:9</MenuItem>
            <MenuItem value={4 / 3}>4:3</MenuItem>
            <MenuItem value={FREE_ASPECT}>{messages.crop.free}</MenuItem>
          </Select>
        </FormControl>

        <Button
          variant='outlined'
          color='primary'
          startIcon={<FaCropAlt />}
          onClick={handleCrop}
          disabled={!canApplyCrop}
        >
          {messages.crop.applyCrop}
        </Button>

        {onRemove && (
          <DialogRemoveButton
            variant='text'
            confirmMessage={messages.crop.confirmDeleteImage}
            onRemove={onRemove}
          />
        )}
      </Stack>
    </Stack>
  )
}
