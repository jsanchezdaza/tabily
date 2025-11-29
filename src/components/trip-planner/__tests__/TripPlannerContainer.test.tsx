import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import TripPlannerContainer from '../TripPlannerContainer'

vi.mock('../../../hooks/useTripPlannerState', () => ({
  useTripPlannerState: () => ({
    currentStep: 1,
    formData: { destination: '', start_date: '', end_date: '', budget_preference: '' },
    nextStep: vi.fn(),
    previousStep: vi.fn(),
    updateFormData: vi.fn(),
  }),
}))

vi.mock('../../../hooks/useCreateTrip', () => ({
  useCreateTrip: () => ({
    loading: false,
    createTrip: vi.fn(),
  }),
}))

describe('TripPlannerContainer', () => {
  it('uses responsive padding on the card', () => {
    render(
      <BrowserRouter>
        <TripPlannerContainer />
      </BrowserRouter>
    )

    const card = screen.getByTestId('trip-planner-card')
    expect(card).toHaveClass('p-6', 'sm:p-8')
  })
})
