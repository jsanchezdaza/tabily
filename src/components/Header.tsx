import { useState, useEffect, useRef } from 'react'
import { useAuth } from '../hooks/useAuth'

function Header() {
  const { user, signOut } = useAuth()
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

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
            <svg
              width="40"
              height="40"
              viewBox="0 0 60 60"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect x="15" y="15" width="4" height="30" rx="2" fill="#a8e6cf" />
              <rect x="41" y="15" width="4" height="30" rx="2" fill="#a8e6cf" />
              <rect x="10" y="15" width="40" height="5" rx="2.5" fill="#a8e6cf" />
              <rect x="12" y="25" width="36" height="4" rx="2" fill="#ff6b6b" />
              <path
                d="M30 45C30 45 30 35 30 30C30 25 30 20 30 20"
                stroke="#c8f7dc"
                strokeWidth="3"
                strokeLinecap="round"
                strokeDasharray="2 3"
              />
              <circle cx="30" cy="45" r="2.5" fill="#ff6b6b" />
            </svg>
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
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  aria-label="Profile menu"
                  className="flex items-center justify-center w-10 h-10 rounded-full bg-emerald-300 hover:bg-emerald-400 transition-colors"
                >
                  <svg
                    width="28"
                    height="28"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <circle cx="12" cy="8" r="4" fill="#ff6b6b" />
                    <ellipse cx="12" cy="20" rx="9" ry="6" fill="#ff6b6b" />
                  </svg>
                </button>

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
                        <svg
                          className="w-5 h-5 text-gray-400 group-hover:text-red-500 transition-colors"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                          />
                        </svg>
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
