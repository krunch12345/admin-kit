import { Children, useState } from 'react'
import type { ReactNode } from 'react'
import { Stack, Step, StepButton, Stepper } from '@mui/material'
import { STEPS } from './steps'
import type { Step as StepData } from './steps'

export interface StepByStepFormProps {
  /** Locale-independent fields above the stepper. */
  sharedFields?: ReactNode
  /** Russian-language fields. */
  ruFields: ReactNode
  /** English-language fields. */
  enFields: ReactNode
}

/**
 * Step by step form page component.
 */
export const StepByStepForm = ({ sharedFields, ruFields, enFields }: StepByStepFormProps) => {
  const [activeStep, setActiveStep] = useState<StepData>(STEPS[0] as StepData)

  return (
    <Stack spacing={4}>
      {sharedFields}

      <Stepper nonLinear activeStep={activeStep.index} sx={{ width: '95%', alignSelf: 'center' }}>
        {Children.toArray(
          STEPS.map(step => (
            <Step>
              <StepButton onClick={() => setActiveStep(step)}>
                {step.label}
              </StepButton>
            </Step>
          ))
        )}
      </Stepper>

      {activeStep.id === 'ru' && ruFields}
      {activeStep.id === 'en' && enFields}
    </Stack>
  )
}
