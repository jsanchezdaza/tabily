import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import AuthErrorBanner from '../AuthErrorBanner'

describe('AuthErrorBanner', () => {
  it('renders error message', () => {
    render(<AuthErrorBanner message="Invalid credentials" />)

    expect(screen.getByText('Invalid credentials')).toBeInTheDocument()
  })

  it('applies error styling', () => {
    const { container } = render(<AuthErrorBanner message="Error" />)
    const banner = container.firstChild as HTMLElement

    expect(banner).toHaveClass('bg-red-50')
    expect(banner).toHaveClass('border-red-200')
  })
})
