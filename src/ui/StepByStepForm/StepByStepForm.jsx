import { Children, useState } from 'react'
import PropTypes from 'prop-types'
import { Stack, Step, StepButton, Stepper } from '@mui/material'
import { STEPS } from './steps.js'

/**
 * @typedef {object} IProps
 * @property {React.ReactNode} [sharedFields] - Locale-independent fields above the stepper.
 * @property {React.ReactNode} ruFields - Russian-language fields.
 * @property {React.ReactNode} enFields - English-language fields.
 */

/**
 * Step by step form page component.
 * @type {React.FC<IProps>}
 * @returns {React.ReactElement} The Step by step form component.
 */
export const StepByStepForm = ({ sharedFields, ruFields, enFields }) => {
  const [activeStep, setActiveStep] = useState(STEPS[0])

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

StepByStepForm.propTypes = {
  sharedFields: PropTypes.node,
  ruFields: PropTypes.node.isRequired,
  enFields: PropTypes.node.isRequired,
}
