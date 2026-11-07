import { useState } from 'react'
import {
  Box,
  Button,
  Stack,
  Typography,
  styled,
} from '@mui/material'
import FileUploadIcon from '@mui/icons-material/FileUpload'
import UploadDropZone from '@rpldy/upload-drop-zone'
import withPasteUpload from '@rpldy/upload-paste'
import UploadButton from '@rpldy/upload-button'
import { TextField } from '../TextField/TextField'
import { FileUpload } from './FileUpload'
import { useScreen } from '../../hooks/useScreen'
import { formatMessage } from '../../locale/formatMessage'
import { useAdminKitMessages } from '../../locale/useAdminKitMessages'

const StyledTextField = styled(TextField)`
  width: 100%;
  flex: 1;
`

const StyledDropZone = styled(UploadDropZone)`
  width: 100%;
  max-width: 500px;
  min-height: 200px;
  height: 200px;
  display: flex;
  flex: 1;
  box-sizing: border-box;
  align-items: center;
  justify-content: center;
  margin-bottom: 10px;
  border-radius: 4px;
  border: 2px dashed ${({ theme }) => theme.palette.grey[600]};
  background-color: ${({ theme }) => theme.palette.action.hover};
  transition: border-color 0.15s ease, background-color 0.15s ease;

  &:hover {
    border-color: ${({ theme }) => theme.palette.grey[400]};
  }
`

const PasteUploadDropZone = withPasteUpload(StyledDropZone)
const PasteInput = withPasteUpload(StyledTextField)

/**
 * Drop zone shell with primary highlight while a file is dragged over.
 * @type {React.FC<{ children: React.ReactNode }>}
 */
const DragHighlightDropZone = ({ children }) => {
  const [isDragActive, setIsDragActive] = useState(false)

  return (
    <Box
      onDragEnter={(event) => {
        event.preventDefault()
        event.stopPropagation()
        setIsDragActive(true)
      }}
      onDragOver={(event) => {
        event.preventDefault()
        event.stopPropagation()
      }}
      onDragLeave={(event) => {
        event.preventDefault()
        event.stopPropagation()

        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
          setIsDragActive(false)
        }
      }}
      onDrop={() => setIsDragActive(false)}
      sx={{
        width: '100%',
        maxWidth: 500,
        flex: 1,
        '& > div': {
          borderColor: isDragActive ? 'primary.main' : undefined,
          backgroundColor: isDragActive ? 'action.selected' : undefined,
        },
      }}
    >
      {children}
    </Box>
  )
}

/**
 * @typedef {object} ImageUploadMethodsProps
 * @property {(file: File) => void} onFileAdded
 * @property {(files: File[]) => void} [onFilesAdded] - Prefer for multi-file (keeps FileList order).
 * @property {boolean} [multiple]
 * @property {boolean} [hideLabel]
 * @property {string} [pasteParams]
 */

/**
 * Shared upload methods block: drop zone, paste field, file picker.
 * Must be rendered inside an Uploady provider.
 * @type {React.FC<ImageUploadMethodsProps>}
 */
export const ImageUploadMethods = ({
  onFileAdded,
  onFilesAdded,
  multiple = true,
  hideLabel = true,
  pasteParams = 'paste',
}) => {
  const messages = useAdminKitMessages()
  const { isMaxWidth900 } = useScreen()

  const selectLabel = multiple ? messages.upload.selectFiles : messages.upload.selectFile
  const fileNoun = multiple ? messages.upload.fileNounPlural : messages.upload.fileNounSingular

  const handleFilesAdded = (files) => {
    if (onFilesAdded) {
      onFilesAdded(files)
      return
    }

    files.forEach((file) => onFileAdded(file))
  }

  const handlePasteUpload = (event) => {
    const items = event.clipboardData?.items
    if (!items) {
      return
    }

    for (let index = 0; index < items.length; index += 1) {
      if (items[index].type.indexOf('image') !== -1) {
        onFileAdded(items[index].getAsFile())
        break
      }
    }
  }

  return (
    <Stack spacing={2} width='100%'>
      <Stack
        direction={isMaxWidth900 ? 'column' : 'row'}
        spacing={2}
        alignItems='center'
        width='100%'
        flexShrink={0}
      >
        <DragHighlightDropZone>
          <PasteUploadDropZone params={{ test: pasteParams }}>
            <Stack spacing={1} alignItems='center' color='gray' p={1}>
              <Typography>{formatMessage(messages.upload.dropHere, { fileNoun })}</Typography>
              <Typography>{messages.common.or}</Typography>
              <Typography>{messages.upload.pasteHint}</Typography>
              <Typography>{messages.common.or}</Typography>
              <Typography>{formatMessage(messages.upload.chooseViaButton, { fileNoun })}</Typography>
            </Stack>
          </PasteUploadDropZone>
        </DragHighlightDropZone>

        <Stack spacing={5} flex={1} alignItems='center' width='100%' justifyContent='space-evenly'>
          <PasteInput
            extraProps={{ placeholder: messages.upload.clipboardPlaceholder }}
            className='paste-input'
            onPasteUpload={handlePasteUpload}
          />

          <UploadButton className='upload-button'>
            <Button
              fullWidth
              color='primary'
              startIcon={<FileUploadIcon />}
            >
              {selectLabel}
            </Button>
          </UploadButton>
        </Stack>
      </Stack>

      <FileUpload onFilesAdded={handleFilesAdded} hideLabel={hideLabel} />
    </Stack>
  )
}
