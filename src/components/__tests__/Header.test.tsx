import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { BrowserRouter } from 'react-router-dom'
import Header from '../Header'
import * as useAuthModule from '../../hooks/useAuth'

vi.mock('../../hooks/useAuth')

const createMockUser = (fullName?: string) => ({
  id: 'test-user-123',
  email: 'john.doe@example.com',
  user_metadata: fullName ? { full_name: fullName } : {},
  app_metadata: {},
  aud: 'authenticated',
  created_at: new Date().toISOString(),
  role: 'authenticated',
})

const mockAuthHook = (user: ReturnType<typeof createMockUser>) => {
  vi.spyOn(useAuthModule, 'useAuth').mockReturnValue({
    user,
    loading: false,
    signInWithEmail: vi.fn(),
    signInWithGoogle: vi.fn(),
    signUpWithEmail: vi.fn(),
    signOut: vi.fn(),
  })
}

const renderHeader = () =>
  render(
    <BrowserRouter>
      <Header />
    </BrowserRouter>
  )

const openProfileMenu = async () => {
  const profileButton = screen.getByRole('button', { name: /profile menu/i })
  await userEvent.click(profileButton)
}

describe('Header', () => {
  it('displays greeting with user name in profile dropdown', async () => {
    const mockUser = createMockUser('John Doe')
    mockAuthHook(mockUser)
    renderHeader()

    await openProfileMenu()

    expect(screen.getByText(/Welcome back!/i)).toBeInTheDocument()
    expect(screen.getByText('John Doe')).toBeInTheDocument()
    expect(screen.getByText('john.doe@example.com')).toBeInTheDocument()
  })

  it('does not display greeting when user has no full_name', async () => {
    const mockUser = createMockUser()
    mockAuthHook(mockUser)
    renderHeader()

    await openProfileMenu()

    expect(screen.queryByText(/Welcome back!/i)).not.toBeInTheDocument()
  })
})
