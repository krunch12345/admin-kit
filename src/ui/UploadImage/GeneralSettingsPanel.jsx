import { Children, useCallback, useEffect, useMemo, useState } from 'react'
import PropTypes from 'prop-types'
import {
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
  Stack,
  Typography,
} from '@mui/material'
import { ArrowBack } from '@mui/icons-material'
import { IconButton } from '../IconButton/IconButton.jsx'
import {
  COPYABLE_META_FIELDS,
  isCopyableFieldFilled,
} from '../ImageMetaFields/imageMetaFields.js'
import { SelectableImageThumb } from './SelectableImageThumb.jsx'

const SCENARIO_COPY = 'copy'
const SCENARIO_APPLY = 'apply'

const createInitialState = () => ({
  scenario: '',
  skipCompression: false,
  descriptionTemplateLabel: '',
  sourceTemplateLabel: '',
  selectedIds: [],
  copyFieldKeys: [],
  sourceId: '',
  targetIds: [],
})

/**
 * @typedef {object} GeneralSettingsPanelProps
 * @property {object[]} images
 * @property {function(string[], object): (void|Promise<{ failedIds?: string[] }|void>)} onApplyBulkUpdate
 * @property {function({ sourceId: string, targetIds: string[], fieldKeys: string[] }): (void|Promise<{ failedIds?: string[] }|void>)} onCopyFields
 * @property {function(): void} onSaved
 * @property {function(boolean): void} [onDirtyChange]
 * @property {boolean} [hideSkipCompression]
 * @property {import('../ImageMetaFields/imageMetaFields.js').ImageMetaTemplates} [templates] - Bulk-apply description and source templates.
 */

/**
 * Bulk settings / field-copy panel for image lists (pending upload or existing).
 * @type {React.FC<GeneralSettingsPanelProps>}
 */
