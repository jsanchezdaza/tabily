import { describe, it, expect, vi, beforeEach } from 'vitest'
import { act, renderHook } from '@testing-library/react'
import { useUpdateTripPlan } from '../useUpdateTripPlan'
import * as supabaseModule from '../../lib/supabase'

vi.mock('../../lib/supabase', () => ({
  supabase: {
    from: vi.fn(),
  },
}))

describe('useUpdateTripPlan', () => {
  const mockUpdate = vi.fn()
  const mockEq = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
    vi.spyOn(supabaseModule.supabase, 'from').mockReturnValue({
      update: mockUpdate,
    } as never)
    mockUpdate.mockReturnValue({ eq: mockEq })
  })

  it('returns initial state', () => {
    const { result } = renderHook(() => useUpdateTripPlan())

    expect(result.current.loading).toBe(false)
    expect(result.current.error).toBeNull()
    expect(typeof result.current.updatePlan).toBe('function')
  })

  it('updates plan successfully', async () => {
    mockEq.mockResolvedValue({ error: null })

    const { result } = renderHook(() => useUpdateTripPlan())

    await act(async () => {
      await result.current.updatePlan('trip-123', '# My Plan')
    })

    expect(supabaseModule.supabase.from).toHaveBeenCalledWith('trips')
    expect(mockUpdate).toHaveBeenCalledWith({ plan: '# My Plan' })
    expect(mockEq).toHaveBeenCalledWith('id', 'trip-123')
    expect(result.current.error).toBeNull()
  })

  it('sets error on supabase failure', async () => {
    mockEq.mockResolvedValue({ error: { message: 'Update failed' } })

    const { result } = renderHook(() => useUpdateTripPlan())

    await act(async () => {
      await result.current.updatePlan('trip-123', '# My Plan')
    })

    expect(result.current.error).toBe('Update failed')
  })
})
