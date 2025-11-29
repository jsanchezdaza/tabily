import { describe, it, expect } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useTripPlannerState } from '../useTripPlannerState'

describe('useTripPlannerState', () => {
  it('initializes with step 1 and empty form data', () => {
    const { result } = renderHook(() => useTripPlannerState())

    expect(result.current.currentStep).toBe(1)
    expect(result.current.formData).toEqual({
      destination: '',
      start_date: '',
      end_date: '',
      budget_preference: '',
    })
  })

  it('advances to next step', () => {
    const { result } = renderHook(() => useTripPlannerState())

    act(() => {
      result.current.nextStep()
    })

    expect(result.current.currentStep).toBe(2)
  })

  it('goes back to previous step', () => {
    const { result } = renderHook(() => useTripPlannerState())

    act(() => {
      result.current.nextStep()
      result.current.nextStep()
    })

    expect(result.current.currentStep).toBe(3)

    act(() => {
      result.current.previousStep()
    })

    expect(result.current.currentStep).toBe(2)
  })

  it('does not go below step 1', () => {
    const { result } = renderHook(() => useTripPlannerState())

    act(() => {
      result.current.previousStep()
    })

    expect(result.current.currentStep).toBe(1)
  })

  it('updates form data', () => {
    const { result } = renderHook(() => useTripPlannerState())

    act(() => {
      result.current.updateFormData({ destination: 'Paris' })
    })

    expect(result.current.formData.destination).toBe('Paris')
  })

  it('preserves existing form data when updating', () => {
    const { result } = renderHook(() => useTripPlannerState())

    act(() => {
      result.current.updateFormData({ destination: 'Paris' })
      result.current.updateFormData({ start_date: '2024-06-01' })
    })

    expect(result.current.formData).toEqual({
      destination: 'Paris',
      start_date: '2024-06-01',
      end_date: '',
      budget_preference: '',
    })
  })
})
