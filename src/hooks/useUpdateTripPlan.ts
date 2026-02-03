import { useState } from 'react'
import { supabase } from '../lib/supabase'

interface UpdateTripPlanResult {
  loading: boolean
  error: string | null
  updatePlan: (tripId: string, plan: string) => Promise<void>
}

export function useUpdateTripPlan(): UpdateTripPlanResult {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const updatePlan = async (tripId: string, plan: string): Promise<void> => {
    setLoading(true)
    setError(null)

    const { error: updateError } = await supabase.from('trips').update({ plan }).eq('id', tripId)

    if (updateError) {
      setError(updateError.message)
    }

    setLoading(false)
  }

  return { loading, error, updatePlan }
}
