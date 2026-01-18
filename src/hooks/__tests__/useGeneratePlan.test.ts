import { renderHook } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { useGeneratePlan } from '../useGeneratePlan'

describe('useGeneratePlan', () => {
  it('returns initial state', () => {
    const { result } = renderHook(() => useGeneratePlan())

    expect(result.current.isLoading).toBe(false)
    expect(result.current.error).toBeNull()
    expect(result.current.plan).toBeNull()
    expect(typeof result.current.generate).toBe('function')
  })
})
