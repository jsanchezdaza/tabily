import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import PageLayout from '../PageLayout'

vi.mock('../../Header', () => ({
  default: () => <div data-testid="header">Header</div>,
}))

vi.mock('../../Footer', () => ({
  default: () => <div data-testid="footer">Footer</div>,
}))

vi.mock('../../../hooks/useAuth', () => ({
  useAuth: () => ({ user: null }),
}))

describe('PageLayout', () => {
  it('renders header, children, and footer', () => {
    render(
      <BrowserRouter>
        <PageLayout>
          <div>Page content</div>
        </PageLayout>
      </BrowserRouter>
    )

    expect(screen.getByTestId('header')).toBeInTheDocument()
    expect(screen.getByText('Page content')).toBeInTheDocument()
    expect(screen.getByTestId('footer')).toBeInTheDocument()
  })
})
