import { describe, it, expect, vi } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import DestinationDropdown from '../DestinationDropdown'

describe('DestinationDropdown', () => {
  it('renders select with label', () => {
    render(<DestinationDropdown value="" onChange={vi.fn()} />)

    expect(screen.getByLabelText(/destination/i)).toBeInTheDocument()
  })

  it('displays placeholder option', () => {
    render(<DestinationDropdown value="" onChange={vi.fn()} />)

    expect(screen.getByRole('option', { name: /select a destination/i })).toBeInTheDocument()
  })

  it('renders all cities as options', () => {
    render(<DestinationDropdown value="" onChange={vi.fn()} />)

    const select = screen.getByRole('combobox')
    const options = within(select).getAllByRole('option')

    expect(options.length).toBeGreaterThan(50)
  })

  it('calls onChange when selection changes', async () => {
    const handleChange = vi.fn()
    const user = userEvent.setup()

    render(<DestinationDropdown value="" onChange={handleChange} />)

    const select = screen.getByRole('combobox')
    await user.selectOptions(select, 'Paris')

    expect(handleChange).toHaveBeenCalledWith('Paris')
  })

  it('displays selected value', () => {
    render(<DestinationDropdown value="Tokyo" onChange={vi.fn()} />)

    const select = screen.getByRole('combobox') as HTMLSelectElement
    expect(select.value).toBe('Tokyo')
  })

  it('shows error message when provided', () => {
    render(<DestinationDropdown value="" onChange={vi.fn()} error="Please select a destination" />)

    expect(screen.getByText(/please select a destination/i)).toBeInTheDocument()
  })

  it('does not show error when not provided', () => {
    render(<DestinationDropdown value="" onChange={vi.fn()} />)

    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
  })
})
