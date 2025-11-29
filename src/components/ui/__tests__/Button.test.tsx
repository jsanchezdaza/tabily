import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Button from '../Button'

describe('Button', () => {
  it('renders primary button with correct styling', () => {
    render(<Button variant="primary">Click me</Button>)

    const button = screen.getByRole('button', { name: /click me/i })

    expect(button).toBeInTheDocument()
    expect(button).toHaveClass('bg-emerald-300')
  })

  it('renders secondary button with correct styling', () => {
    render(<Button variant="secondary">Click me</Button>)

    const button = screen.getByRole('button', { name: /click me/i })

    expect(button).toHaveClass('border-2')
    expect(button).toHaveClass('border-gray-300')
  })

  it('renders outline button with correct styling', () => {
    render(<Button variant="outline">Click me</Button>)

    const button = screen.getByRole('button', { name: /click me/i })

    expect(button).toHaveClass('border-emerald-300')
  })

  it('uses primary variant by default', () => {
    render(<Button>Click me</Button>)

    const button = screen.getByRole('button', { name: /click me/i })

    expect(button).toHaveClass('bg-emerald-300')
  })

  it('calls onClick when clicked', async () => {
    const onClick = vi.fn()

    render(<Button onClick={onClick}>Click me</Button>)

    const button = screen.getByRole('button', { name: /click me/i })
    await userEvent.click(button)

    expect(onClick).toHaveBeenCalledTimes(1)
  })

  it('respects disabled state', () => {
    render(<Button disabled>Click me</Button>)

    const button = screen.getByRole('button', { name: /click me/i })

    expect(button).toBeDisabled()
  })

  it('accepts custom className', () => {
    render(<Button className="w-full">Click me</Button>)

    const button = screen.getByRole('button', { name: /click me/i })

    expect(button).toHaveClass('w-full')
  })
})
