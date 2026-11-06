import { Box, Divider, Stack } from '@mui/material'
import PropTypes from 'prop-types'
import { DialogRemoveButton } from '../DialogRemoveButton/DialogRemoveButton.jsx'
import { CropControls } from '../CropControls/CropControls.jsx'

/**
 * @typedef {object} PendingImageItemProps
 * @property {{ id: string, file: File, imageSrc: string, fileName: string }} item - Pending image data.
 * @property {boolean} [canCut] - Whether crop controls are shown.
 * @property {boolean} showDivider - Whether to show divider above the item.
 * @property {function(string, File): void} onFileChange - Updates file for an item.
 * @property {function(string): void} onRemove - Removes item by id.
 * @property {function(string, string): void} [onFileNameChange] - Updates file name for an item.
 */

/**
 * Single pending image row in upload modal.
 * @type {React.FC<PendingImageItemProps>}
 * @returns {React.ReactElement}
 */
export const PendingImageItem = ({
  item,
  canCut,
  showDivider,
  onFileChange,
  onRemove,
}) => (
  <>
    {showDivider && (
      <Divider flexItem sx={{ width: '100%', borderBottomWidth: 2, borderColor: 'grey.500' }} />
    )}

    <Stack spacing={2} alignItems='center' width='100%'>
      {canCut ? (
        item.imageSrc ? (
          <CropControls
            imageSrc={item.imageSrc}
            fileName={item.fileName}
            onCropped={(file) => onFileChange(item.id, file)}
            onRemove={() => onRemove(item.id)}
          />
        ) : (
          <DialogRemoveButton
            variant='text'
            confirmMessage='Вы точно хотите удалить это изображение?'
            onRemove={() => onRemove(item.id)}
          />
        )
      ) : (
        <>
          {item.imageSrc ? (
            <Box
              component='img'
              src={item.imageSrc}
              alt=''
              sx={{ maxHeight: '60vh', maxWidth: '100%' }}
            />
          ) : null}

          <DialogRemoveButton
            variant='text'
            confirmMessage='Вы точно хотите удалить это изображение?'
            onRemove={() => onRemove(item.id)}
          />
        </>
      )}
    </Stack>
  </>
)

PendingImageItem.propTypes = {
  item: PropTypes.shape({
    id: PropTypes.string.isRequired,
    file: PropTypes.instanceOf(File).isRequired,
    imageSrc: PropTypes.string.isRequired,
    fileName: PropTypes.string.isRequired,
  }).isRequired,
  canCut: PropTypes.bool,
  showDivider: PropTypes.bool.isRequired,
  onFileChange: PropTypes.func.isRequired,
  onRemove: PropTypes.func.isRequired,
}
