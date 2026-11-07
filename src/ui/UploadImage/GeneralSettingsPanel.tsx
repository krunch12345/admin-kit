import { useCallback, useEffect, useMemo, useState } from 'react'
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
import { IconButton } from '../IconButton/IconButton'
import { isCopyableFieldFilled } from '../ImageMetaFields/imageMetaFieldsConfig'
import type { ImageMetaTemplates } from '../ImageMetaFields/imageMetaFieldsConfig'
import { SelectableImageThumb } from './SelectableImageThumb'
import { TemplateCheckboxGroup } from './TemplateCheckboxGroup'
import { ThumbGrid } from './ThumbGrid'
import { useAdminKitMessages } from '../../locale/useAdminKitMessages'
import { useCopyableMetaFields } from '../../locale/useImageMetaFields'

const SCENARIO_COPY = 'copy'
const SCENARIO_APPLY = 'apply'

interface PanelState {
  scenario: string
  skipCompression: boolean
  descriptionTemplateLabel: string
  sourceTemplateLabel: string
  selectedIds: string[]
  copyFieldKeys: string[]
  sourceId: string
  targetIds: string[]
}

const createInitialState = (): PanelState => ({
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
 * @property {import('../ImageMetaFields/imageMetaFieldsConfig').ImageMetaTemplates} [templates] - Bulk-apply description and source templates.
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
  templates = {} as ImageMetaTemplates,
}) => {
  const messages = useAdminKitMessages()
  const copyableMetaFields = useCopyableMetaFields()

  const descriptionTemplates = useMemo(
    () => templates.description || [],
    [templates.description],
  )
  const sourceTemplates = useMemo(
    () => templates.source || [],
    [templates.source],
  )

  const descriptionTemplateOptions = useMemo(
    () => descriptionTemplates.map(({ label }) => ({ key: label, label })),
    [descriptionTemplates],
  )
  const sourceTemplateOptions = useMemo(
    () => sourceTemplates.map(({ label }) => ({ key: label, label })),
    [sourceTemplates],
  )

  const [state, setState] = useState<PanelState>(createInitialState)

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
    () => copyableMetaFields.filter((field) => copyFieldKeys.includes(field.key)),
    [copyFieldKeys, copyableMetaFields],
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

  const handleDescriptionTemplateChange = useCallback((label, checked) => {
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

  const handleSourceTemplateChange = useCallback((label, checked) => {
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

  const handleCopyFieldChange = useCallback((key, checked) => {
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

    const partial: Record<string, unknown> = {}

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
            label={messages.upload.copyAnyField}
          />
          <FormControlLabel
            value={SCENARIO_APPLY}
            control={<Radio color='primary' />}
            label={messages.upload.applySetting}
          />
        </RadioGroup>
      </FormControl>

      {isCopyScenario && (
        <Stack spacing={2} width='100%'>
          <TemplateCheckboxGroup
            options={copyableMetaFields}
            isChecked={(key) => copyFieldKeys.includes(key)}
            onChange={handleCopyFieldChange}
          />

          {copyFieldKeys.length > 0 && !sourceId && (
            <Stack spacing={1} width='100%'>
              <Typography variant='body2' color='text.secondary'>
                {messages.upload.pickSource}
              </Typography>

              <ThumbGrid
                images={sourceCandidates}
                onSelect={(image) => handleSelectSource(image.id)}
              />

              {!sourceCandidates.length && (
                <Typography variant='body2' color='text.disabled'>
                  {messages.upload.noFilledImages}
                </Typography>
              )}
            </Stack>
          )}

          {sourceImage && (
            <Stack spacing={2} width='100%'>
              <Stack direction='row' spacing={1} alignItems='center'>
                <IconButton
                  title={messages.common.changeSelection}
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
                  {messages.upload.pickTargets}
                </Typography>
                <Button
                  size='small'
                  variant='outlined'
                  onClick={handleSelectAllTargets}
                  disabled={!targetCandidates.length}
                >
                  {messages.common.selectAll}
                </Button>
              </Stack>

              <ThumbGrid
                images={targetCandidates}
                isSelected={(image) => targetIds.includes(image.id)}
                onSelect={(image) => toggleTargetId(image.id)}
              />
            </Stack>
          )}
        </Stack>
      )}

      {isApplyScenario && (
        <Stack spacing={2} width='100%'>
          <Stack spacing={1} width='100%'>
            {!hideSkipCompression && (
              <FormControlLabel
                label={messages.common.noCompression}
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
                <Typography variant='subtitle2'>{messages.common.description}</Typography>
                <TemplateCheckboxGroup
                  options={descriptionTemplateOptions}
                  isChecked={(label) => descriptionTemplateLabel === label}
                  onChange={handleDescriptionTemplateChange}
                />
              </>
            )}

            {sourceTemplates.length > 0 && (
              <>
                <Typography variant='subtitle2'>{messages.common.source}</Typography>
                <TemplateCheckboxGroup
                  options={sourceTemplateOptions}
                  isChecked={(label) => sourceTemplateLabel === label}
                  onChange={handleSourceTemplateChange}
                />
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
                  {messages.upload.pickImagesForSetting}
                </Typography>
                <Button
                  size='small'
                  variant='outlined'
                  onClick={handleSelectAllImages}
                  disabled={!images.length}
                >
                  {messages.common.selectAll}
                </Button>
              </Stack>

              <ThumbGrid
                images={images}
                isSelected={(image) => selectedIds.includes(image.id)}
                onSelect={(image) => toggleSelectedId(image.id)}
              />
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
          {messages.common.save}
        </Button>
      )}
    </Stack>
  )
}
