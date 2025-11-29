import { useState, useRef, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import useClickOutside from '../hooks/useClickOutside'
import Logo from './icons/Logo'
import ProfileButton from './ProfileButton'
import ProfileDropdown from './ProfileDropdown'

function Header() {
  const { user, signOut } = useAuth()
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const handleProfileClick = useCallback(() => {
    setIsDropdownOpen(prev => !prev)
  }, [])

  useClickOutside(dropdownRef, () => setIsDropdownOpen(false), isDropdownOpen)

  return (
    <header className="sticky top-0 z-50 bg-gray-900 border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-3">
            <Logo />
            <span className="text-2xl font-bold text-emerald-500 tracking-tight">tabily</span>
          </Link>

          <nav className="flex items-center gap-6">
            {user && (
              <Link
                to="/trips"
                className="text-gray-300 hover:text-emerald-300 transition-colors font-medium"
              >
                My trips
              </Link>
            )}
            {user ? (
              <div className="relative" ref={dropdownRef}>
                <ProfileButton user={user} onClick={handleProfileClick} />
                {isDropdownOpen && <ProfileDropdown user={user} onSignOut={signOut} />}
              </div>
            ) : (
              <Link
                to="/login"
                className="border-2 border-emerald-300 text-emerald-300 px-5 py-1.5 rounded-full font-medium transition-all hover:bg-emerald-300/10"
              >
                Sign In
              </Link>
            )}
          </nav>
        </div>
      </div>
    </header>
  )
}

export default Header
