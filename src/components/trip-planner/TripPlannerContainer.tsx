import { useNavigate } from 'react-router-dom'
import { useTripPlannerState } from '../../hooks/useTripPlannerState'
import { useCreateTrip } from '../../hooks/useCreateTrip'
import DestinationStep from './DestinationStep'
import DatesStep from './DatesStep'
import BudgetStep from './BudgetStep'

function TripPlannerContainer() {
  const navigate = useNavigate()
  const { currentStep, formData, nextStep, previousStep, updateFormData } = useTripPlannerState()
  const { loading, createTrip } = useCreateTrip()

  const handleSubmit = async () => {
    const tripId = await createTrip(formData)
    if (tripId) {
      navigate(`/trip/${tripId}`)
    }
  }

  return (
    <div className="w-full max-w-md">
      <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8" data-testid="trip-planner-card">
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
            isLoading={loading}
          />
        )}
      </div>
    </div>
  )
}

export default TripPlannerContainer
