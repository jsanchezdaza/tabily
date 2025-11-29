import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import ProfileDropdown from '../ProfileDropdown'
import { User } from '@supabase/supabase-js'

const createMockUser = (fullName?: string, email?: string): User => ({
  id: 'test-user-123',
  email: email || 'john.doe@example.com',
  user_metadata: {
    ...(fullName ? { full_name: fullName } : {}),
  },
  app_metadata: {},
  aud: 'authenticated',
  created_at: new Date().toISOString(),
  role: 'authenticated',
})

describe('ProfileDropdown', () => {
  it('renders user info when full name is available', () => {
    const user = createMockUser('John Doe', 'john@example.com')
    const onSignOut = vi.fn()

    render(<ProfileDropdown user={user} onSignOut={onSignOut} />)

    expect(screen.getByText('John Doe')).toBeInTheDocument()
    expect(screen.getByText('john@example.com')).toBeInTheDocument()
  })

  it('does not render user info section when full name is missing', () => {
    const user = createMockUser(undefined, 'john@example.com')
    const onSignOut = vi.fn()

    render(<ProfileDropdown user={user} onSignOut={onSignOut} />)

    expect(screen.queryByText('Welcome back!')).not.toBeInTheDocument()
  })

  it('calls onSignOut when logout button is clicked', async () => {
    const user = createMockUser('John Doe')
    const onSignOut = vi.fn()

    render(<ProfileDropdown user={user} onSignOut={onSignOut} />)

    const logoutButton = screen.getByRole('button', { name: /logout/i })
    await userEvent.click(logoutButton)

    expect(onSignOut).toHaveBeenCalledTimes(1)
  })
})
