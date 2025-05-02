import type React from "react"

interface VuvuzelaIconProps {
  className?: string
  size?: number
  color?: string
  animate?: boolean
}

const VuvuzelaIcon: React.FC<VuvuzelaIconProps> = ({
  className = "",
  size = 24,
  color = "currentColor",
  animate = false,
}) => {
  return (
    <div className={`${className} ${animate ? "animate-bounce" : ""}`}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M3 10v4c0 1.1.9 2 2 2h3v-8H5a2 2 0 0 0-2 2z" />
        <path d="M8 8v8h3a2 2 0 0 0 2-2v-4a2 2 0 0 0-2-2H8z" />
        <path d="M13 15.9c1 .7 2.3 1.1 3.5 1.1 3 0 5.5-2 5.5-4.5S19.5 8 16.5 8c-1.2 0-2.5.4-3.5 1.1" />
        <line x1="3" y1="8" x2="3" y2="16" />
        {animate && (
          <>
            <path d="M20 7c.5-.3 1-.5 1.5-.5" strokeDasharray="5,5" className="animate-pulse" />
            <path
              d="M22 9c.3-.2.7-.3 1-.3"
              strokeDasharray="3,3"
              className="animate-pulse"
              style={{ animationDelay: "0.2s" }}
            />
          </>
        )}
      </svg>
    </div>
  )
}

export default VuvuzelaIcon