export const GeneralSettingsPanel = ({
  images,
  onApplyBulkUpdate,
  onCopyFields,
  onSaved,
  onDirtyChange,
  hideSkipCompression = false,
  templates = {},
}) => {
  const descriptionTemplates = useMemo(
    () => templates.description || [],
    [templates.description],
  )
  const sourceTemplates = useMemo(
    () => templates.source || [],
    [templates.source],
  )

  const [state, setState] = useState(createInitialState)

  const {
    scenario,
    skipCompression,
    descriptionTemplateLabel,
    sourceTemplateLabel,
    selectedIds,
    copyFieldKeys,
    sourceId,
    targetIds,
  } = state

  const effectiveSkipCompression = hideSkipCompression ? false : skipCompression

  const isDirty = Boolean(
    scenario
    || effectiveSkipCompression
    || descriptionTemplateLabel
    || sourceTemplateLabel
    || selectedIds.length
    || copyFieldKeys.length
    || sourceId
    || targetIds.length
  )

  useEffect(() => {
    onDirtyChange?.(isDirty)
  }, [isDirty, onDirtyChange])

  const isCopyScenario = scenario === SCENARIO_COPY
  const isApplyScenario = scenario === SCENARIO_APPLY

  const selectedCopyFields = useMemo(
    () => COPYABLE_META_FIELDS.filter((field) => copyFieldKeys.includes(field.key)),
    [copyFieldKeys]
  )

  const sourceCandidates = useMemo(() => {
    if (!isCopyScenario || !selectedCopyFields.length) {
      return []
    }

    return images.filter((image) => (
      selectedCopyFields.every((field) => isCopyableFieldFilled(image, field))
    ))
  }, [images, isCopyScenario, selectedCopyFields])

  const sourceImage = useMemo(
    () => images.find((image) => image.id === sourceId) || null,
    [images, sourceId]
  )

  const targetCandidates = useMemo(
    () => images.filter((image) => image.id !== sourceId),
    [images, sourceId]
  )

  const hasBulkOption = effectiveSkipCompression
    || Boolean(descriptionTemplateLabel)
    || Boolean(sourceTemplateLabel)

  const canSaveBulk = isApplyScenario
    && hasBulkOption
    && selectedIds.length > 0

  const canSaveCopy = isCopyScenario
    && copyFieldKeys.length > 0
    && Boolean(sourceId)
    && targetIds.length > 0

  const canSave = canSaveBulk || canSaveCopy

  const handleScenarioChange = useCallback((event) => {
    const nextScenario = event.target.value

    setState({
      ...createInitialState(),
      scenario: nextScenario,
    })
  }, [])

  const toggleSelectedId = useCallback((id) => {
    setState((prev) => {
      const isSelected = prev.selectedIds.includes(id)

      return {
        ...prev,
        selectedIds: isSelected
          ? prev.selectedIds.filter((itemId) => itemId !== id)
          : [...prev.selectedIds, id],
      }
    })
  }, [])

  const handleSelectAllImages = useCallback(() => {
    setState((prev) => ({
      ...prev,
      selectedIds: images.map((image) => image.id),
    }))
  }, [images])

  const toggleTargetId = useCallback((id) => {
    setState((prev) => {
      const isSelected = prev.targetIds.includes(id)

      return {
        ...prev,
        targetIds: isSelected
          ? prev.targetIds.filter((itemId) => itemId !== id)
          : [...prev.targetIds, id],
      }
    })
  }, [])

  const handleSkipCompressionChange = useCallback((_, checked) => {
    setState((prev) => {
      const hasOption = checked
        || Boolean(prev.descriptionTemplateLabel)
        || Boolean(prev.sourceTemplateLabel)

      return {
        ...prev,
        skipCompression: checked,
        selectedIds: hasOption ? prev.selectedIds : [],
      }
    })
  }, [])

  const handleDescriptionTemplateChange = useCallback((label) => (_, checked) => {
    setState((prev) => {
      const nextDescriptionLabel = checked ? label : ''
      const hasOption = (!hideSkipCompression && prev.skipCompression)
        || Boolean(nextDescriptionLabel)
        || Boolean(prev.sourceTemplateLabel)

      return {
        ...prev,
        descriptionTemplateLabel: nextDescriptionLabel,
        selectedIds: hasOption ? prev.selectedIds : [],
      }
    })
  }, [hideSkipCompression])

  const handleSourceTemplateChange = useCallback((label) => (_, checked) => {
    setState((prev) => {
      const nextSourceLabel = checked ? label : ''
      const hasOption = (!hideSkipCompression && prev.skipCompression)
        || Boolean(prev.descriptionTemplateLabel)
        || Boolean(nextSourceLabel)

      return {
        ...prev,
        sourceTemplateLabel: nextSourceLabel,
        selectedIds: hasOption ? prev.selectedIds : [],
      }
    })
  }, [hideSkipCompression])

  const handleCopyFieldChange = useCallback((key) => (_, checked) => {
    setState((prev) => {
      const nextKeys = checked
        ? [...prev.copyFieldKeys, key]
        : prev.copyFieldKeys.filter((item) => item !== key)

      return {
        ...prev,
        copyFieldKeys: nextKeys,
        sourceId: '',
        targetIds: [],
      }
    })
  }, [])

  const handleSelectSource = useCallback((id) => {
    setState((prev) => ({
      ...prev,
      sourceId: id,
      targetIds: [],
    }))
  }, [])

  const handleBackFromSource = useCallback(() => {
    setState((prev) => ({
      ...prev,
      sourceId: '',
      targetIds: [],
    }))
  }, [])

  const handleSelectAllTargets = useCallback(() => {
    setState((prev) => ({
      ...prev,
      targetIds: targetCandidates.map((image) => image.id),
    }))
  }, [targetCandidates])

  const handleSave = useCallback(async () => {
    if (isCopyScenario) {
      if (!canSaveCopy) return

      const copyResult = await onCopyFields({
        sourceId,
        targetIds,
        fieldKeys: copyFieldKeys,
      })

      const failedIds = copyResult?.failedIds

      if (Array.isArray(failedIds) && failedIds.length > 0) {
        setState((prev) => ({
          ...prev,
          targetIds: failedIds,
        }))
        return
      }

      onSaved()
      return
    }

    if (!canSaveBulk) return

    const partial = {}

    if (effectiveSkipCompression) {
      partial.skipCompression = true
    }

    const descriptionTemplate = descriptionTemplates.find(
      (item) => item.label === descriptionTemplateLabel
    )
    const sourceTemplate = sourceTemplates.find(
      (item) => item.label === sourceTemplateLabel
    )

    if (descriptionTemplate) {
      partial.description = descriptionTemplate.ru
      partial.descriptionEN = descriptionTemplate.en
    }

    if (sourceTemplate) {
      partial.source = sourceTemplate.ru
      partial.sourceEN = sourceTemplate.en
    }

    const applyResult = await onApplyBulkUpdate(selectedIds, partial)
    const failedIds = applyResult?.failedIds

    if (Array.isArray(failedIds) && failedIds.length > 0) {
      setState((prev) => ({
        ...prev,
        selectedIds: failedIds,
      }))
      return
    }

    onSaved()
  }, [
    canSaveBulk,
    canSaveCopy,
    copyFieldKeys,
    descriptionTemplateLabel,
    descriptionTemplates,
    effectiveSkipCompression,
    isCopyScenario,
    onApplyBulkUpdate,
    onCopyFields,
    onSaved,
    selectedIds,
    sourceId,
    sourceTemplateLabel,
    sourceTemplates,
    targetIds,
  ])

  return (
    <Stack spacing={2} width='100%' alignItems='stretch'>
      <FormControl>
        <RadioGroup
          value={scenario}
          onChange={handleScenarioChange}
        >
          <FormControlLabel
            value={SCENARIO_COPY}
            control={<Radio color='primary' />}
            label='Скопировать любое поле любого изображения выбранным изображениям'
          />
          <FormControlLabel
            value={SCENARIO_APPLY}
            control={<Radio color='primary' />}
            label='Применить выбранную настройку для выбранных изображений'
          />
        </RadioGroup>
      </FormControl>

      {isCopyScenario && (
        <Stack spacing={2} width='100%'>
          <Stack
            direction='row'
            spacing={1}
            flexWrap='wrap'
            useFlexGap
            sx={{ pl: 1.375 }}
          >
            {Children.toArray(
              COPYABLE_META_FIELDS.map(({ key, label }) => (
                <FormControlLabel
                  label={label}
                  control={
                    <Checkbox
                      color='primary'
                      checked={copyFieldKeys.includes(key)}
                      onChange={handleCopyFieldChange(key)}
                    />
                  }
                />
              ))
            )}
          </Stack>

          {copyFieldKeys.length > 0 && !sourceId && (
            <Stack spacing={1} width='100%'>
              <Typography variant='body2' color='text.secondary'>
                Выберете изображение с которого будем копировать.
              </Typography>

              <Stack
                direction='row'
                spacing={2}
                flexWrap='wrap'
                useFlexGap
              >
                {Children.toArray(
                  sourceCandidates.map((image) => (
                    <SelectableImageThumb
                      image={image}
                      selected={false}
                      onClick={() => handleSelectSource(image.id)}
                    />
                  ))
                )}
              </Stack>

              {!sourceCandidates.length && (
                <Typography variant='body2' color='text.disabled'>
                  Нет изображений с заполненными выбранными полями
                </Typography>
              )}
            </Stack>
          )}

          {sourceImage && (
            <Stack spacing={2} width='100%'>
              <Stack direction='row' spacing={1} alignItems='center'>
                <IconButton
                  title='Изменить выбор'
                  onClick={handleBackFromSource}
                  icon={<ArrowBack />}
                />
                <SelectableImageThumb
                  image={sourceImage}
                  selected
                  disableSelection
                />
              </Stack>

              <Stack
                direction='row'
                spacing={2}
                alignItems='center'
                flexWrap='wrap'
                useFlexGap
              >
                <Typography variant='body2' color='text.secondary'>
                  Выберете изображения куда будем копировать.
                </Typography>
                <Button
                  size='small'
                  variant='outlined'
                  onClick={handleSelectAllTargets}
                  disabled={!targetCandidates.length}
                >
                  Выбрать все
                </Button>
              </Stack>

              <Stack
                direction='row'
                spacing={2}
                flexWrap='wrap'
                useFlexGap
              >
                {Children.toArray(
                  targetCandidates.map((image) => (
                    <SelectableImageThumb
                      image={image}
                      selected={targetIds.includes(image.id)}
                      onClick={() => toggleTargetId(image.id)}
                    />
                  ))
                )}
              </Stack>
            </Stack>
          )}
        </Stack>
      )}

      {isApplyScenario && (
        <Stack spacing={2} width='100%'>
          <Stack spacing={1} width='100%'>
            {!hideSkipCompression && (
              <FormControlLabel
                label='Без сжатия'
                control={
                  <Checkbox
                    color='primary'
                    checked={skipCompression}
                    onChange={handleSkipCompressionChange}
                  />
                }
              />
            )}

            {descriptionTemplates.length > 0 && (
              <>
                <Typography variant='subtitle2'>Описание</Typography>
                <Stack
                  direction='row'
                  spacing={1}
                  flexWrap='wrap'
                  useFlexGap
                  sx={{ pl: 1.375 }}
                >
                  {Children.toArray(
                    descriptionTemplates.map(({ label }) => (
                      <FormControlLabel
                        label={label}
                        control={
                          <Checkbox
                            color='primary'
                            checked={descriptionTemplateLabel === label}
                            onChange={handleDescriptionTemplateChange(label)}
                          />
                        }
                      />
                    ))
                  )}
                </Stack>
              </>
            )}

            {sourceTemplates.length > 0 && (
              <>
                <Typography variant='subtitle2'>Источник</Typography>
                <Stack
                  direction='row'
                  spacing={1}
                  flexWrap='wrap'
                  useFlexGap
                  sx={{ pl: 1.375 }}
                >
                  {Children.toArray(
                    sourceTemplates.map(({ label }) => (
                      <FormControlLabel
                        label={label}
                        control={
                          <Checkbox
                            color='primary'
                            checked={sourceTemplateLabel === label}
                            onChange={handleSourceTemplateChange(label)}
                          />
                        }
                      />
                    ))
                  )}
                </Stack>
              </>
            )}
          </Stack>

          {hasBulkOption && (
            <Stack spacing={1} width='100%'>
              <Stack
                direction='row'
                spacing={2}
                alignItems='center'
                flexWrap='wrap'
                useFlexGap
              >
                <Typography variant='body2' color='text.secondary'>
                  Выберете изображения для применения настройки.
                </Typography>
                <Button
                  size='small'
                  variant='outlined'
                  onClick={handleSelectAllImages}
                  disabled={!images.length}
                >
                  Выбрать все
                </Button>
              </Stack>

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
                      selected={selectedIds.includes(image.id)}
                      onClick={() => toggleSelectedId(image.id)}
                    />
                  ))
                )}
              </Stack>
            </Stack>
          )}
        </Stack>
      )}

      {Boolean(scenario) && (
        <Button
          variant='contained'
          color='primary'
          disabled={!canSave}
          onClick={handleSave}
          sx={{ alignSelf: 'flex-start' }}
        >
          Сохранить
        </Button>
      )}
    </Stack>
  )
}

GeneralSettingsPanel.propTypes = {
  images: PropTypes.arrayOf(PropTypes.object).isRequired,
  onApplyBulkUpdate: PropTypes.func.isRequired,
  onCopyFields: PropTypes.func.isRequired,
  onSaved: PropTypes.func.isRequired,
  onDirtyChange: PropTypes.func,
  hideSkipCompression: PropTypes.bool,
  templates: PropTypes.shape({
    description: PropTypes.arrayOf(PropTypes.object),
    source: PropTypes.arrayOf(PropTypes.object),
  }),
}
