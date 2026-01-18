import { useState } from 'react'

interface TripData {
  destination: string
  startDate: string
  endDate: string
  budget: string
}

interface GeneratePlanResult {
  isLoading: boolean
  error: string | null
  plan: string | null
  generate: (tripData: TripData) => Promise<void>
}

export function useGeneratePlan(): GeneratePlanResult {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [plan, setPlan] = useState<string | null>(null)

  const generate = async (_tripData: TripData): Promise<void> => {
    setIsLoading(true)
    setError(null)
    setPlan(null)
  }

  return { isLoading, error, plan, generate }
}
