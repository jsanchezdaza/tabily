import { describe, it, expect, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import ProfileButton from '../ProfileButton'
import { User } from '@supabase/supabase-js'

const createMockUser = (fullName?: string, avatarUrl?: string): User => ({
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

describe('ProfileButton', () => {
  it('renders profile picture when avatar_url is available', () => {
    const avatarUrl = 'https://example.com/avatar.jpg'
    const user = createMockUser('John Doe', avatarUrl)
    const onClick = vi.fn()

    render(<ProfileButton user={user} onClick={onClick} />)

    const button = screen.getByRole('button', { name: /profile menu/i })
    const img = button.querySelector('img')

    expect(img).toBeInTheDocument()
    expect(img).toHaveAttribute('src', avatarUrl)
    expect(img).toHaveAttribute('alt', "John Doe's profile picture")
  })

  it('renders UserIcon when avatar_url is not available', () => {
    const user = createMockUser('John Doe')
    const onClick = vi.fn()

    render(<ProfileButton user={user} onClick={onClick} />)

    const button = screen.getByRole('button', { name: /profile menu/i })
    const img = button.querySelector('img')
    const svg = button.querySelector('svg')

    expect(img).not.toBeInTheDocument()
    expect(svg).toBeInTheDocument()
  })

  it('uses "User" as fallback in alt text when full_name is not available', () => {
    const avatarUrl = 'https://example.com/avatar.jpg'
    const user = createMockUser(undefined, avatarUrl)
    const onClick = vi.fn()

    render(<ProfileButton user={user} onClick={onClick} />)

    const button = screen.getByRole('button', { name: /profile menu/i })
    const img = button.querySelector('img')

    expect(img).toHaveAttribute('alt', "User's profile picture")
  })

  it('calls onClick when button is clicked', async () => {
    const user = createMockUser('John Doe')
    const onClick = vi.fn()

    render(<ProfileButton user={user} onClick={onClick} />)

    const button = screen.getByRole('button', { name: /profile menu/i })
    await userEvent.click(button)

    expect(onClick).toHaveBeenCalledTimes(1)
  })

  it('falls back to UserIcon when image fails to load', async () => {
    const avatarUrl = 'https://example.com/broken-avatar.jpg'
    const user = createMockUser('John Doe', avatarUrl)
    const onClick = vi.fn()

    render(<ProfileButton user={user} onClick={onClick} />)

    const button = screen.getByRole('button', { name: /profile menu/i })
    const img = button.querySelector('img')

    expect(img).toBeInTheDocument()

    img?.dispatchEvent(new Event('error', { bubbles: true }))

    await waitFor(() => {
      const imgAfterError = button.querySelector('img')
      expect(imgAfterError).not.toBeInTheDocument()
    })

    const svg = button.querySelector('svg')
    expect(svg).toBeInTheDocument()
  })

  it('shows UserIcon as background while image is loading', () => {
    const avatarUrl = 'https://example.com/avatar.jpg'
    const user = createMockUser('John Doe', avatarUrl)
    const onClick = vi.fn()

    render(<ProfileButton user={user} onClick={onClick} />)

    const button = screen.getByRole('button', { name: /profile menu/i })
    const svg = button.querySelector('svg')

    expect(svg).toBeInTheDocument()
  })
})
