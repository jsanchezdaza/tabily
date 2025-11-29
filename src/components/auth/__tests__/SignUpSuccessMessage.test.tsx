import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import userEvent from '@testing-library/user-event'
import SignUpSuccessMessage from '../SignUpSuccessMessage'

describe('SignUpSuccessMessage', () => {
  it('displays the submitted email', () => {
    const onUseAnotherEmail = vi.fn()

    render(
      <BrowserRouter>
        <SignUpSuccessMessage email="test@example.com" onUseAnotherEmail={onUseAnotherEmail} />
      </BrowserRouter>
    )

    expect(screen.getByText(/test@example.com/i)).toBeInTheDocument()
  })

  it('renders check icon', () => {
    const onUseAnotherEmail = vi.fn()
    const { container } = render(
      <BrowserRouter>
        <SignUpSuccessMessage email="test@example.com" onUseAnotherEmail={onUseAnotherEmail} />
      </BrowserRouter>
    )

    const svg = container.querySelector('svg')
    expect(svg).toBeInTheDocument()
  })

  it('renders Back to Sign In button', () => {
    const onUseAnotherEmail = vi.fn()

    render(
      <BrowserRouter>
        <SignUpSuccessMessage email="test@example.com" onUseAnotherEmail={onUseAnotherEmail} />
      </BrowserRouter>
    )

    expect(screen.getByRole('button', { name: /back to sign in/i })).toBeInTheDocument()
  })

  it('calls onUseAnotherEmail when link is clicked', async () => {
    const onUseAnotherEmail = vi.fn()

    render(
      <BrowserRouter>
        <SignUpSuccessMessage email="test@example.com" onUseAnotherEmail={onUseAnotherEmail} />
      </BrowserRouter>
    )

    const button = screen.getByRole('button', { name: /use a different email/i })
    await userEvent.click(button)

    expect(onUseAnotherEmail).toHaveBeenCalledTimes(1)
  })
})
