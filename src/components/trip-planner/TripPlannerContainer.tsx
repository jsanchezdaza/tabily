import { useState } from 'react'
import { useTripPlannerState } from '../../hooks/useTripPlannerState'
import { useCreateTrip } from '../../hooks/useCreateTrip'
import { useGeneratePlan } from '../../hooks/useGeneratePlan'
import TripPlanResult from '../TripPlanResult'
import DestinationStep from './DestinationStep'
import DatesStep from './DatesStep'
import BudgetStep from './BudgetStep'

type Phase = 'form' | 'generating' | 'result' | 'error'

function TripPlannerContainer() {
  const [phase, setPhase] = useState<Phase>('form')
  const { currentStep, formData, nextStep, previousStep, updateFormData } = useTripPlannerState()
  const { loading, createTrip } = useCreateTrip()
  const { isLoading, error, plan, generate } = useGeneratePlan()

  const handleSubmit = async () => {
    const tripId = await createTrip(formData)
    if (tripId) {
      setPhase('generating')
      await generate({
        destination: formData.destination,
        startDate: formData.start_date,
        endDate: formData.end_date,
        budget: formData.budget_preference,
      })
    }
  }

  const handlePlanAnother = () => {
    setPhase('form')
  }

  // Determine actual phase based on hook state
  const currentPhase = (() => {
    if (phase === 'generating') {
      if (error) return 'error'
      if (plan) return 'result'
      return 'generating'
    }
    return phase
  })()

  return (
    <div className="w-full max-w-md">
      <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8" data-testid="trip-planner-card">
        {currentPhase === 'form' && (
          <>
            {currentStep === 1 && (
              <DestinationStep
                value={formData.destination}
                onChange={destination => updateFormData({ destination })}
                onNext={nextStep}
              />
            )}

            {currentStep === 2 && (
              <DatesStep
                startDate={formData.start_date}
                endDate={formData.end_date}
                onChange={updateFormData}
                onNext={nextStep}
                onBack={previousStep}
              />
            )}

            {currentStep === 3 && (
              <BudgetStep
                value={formData.budget_preference}
                onChange={budget_preference => updateFormData({ budget_preference })}
                onSubmit={handleSubmit}
                onBack={previousStep}
                isLoading={loading || isLoading}
              />
            )}
          </>
        )}

        {currentPhase === 'generating' && (
          <div className="text-center py-8">
            <p className="text-lg text-gray-700">Creating your personalized travel plan...</p>
          </div>
        )}

        {currentPhase === 'result' && plan && (
          <TripPlanResult plan={plan} onPlanAnother={handlePlanAnother} />
        )}

        {currentPhase === 'error' && (
          <div className="text-center py-8">
            <p className="text-red-600">{error}</p>
            <button
              onClick={handlePlanAnother}
              className="mt-4 text-emerald-600 underline hover:text-emerald-700"
            >
              Try again
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default TripPlannerContainer
