import type React from "react"

interface LoadingAnimationProps {
  message?: string
  size?: "small" | "medium" | "large"
}

const LoadingAnimation: React.FC<LoadingAnimationProps> = ({ message = "Loading...", size = "medium" }) => {
  const getSize = () => {
    switch (size) {
      case "small":
        return "h-4 w-4"
      case "large":
        return "h-12 w-12"
      case "medium":
      default:
        return "h-8 w-8"
    }
  }

  return (
    <div className="flex flex-col items-center justify-center p-4">
      <div className={`${getSize()} border-4 border-primary border-t-transparent rounded-full animate-spin`}></div>
      {message && <p className="mt-4 text-muted-foreground text-sm">{message}</p>}
    </div>
  )
}

export default LoadingAnimation
