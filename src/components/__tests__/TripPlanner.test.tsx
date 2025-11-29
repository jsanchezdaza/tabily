import { describe, it, expect, vi } from 'vitest'
import { render } from '@testing-library/react'
import TripPlanner from '../TripPlanner'

// Mock dependencies
vi.mock('../Header', () => ({
  default: () => <div data-testid="header">Header</div>,
}))

vi.mock('../Footer', () => ({
  default: () => <div data-testid="footer">Footer</div>,
}))

vi.mock('../trip-planner/TripPlannerContainer', () => ({
  default: () => <div data-testid="trip-planner-container">Trip Planner Container</div>,
}))

describe('TripPlanner', () => {
  it('renders components in a column layout', () => {
    const { container } = render(<TripPlanner />)
    const mainContainer = container.querySelector('.min-h-screen')
    expect(mainContainer).toHaveClass('flex-col')
  })
})
