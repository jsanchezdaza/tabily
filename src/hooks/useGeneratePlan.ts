import { useState } from 'react'
import { supabase } from '../lib/supabase'

export interface TripData {
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

  const generate = async (tripData: TripData): Promise<void> => {
    setIsLoading(true)
    setError(null)
    setPlan(null)

    try {
      const { data, error: invokeError } = await supabase.functions.invoke('generate-travel-plan', {
        body: tripData,
      })

      if (invokeError) {
        setError(invokeError.message)
        return
      }

      setPlan(data.plan)
    } catch (err) {
      const message = err instanceof Error ? err.message : 'An error occurred'
      setError(message)
    } finally {
      setIsLoading(false)
    }
  }

  return { isLoading, error, plan, generate }
}
