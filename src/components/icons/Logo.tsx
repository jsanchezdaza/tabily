interface LogoProps {
  width?: number
  height?: number
  className?: string
}

function Logo({ width = 40, height = 40, className = '' }: LogoProps) {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 60 60"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
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
  )
}

export default Logo
