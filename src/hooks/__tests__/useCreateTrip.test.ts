import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { useCreateTrip } from '../useCreateTrip'
import * as supabaseModule from '../../lib/supabase'
import type { TripFormData } from '../../types/trip'

vi.mock('../../lib/supabase', () => ({
  supabase: {
    from: vi.fn(),
  },
}))

describe('useCreateTrip', () => {
  const mockInsert = vi.fn()
  const mockSelect = vi.fn()
  const mockSingle = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
    vi.spyOn(supabaseModule.supabase, 'from').mockReturnValue({
      insert: mockInsert,
    } as never)
    mockInsert.mockReturnValue({
      select: mockSelect,
    })
    mockSelect.mockReturnValue({
      single: mockSingle,
    })
  })

  it('returns initial loading false state', () => {
    const { result } = renderHook(() => useCreateTrip())

    expect(result.current.loading).toBe(false)
    expect(result.current.error).toBeNull()
  })

  it('creates trip successfully and returns trip id', async () => {
    const mockTrip = {
      id: 'trip-123',
      user_id: 'user-456',
      destination: 'Paris',
      start_date: '2024-06-01',
      end_date: '2024-06-07',
      budget_preference: 'moderate',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }

    mockSingle.mockResolvedValue({ data: mockTrip, error: null })

    const { result } = renderHook(() => useCreateTrip())

    const tripData: TripFormData = {
      destination: 'Paris',
      start_date: '2024-06-01',
      end_date: '2024-06-07',
      budget_preference: 'moderate',
    }

    let tripId: string | null = null
    await waitFor(async () => {
      tripId = await result.current.createTrip(tripData)
    })

    expect(tripId).toBe('trip-123')
    expect(mockInsert).toHaveBeenCalledWith(tripData)
  })

  it('sets loading state during trip creation', async () => {
    mockSingle.mockImplementation(
      () =>
        new Promise(resolve => {
          setTimeout(() => resolve({ data: { id: 'trip-123' }, error: null }), 100)
        })
    )

    const { result } = renderHook(() => useCreateTrip())

    const tripData: TripFormData = {
      destination: 'Paris',
      start_date: '2024-06-01',
      end_date: '2024-06-07',
      budget_preference: 'moderate',
    }

    result.current.createTrip(tripData)

    await waitFor(() => {
      expect(result.current.loading).toBe(true)
    })
  })

  it('handles Supabase errors', async () => {
    const mockError = { message: 'Database error' }
    mockSingle.mockResolvedValue({ data: null, error: mockError })

    const { result } = renderHook(() => useCreateTrip())

    const tripData: TripFormData = {
      destination: 'Paris',
      start_date: '2024-06-01',
      end_date: '2024-06-07',
      budget_preference: 'moderate',
    }

    const tripId = await result.current.createTrip(tripData)

    expect(tripId).toBeNull()
    await waitFor(() => {
      expect(result.current.error).toBe('Database error')
    })
  })
})
