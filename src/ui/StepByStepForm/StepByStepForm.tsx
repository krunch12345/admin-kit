import { Children, useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import { Stack, Step, StepButton, Stepper } from '@mui/material'
import type { StepByStepFormStep } from './steps'

export type { StepByStepFormStep } from './steps'

export interface StepByStepFormProps {
  /** Optional fields shown above the stepper on every step. */
  sharedFields?: ReactNode
  /** Ordered steps; any length ≥ 1. */
  steps: StepByStepFormStep[]
  /** Initial active step id; defaults to the first step. */
  initialStepId?: string
}

/**
 * Generic multi-step form shell with a non-linear MUI stepper.
 */
export const StepByStepForm = ({
  sharedFields,
  steps,
  initialStepId,
}: StepByStepFormProps) => {
  const [activeStepId, setActiveStepId] = useState(
    () => initialStepId ?? steps[0]?.id,
  )

  useEffect(() => {
    if (!steps.some((step) => step.id === activeStepId)) {
      setActiveStepId(steps[0]?.id)
    }
  }, [activeStepId, steps])

  const activeIndex = steps.findIndex((step) => step.id === activeStepId)
  const activeStep = steps[activeIndex] ?? steps[0]

  if (!steps.length || !activeStep) {
    return sharedFields ? <Stack spacing={4}>{sharedFields}</Stack> : null
  }

  return (
    <Stack spacing={4}>
      {sharedFields}

      <Stepper
        nonLinear
        activeStep={Math.max(activeIndex, 0)}
        sx={{ width: '95%', alignSelf: 'center' }}
      >
        {Children.toArray(
          steps.map((step) => (
            <Step>
              <StepButton onClick={() => setActiveStepId(step.id)}>
                {step.label}
              </StepButton>
            </Step>
          )),
        )}
      </Stepper>

      {activeStep.content}
    </Stack>
  )
}
