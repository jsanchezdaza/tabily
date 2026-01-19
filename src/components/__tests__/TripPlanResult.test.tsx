import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { TripPlanResult } from '../TripPlanResult'

describe('TripPlanResult', () => {
  it('renders the plan content', () => {
    const plan = '# Day 1\nVisit Tokyo Tower'

    render(<TripPlanResult plan={plan} onPlanAnother={() => {}} />)

    expect(screen.getByText(/Day 1/)).toBeInTheDocument()
    expect(screen.getByText(/Visit Tokyo Tower/)).toBeInTheDocument()
  })
})
