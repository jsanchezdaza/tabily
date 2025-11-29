import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import Footer from '../Footer'

describe('Footer', () => {
  it('displays copyright text with current year', () => {
    render(<Footer />)

    const currentYear = new Date().getFullYear()
    const copyrightText = screen.getByText(new RegExp(`© ${currentYear} tabily`))

    expect(copyrightText).toBeInTheDocument()
  })

  it('is rendered as a footer element', () => {
    const { container } = render(<Footer />)
    const footer = container.querySelector('footer')

    expect(footer).toBeInTheDocument()
  })
})
