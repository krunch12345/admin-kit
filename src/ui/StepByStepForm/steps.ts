import type { ReactNode } from 'react'

export interface StepByStepFormStep {
  /** Stable step id used for active-step state. */
  id: string
  /** Label shown in the stepper. */
  label: string
  /** Body rendered when this step is active. */
  content: ReactNode
}
