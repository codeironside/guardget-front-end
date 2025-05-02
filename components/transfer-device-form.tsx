"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "@/hooks/use-toast"
import { Loader2 } from "lucide-react"
import { transferDevice } from "@/api/devices"

interface TransferDeviceFormProps {
  onSuccess?: () => void
  onCancel?: () => void
}

export default function TransferDeviceForm({ onSuccess, onCancel }: TransferDeviceFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    imei: "",
    sn: "",
    newUserEmail: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      await transferDevice(formData)

      toast({
        title: "Device Transferred",
        description: "The device has been successfully transferred to the new user.",
      })

      if (onSuccess) {
        onSuccess()
      }
    } catch (error: any) {
      console.error("Error transferring device:", error)
      toast({
        title: "Transfer Failed",
        description: error.message || "Failed to transfer device. Please check the details and try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Transfer Device</CardTitle>
        <CardDescription>
          Transfer a device to another user. You will need the device IMEI, serial number, and the new user's email.
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="imei">Device IMEI</Label>
            <Input
              id="imei"
              name="imei"
              value={formData.imei}
              onChange={handleChange}
              placeholder="Enter device IMEI"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="sn">Serial Number</Label>
            <Input
              id="sn"
              name="sn"
              value={formData.sn}
              onChange={handleChange}
              placeholder="Enter device serial number"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="newUserEmail">New User Email</Label>
            <Input
              id="newUserEmail"
              name="newUserEmail"
              type="email"
              value={formData.newUserEmail}
              onChange={handleChange}
              placeholder="Enter the email of the new user"
              required
            />
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Transferring...
              </>
            ) : (
              "Transfer Device"
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}
