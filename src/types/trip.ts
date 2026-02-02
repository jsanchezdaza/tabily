export interface Trip {
  id: string
  user_id: string
  destination: string
  start_date: string
  end_date: string
  budget_preference: 'free' | 'poor' | 'moderate' | 'unlimited'
  plan: string | null
  created_at: string
  updated_at: string
}

export interface TripFormData {
  destination: string
  start_date: string
  end_date: string
  budget_preference: string
}
