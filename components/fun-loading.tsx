"use client"

import { useState, useEffect } from "react"
import { Loader2 } from "lucide-react"

interface FunLoadingProps {
  message?: string
  loadingTexts?: string[]
}

export default function FunLoading({
  message = "Loading...",
  loadingTexts = [
    "Fetching data...",
    "Almost there...",
    "Just a moment...",
    "Preparing your dashboard...",
    "Loading your devices...",
    "Connecting to servers...",
    "Crunching numbers...",
  ],
}: FunLoadingProps) {
  const [currentText, setCurrentText] = useState(message)

  useEffect(() => {
    if (loadingTexts.length === 0) return

    let index = 0
    const interval = setInterval(() => {
      index = (index + 1) % loadingTexts.length
      setCurrentText(loadingTexts[index])
    }, 2000)

    return () => clearInterval(interval)
  }, [loadingTexts])

  return (
    <div className="flex flex-col items-center justify-center min-h-[200px] p-8">
      <div className="relative">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <div className="absolute inset-0 animate-pulse opacity-50 rounded-full bg-primary/20"></div>
      </div>
      <p className="mt-4 text-center text-muted-foreground animate-pulse">{currentText}</p>
    </div>
  )
}
