import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import BudgetOptions from '../BudgetOptions'

describe('BudgetOptions', () => {
  it('renders all budget options', () => {
    render(<BudgetOptions value="" onChange={vi.fn()} />)

    expect(screen.getByLabelText(/only show free activities/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/my budget is poor/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/i have budget for several activities/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/i don't care about money/i)).toBeInTheDocument()
  })

  it('calls onChange when option is selected', async () => {
    const handleChange = vi.fn()
    const user = userEvent.setup()

    render(<BudgetOptions value="" onChange={handleChange} />)

    const moderateOption = screen.getByLabelText(/i have budget for several activities/i)
    await user.click(moderateOption)

    expect(handleChange).toHaveBeenCalledWith('moderate')
  })

  it('displays selected value', () => {
    render(<BudgetOptions value="free" onChange={vi.fn()} />)

    const freeOption = screen.getByLabelText(/only show free activities/i) as HTMLInputElement
    expect(freeOption.checked).toBe(true)
  })

  it('renders as radio group', () => {
    render(<BudgetOptions value="" onChange={vi.fn()} />)

    const radios = screen.getAllByRole('radio')
    expect(radios).toHaveLength(4)
  })
})
