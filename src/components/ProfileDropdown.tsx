import { User } from '@supabase/supabase-js'
import LogoutIcon from './icons/LogoutIcon'

interface ProfileDropdownProps {
  user: User
  onSignOut: () => void
}

const ProfileDropdown = ({ user, onSignOut }: ProfileDropdownProps) => {
  return (
    <div className="absolute right-0 mt-3 w-64 bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden z-50 animate-fadeIn">
      {user?.user_metadata?.full_name && (
        <div className="px-4 py-3 bg-gradient-to-br from-emerald-50 to-blue-50 border-b border-gray-100">
          <p className="text-sm text-gray-500 mb-1">Welcome back!</p>
          <p className="text-base font-semibold text-gray-900 truncate">
            {user.user_metadata.full_name}
          </p>
          {user.email && <p className="text-xs text-gray-500 mt-1 truncate">{user.email}</p>}
        </div>
      )}
      <div className="py-1">
        <button
          onClick={onSignOut}
          aria-label="Sign out of your account"
          className="w-full text-left px-4 py-3 text-gray-700 hover:bg-gray-50 transition-all duration-150 flex items-center gap-3 group"
        >
          <LogoutIcon className="w-5 h-5 text-gray-400 group-hover:text-red-500 transition-colors" />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </div>
  )
}

export default ProfileDropdown
