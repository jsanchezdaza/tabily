import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { BrowserRouter } from 'react-router-dom'
import Header from '../Header'
import * as useAuthModule from '../../hooks/useAuth'

vi.mock('../../lib/supabase', () => ({
  supabase: {
    auth: {
      getSession: vi.fn(),
      onAuthStateChange: vi.fn(),
      signInWithPassword: vi.fn(),
      signInWithOAuth: vi.fn(),
      signUp: vi.fn(),
      signOut: vi.fn(),
    },
  },
}))

vi.mock('../../hooks/useAuth')

const createMockUser = (fullName?: string, avatarUrl?: string) => ({
  id: 'test-user-123',
  email: 'john.doe@example.com',
  user_metadata: {
    ...(fullName ? { full_name: fullName } : {}),
    ...(avatarUrl ? { avatar_url: avatarUrl } : {}),
  },
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

  it('displays user profile picture when avatar_url is available', () => {
    const avatarUrl = 'https://example.com/avatar.jpg'
    const mockUser = createMockUser('John Doe', avatarUrl)
    mockAuthHook(mockUser)
    renderHeader()

    const profileButton = screen.getByRole('button', { name: /profile menu/i })
    const profileImage = profileButton.querySelector('img')

    expect(profileImage).toBeInTheDocument()
    expect(profileImage).toHaveAttribute('src', avatarUrl)
    expect(profileImage).toHaveAttribute('alt', "John Doe's profile picture")
  })

  it('displays default UserIcon when avatar_url is not available', () => {
    const mockUser = createMockUser('John Doe')
    mockAuthHook(mockUser)
    renderHeader()

    const profileButton = screen.getByRole('button', { name: /profile menu/i })
    const profileImage = profileButton.querySelector('img')
    const userIcon = profileButton.querySelector('svg')

    expect(profileImage).not.toBeInTheDocument()
    expect(userIcon).toBeInTheDocument()
  })

  it('displays default UserIcon when user has no full_name and no avatar_url', () => {
    const mockUser = createMockUser()
    mockAuthHook(mockUser)
    renderHeader()

    const profileButton = screen.getByRole('button', { name: /profile menu/i })
    const profileImage = profileButton.querySelector('img')
    const userIcon = profileButton.querySelector('svg')

    expect(profileImage).not.toBeInTheDocument()
    expect(userIcon).toBeInTheDocument()
  })
})
