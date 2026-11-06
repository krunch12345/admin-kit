import { useRef, useState, useEffect, useCallback } from 'react'
import PropTypes from 'prop-types'
import ReactCrop from 'react-image-crop'
import 'react-image-crop/dist/ReactCrop.css'
import {
  Button,
  Checkbox, FormControl, FormControlLabel, InputLabel, MenuItem, Select, Stack,
} from '@mui/material'
import { FaCropAlt } from 'react-icons/fa'
import { DialogRemoveButton } from '../DialogRemoveButton/DialogRemoveButton.jsx'
import { useAdminKitMessages } from '../../locale/useAdminKitMessages.js'

const FREE_ASPECT = 'free'
const CROP_TOLERANCE = 2

const toNaturalCrop = (crop, image) => {
  if (crop.unit === '%') {
    return {
      x: (crop.x / 100) * image.naturalWidth,
      y: (crop.y / 100) * image.naturalHeight,
      width: (crop.width / 100) * image.naturalWidth,
      height: (crop.height / 100) * image.naturalHeight,
    }
  }

  const scaleX = image.naturalWidth / image.width
  const scaleY = image.naturalHeight / image.height

  return {
    x: crop.x * scaleX,
    y: crop.y * scaleY,
    width: crop.width * scaleX,
    height: crop.height * scaleY,
  }
}

const isCropChanged = (crop, image) => {
  if (!crop?.width || !crop?.height || !image) return false

  const { x, y, width, height } = toNaturalCrop(crop, image)
  const coversFullWidth = x <= CROP_TOLERANCE
    && Math.abs(width + x - image.naturalWidth) <= CROP_TOLERANCE
  const coversFullHeight = y <= CROP_TOLERANCE
    && Math.abs(height + y - image.naturalHeight) <= CROP_TOLERANCE

  return !(coversFullWidth && coversFullHeight)
}

const getCroppedImg = (image, crop) => {
  const { x, y, width, height } = toNaturalCrop(crop, image)

  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height

  const ctx = canvas.getContext('2d')

  ctx.drawImage(
    image,
    x,
    y,
    width,
    height,
    0,
    0,
    width,
    height,
  )

  return new Promise((resolve) => {
    canvas.toBlob((blob) => {
      if (!blob) return
      blob.name = 'cropped.jpg'
      const fileUrl = URL.createObjectURL(blob)
      resolve({ blob, fileUrl })
    }, 'image/jpeg', 0.95)
  })
}

/**
 * @typedef {object} IProps
 * @property {string} [imageSrc] - The source of image file.
 * @property {string} [fileName] - The name of image file.
 * @property {function} [onCropped] - The function for change image.
 * @property {function} [onRemove] - The function for remove image.
 */

/**
 * CropControls component.
 * @type {React.FC<IProps>}
 * @returns {React.ReactElement} The Crop controls component.
 */
export const CropControls = ({ imageSrc, fileName, onCropped, onRemove }) => {
  const m = useAdminKitMessages()
  const [isCroppingEnabled, setIsCroppingEnabled] = useState(false)
  const [aspect, setAspect] = useState(FREE_ASPECT)
  const [crop, setCrop] = useState(null)
  const imgRef = useRef(null)
  const [currentImageSrc, setCurrentImageSrc] = useState(imageSrc)

  const onImageLoaded = useCallback((img) => {
    imgRef.current = img

    const aspectRatio = aspect === FREE_ASPECT ? undefined : aspect

    setCrop({
      unit: '%',
      x: 0,
      y: 0,
      width: 100,
      height: 100,
      aspect: aspectRatio,
    })
  }, [aspect])

  const handleCrop = async () => {
    if (crop?.width && crop?.height && imgRef.current && isCropChanged(crop, imgRef.current)) {
      const { blob, fileUrl } = await getCroppedImg(imgRef.current, crop)
      const croppedFile = new File([blob], fileName || 'cropped.jpg', {
        type: 'image/jpeg',
      })
      setCurrentImageSrc(fileUrl)
      onCropped(croppedFile)
    }
  }

  const handleCroppingToggle = useCallback((_, checked) => {
    setIsCroppingEnabled(checked)

    if (checked && imgRef.current) {
      onImageLoaded(imgRef.current)
    } else {
      setCrop(null)
    }
  }, [onImageLoaded])

  useEffect(() => {
    setCurrentImageSrc(imageSrc)
    setIsCroppingEnabled(false)
    setCrop(null)
  }, [imageSrc])

  if (!currentImageSrc) return null

  const canApplyCrop = isCroppingEnabled && isCropChanged(crop, imgRef.current)

  const imageElement = (
    <img
      ref={imgRef}
      src={currentImageSrc}
      onLoad={(e) => {
        if (isCroppingEnabled) {
          onImageLoaded(e.currentTarget)
        }
      }}
      alt='crop'
      style={{ maxHeight: '60vh', maxWidth: '100%' }}
    />
  )

  return (
    <Stack spacing={2} alignItems='center'>
      {isCroppingEnabled ? (
        <ReactCrop
          crop={crop}
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
          label={m.crop.label}
          control={
            <Checkbox
              color='primary'
              checked={isCroppingEnabled}
              onChange={handleCroppingToggle}
            />
          }
        />

        <FormControl size='small' sx={{ minWidth: 200 }} disabled={!isCroppingEnabled}>
          <InputLabel>{m.crop.aspectRatio}</InputLabel>
          <Select
            variant='outlined'
            label={m.crop.aspectRatio}
            value={aspect}
            disabled={!isCroppingEnabled}
            onChange={(e) => setAspect(e.target.value === FREE_ASPECT ? FREE_ASPECT : Number(e.target.value))}
          >
            <MenuItem value={1}>1:1</MenuItem>
            <MenuItem value={16 / 9}>16:9</MenuItem>
            <MenuItem value={4 / 3}>4:3</MenuItem>
            <MenuItem value={FREE_ASPECT}>{m.crop.free}</MenuItem>
          </Select>
        </FormControl>

        <Button
          variant='outlined'
          color='primary'
          startIcon={<FaCropAlt />}
          onClick={handleCrop}
          disabled={!canApplyCrop}
        >
          {m.crop.applyCrop}
        </Button>

        {onRemove && (
          <DialogRemoveButton
            variant='text'
            confirmMessage={m.crop.confirmDeleteImage}
            onRemove={onRemove}
          />
        )}
      </Stack>
    </Stack>
  )
}

CropControls.propTypes = {
  imageSrc: PropTypes.string,
  fileName: PropTypes.string,
  onCropped: PropTypes.func,
  onRemove: PropTypes.func,
}
