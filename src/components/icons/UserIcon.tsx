interface UserIconProps {
  width?: number
  height?: number
  className?: string
}

function UserIcon({ width = 28, height = 28, className = '' }: UserIconProps) {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <circle cx="12" cy="8" r="4" fill="#ff6b6b" />
      <ellipse cx="12" cy="20" rx="9" ry="6" fill="#ff6b6b" />
    </svg>
  )
}

export default UserIcon
