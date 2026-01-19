import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import DatesStep from '../DatesStep'

describe('DatesStep', () => {
  it('shows error when end date is before start date', () => {
    render(
      <DatesStep
        startDate="2024-06-10"
        endDate="2024-06-05"
        onChange={vi.fn()}
        onNext={vi.fn()}
        onBack={vi.fn()}
      />
    )

    expect(screen.getByText(/end date must be after start date/i)).toBeInTheDocument()
  })

  it('disables Next button when end date is before start date', () => {
    render(
      <DatesStep
        startDate="2024-06-10"
        endDate="2024-06-05"
        onChange={vi.fn()}
        onNext={vi.fn()}
        onBack={vi.fn()}
      />
    )

    expect(screen.getByRole('button', { name: /next/i })).toBeDisabled()
  })
})
