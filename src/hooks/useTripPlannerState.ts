import { useState } from 'react'
import type { TripFormData } from '../types/trip'

export function useTripPlannerState() {
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState<TripFormData>({
    destination: '',
    start_date: '',
    end_date: '',
    budget_preference: '',
  })

  const nextStep = () => setCurrentStep(prev => prev + 1)

  const previousStep = () => setCurrentStep(prev => Math.max(1, prev - 1))

  const updateFormData = (data: Partial<TripFormData>) => {
    setFormData(prev => ({ ...prev, ...data }))
  }

  return {
    currentStep,
    formData,
    nextStep,
    previousStep,
    updateFormData,
  }
}
