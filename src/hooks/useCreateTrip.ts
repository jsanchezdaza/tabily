import { useState } from 'react'
import { supabase } from '../lib/supabase'
import type { TripFormData } from '../types/trip'

export function useCreateTrip() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const createTrip = async (tripData: TripFormData): Promise<string | null> => {
    try {
      setLoading(true)
      setError(null)

      const { data, error: supabaseError } = await supabase
        .from('trips')
        .insert(tripData)
        .select()
        .single()

      if (supabaseError) {
        setError(supabaseError.message)
        return null
      }

      return data.id
    } catch {
      setError('An unexpected error occurred')
      return null
    } finally {
      setLoading(false)
    }
  }

  return { loading, error, createTrip }
}
