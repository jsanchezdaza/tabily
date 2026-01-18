import { act, renderHook, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { useGeneratePlan, type TripData } from '../useGeneratePlan'
import * as supabaseModule from '../../lib/supabase'

vi.mock('../../lib/supabase', () => ({
  supabase: {
    functions: {
      invoke: vi.fn(),
    },
  },
}))

describe('useGeneratePlan', () => {
  const mockInvoke = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
    vi.spyOn(supabaseModule.supabase.functions, 'invoke').mockImplementation(mockInvoke)
  })

  it('returns initial state', () => {
    const { result } = renderHook(() => useGeneratePlan())

    expect(result.current.isLoading).toBe(false)
    expect(result.current.error).toBeNull()
    expect(result.current.plan).toBeNull()
    expect(typeof result.current.generate).toBe('function')
  })

  it('sets loading state when generate is called', async () => {
    // Mock supabase.functions.invoke to return a pending promise
    mockInvoke.mockImplementation(
      () =>
        new Promise(resolve => {
          setTimeout(() => resolve({ data: { plan: 'test plan' }, error: null }), 100)
        })
    )

    const { result } = renderHook(() => useGeneratePlan())

    const tripData: TripData = {
      destination: 'Paris',
      startDate: '2024-06-01',
      endDate: '2024-06-07',
      budget: 'moderate',
    }

    act(() => {
      result.current.generate(tripData)
    })

    await waitFor(() => {
      expect(result.current.isLoading).toBe(true)
    })

    expect(mockInvoke).toHaveBeenCalledWith('generate-travel-plan', { body: tripData })
  })
})
