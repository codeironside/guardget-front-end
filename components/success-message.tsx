"use client"

import { useState, useEffect } from "react"
import { CheckCircle2, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import ConfettiEffect from "@/components/confetti-effect"

interface SuccessMessageProps {
  title: string
  message: string
  onClose?: () => void
  autoCloseTime?: number
  showConfetti?: boolean
  actionLabel?: string
  onAction?: () => void
}

export default function SuccessMessage({
  title,
  message,
  onClose,
  autoCloseTime = 0,
  showConfetti = true,
  actionLabel,
  onAction,
}: SuccessMessageProps) {
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    if (autoCloseTime > 0) {
      const timer = setTimeout(() => {
        setIsVisible(false)
        if (onClose) onClose()
      }, autoCloseTime)

      return () => clearTimeout(timer)
    }
  }, [autoCloseTime, onClose])

  const handleClose = () => {
    setIsVisible(false)
    if (onClose) onClose()
  }

  const handleAction = () => {
    if (onAction) onAction()
  }

  if (!isVisible) return null

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50 animate-in fade-in duration-300">
      {showConfetti && <ConfettiEffect />}
      <Card className="w-full max-w-md mx-4 animate-in slide-in-from-bottom-10 duration-500">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-xl">{title}</CardTitle>
          <Button variant="ghost" size="icon" onClick={handleClose}>
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent className="flex flex-col items-center text-center">
          <div className="mb-4 rounded-full bg-green-100 p-3">
            <CheckCircle2 className="h-8 w-8 text-green-600" />
          </div>
          <p>{message}</p>
        </CardContent>
        <CardFooter className="flex justify-center">
          {actionLabel && onAction ? (
            <Button onClick={handleAction}>{actionLabel}</Button>
          ) : (
            <Button onClick={handleClose}>Close</Button>
          )}
        </CardFooter>
      </Card>
    </div>
  )
}
