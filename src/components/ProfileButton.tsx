import { useState, memo } from 'react'
import { User } from '@supabase/supabase-js'
import UserIcon from './icons/UserIcon'

interface ProfileButtonProps {
  user: User
  onClick: () => void
}

const ProfileButton = memo(function ProfileButton({ user, onClick }: ProfileButtonProps) {
  const [imageError, setImageError] = useState(false)
  const avatarUrl = user.user_metadata?.avatar_url
  const fullName = user.user_metadata?.full_name

  return (
    <button
      onClick={onClick}
      aria-label="Profile menu"
      className="flex items-center justify-center w-10 h-10 rounded-full bg-emerald-300 hover:bg-emerald-400 transition-colors overflow-hidden relative"
    >
      <UserIcon />
      {avatarUrl && !imageError && (
        <img
          src={avatarUrl}
          alt={`${fullName || 'User'}'s profile picture`}
          className="w-full h-full object-cover absolute inset-0"
          onError={() => setImageError(true)}
        />
      )}
    </button>
  )
})

export default ProfileButton
