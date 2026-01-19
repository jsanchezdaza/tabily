import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import DateRangePicker from '../DateRangePicker'

describe('DateRangePicker', () => {
  it('renders start and end date inputs', () => {
    render(<DateRangePicker startDate="" endDate="" onChange={vi.fn()} />)

    expect(screen.getByLabelText(/start date/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/end date/i)).toBeInTheDocument()
  })

  it('displays start date value', () => {
    render(<DateRangePicker startDate="2024-06-01" endDate="" onChange={vi.fn()} />)

    const startInput = screen.getByLabelText(/start date/i) as HTMLInputElement
    expect(startInput.value).toBe('2024-06-01')
  })

  it('displays end date value', () => {
    render(<DateRangePicker startDate="" endDate="2024-06-07" onChange={vi.fn()} />)

    const endInput = screen.getByLabelText(/end date/i) as HTMLInputElement
    expect(endInput.value).toBe('2024-06-07')
  })

  it('calls onChange when start date changes', async () => {
    const handleChange = vi.fn()
    const user = userEvent.setup()

    render(<DateRangePicker startDate="" endDate="" onChange={handleChange} />)

    const startInput = screen.getByLabelText(/start date/i)
    await user.type(startInput, '2024-06-01')

    expect(handleChange).toHaveBeenCalledWith({ start_date: '2024-06-01' })
  })

  it('calls onChange when end date changes', async () => {
    const handleChange = vi.fn()
    const user = userEvent.setup()

    render(<DateRangePicker startDate="" endDate="" onChange={handleChange} />)

    const endInput = screen.getByLabelText(/end date/i)
    await user.type(endInput, '2024-06-07')

    expect(handleChange).toHaveBeenCalledWith({ end_date: '2024-06-07' })
  })

  it('shows start date error when provided', () => {
    render(
      <DateRangePicker
        startDate=""
        endDate=""
        onChange={vi.fn()}
        errors={{ start_date: 'Start date is required' }}
      />
    )

    expect(screen.getByText(/start date is required/i)).toBeInTheDocument()
  })

  it('shows end date error when provided', () => {
    render(
      <DateRangePicker
        startDate=""
        endDate=""
        onChange={vi.fn()}
        errors={{ end_date: 'End date must be after start date' }}
      />
    )

    expect(screen.getByText(/end date must be after start date/i)).toBeInTheDocument()
  })

  it('has appearance-none class for Safari styling', () => {
    render(<DateRangePicker startDate="" endDate="" onChange={vi.fn()} />)

    const startInput = screen.getByLabelText(/start date/i)
    const endInput = screen.getByLabelText(/end date/i)

    expect(startInput).toHaveClass('appearance-none', 'bg-white')
    expect(endInput).toHaveClass('appearance-none', 'bg-white')
  })
})
