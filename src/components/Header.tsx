import { useState, useEffect, useRef, useCallback } from 'react'
import { useAuth } from '../hooks/useAuth'
import Logo from './icons/Logo'
import LogoutIcon from './icons/LogoutIcon'
import ProfileButton from './ProfileButton'

function Header() {
  const { user, signOut } = useAuth()
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const handleProfileClick = useCallback(() => {
    setIsDropdownOpen(prev => !prev)
  }, [])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false)
      }
    }

    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isDropdownOpen])

  return (
    <header className="bg-gray-900 border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <Logo />
            <span className="text-2xl font-bold text-emerald-300 tracking-tight">tabily</span>
          </div>

          <nav className="flex items-center gap-6">
            {user && (
              <a
                href="/trips"
                className="text-gray-300 hover:text-emerald-300 transition-colors font-medium"
              >
                My trips
              </a>
            )}
            {user ? (
              <div className="relative" ref={dropdownRef}>
                <ProfileButton user={user} onClick={handleProfileClick} />

                {isDropdownOpen && (
                  <div className="absolute right-0 mt-3 w-64 bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden z-50 animate-fadeIn">
                    {user?.user_metadata?.full_name && (
                      <div className="px-4 py-3 bg-gradient-to-br from-emerald-50 to-blue-50 border-b border-gray-100">
                        <p className="text-sm text-gray-500 mb-1">Welcome back!</p>
                        <p className="text-base font-semibold text-gray-900 truncate">
                          {user.user_metadata.full_name}
                        </p>
                        {user.email && (
                          <p className="text-xs text-gray-500 mt-1 truncate">{user.email}</p>
                        )}
                      </div>
                    )}
                    <div className="py-1">
                      <button
                        onClick={signOut}
                        className="w-full text-left px-4 py-3 text-gray-700 hover:bg-gray-50 transition-all duration-150 flex items-center gap-3 group"
                      >
                        <LogoutIcon className="w-5 h-5 text-gray-400 group-hover:text-red-500 transition-colors" />
                        <span className="font-medium">Logout</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <a
                href="/"
                className="text-gray-300 hover:text-emerald-300 transition-colors font-medium"
              >
                Login
              </a>
            )}
          </nav>
        </div>
      </div>
    </header>
  )
}

export default Header
