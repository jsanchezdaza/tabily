import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { TripPlanResult } from '../TripPlanResult'

describe('TripPlanResult', () => {
  it('renders the plan content', () => {
    const plan = '# Day 1\nVisit Tokyo Tower'

    render(<TripPlanResult plan={plan} onPlanAnother={() => {}} />)

    expect(screen.getByText(/Day 1/)).toBeInTheDocument()
    expect(screen.getByText(/Visit Tokyo Tower/)).toBeInTheDocument()
  })

  it('calls onPlanAnother when button is clicked', async () => {
    const user = userEvent.setup()
    const onPlanAnother = vi.fn()

    render(<TripPlanResult plan="Test plan" onPlanAnother={onPlanAnother} />)

    await user.click(screen.getByRole('button', { name: /plan another trip/i }))

    expect(onPlanAnother).toHaveBeenCalledTimes(1)
  })
})
