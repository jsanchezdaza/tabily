import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import GoogleIcon from '../GoogleIcon'

describe('GoogleIcon', () => {
  it('renders an SVG element', () => {
    const { container } = render(<GoogleIcon />)
    const svg = container.querySelector('svg')

    expect(svg).toBeInTheDocument()
  })

  it('applies custom className', () => {
    const { container } = render(<GoogleIcon className="custom-class" />)
    const svg = container.querySelector('svg')

    expect(svg).toHaveClass('custom-class')
  })
})
