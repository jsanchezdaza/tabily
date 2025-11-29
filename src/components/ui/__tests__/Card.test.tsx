import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import Card from '../Card'

describe('Card', () => {
  it('renders children content', () => {
    render(<Card>Card content</Card>)

    expect(screen.getByText('Card content')).toBeInTheDocument()
  })

  it('applies default card styling', () => {
    const { container } = render(<Card>Content</Card>)
    const card = container.firstChild as HTMLElement

    expect(card).toHaveClass('bg-white')
    expect(card).toHaveClass('rounded-2xl')
    expect(card).toHaveClass('shadow-xl')
  })

  it('accepts custom className', () => {
    const { container } = render(<Card className="custom-class">Content</Card>)
    const card = container.firstChild as HTMLElement

    expect(card).toHaveClass('custom-class')
  })
})
