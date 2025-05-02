"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { User, Lock, Bell, Upload, Trash2, Loader2 } from "lucide-react"
import { toast } from "@/hooks/use-toast"
import UserDashboardLayout from "@/components/user-dashboard-layout"
import { useAuth } from "@/components/context/auth-content"
import { updateUserProfile, uploadProfileImage, updatePassword, updateNotificationSettings } from "@/api/users"
import LoadingAnimation from "@/components/loading-animation"

export default function SettingsPage() {
  const { user, refreshUserData } = useAuth()
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [profileForm, setProfileForm] = useState({
    firstName: "",
    middleName: "",
    surName: "",
    email: "",
    phoneNumber: "",
    country: "",
    stateOfOrigin: "",
    address: "",
  })
  const [imageUrl, setImageUrl] = useState("")
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })
  const [notificationSettings, setNotificationSettings] = useState({
    email: true,
    sms: true,
    app: true,
  })

  useEffect(() => {
    if (user) {
      setProfileForm({
        firstName: user.userDetails.firstName || "",
        middleName: user.userDetails.middleName || "",
        surName: user.userDetails.surName || "",
        email: user.userDetails.email || "",
        phoneNumber: user.userDetails.phoneNumber || "",
        country: user.userDetails.country || "Nigeria",
        stateOfOrigin: user.userDetails.stateOfOrigin || "",
        address: user.userDetails.address || "",
      })
      setImageUrl(user.userDetails.imageurl || "")
      setIsLoading(false)
    }
  }, [user])

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setProfileForm((prev) => ({ ...prev, [name]: value }))
  }

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setPasswordForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setProfileForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleNotificationChange = (name: string, value: boolean) => {
    setNotificationSettings((prev) => ({ ...prev, [name]: value }))
  }

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)

    try {
      const profileData = {
        firstName: profileForm.firstName,
        middleName: profileForm.middleName,
        surName: profileForm.surName,
        phoneNumber: profileForm.phoneNumber,
        country: profileForm.country,
        stateOfOrigin: profileForm.stateOfOrigin,
        address: profileForm.address,
        imageurl: imageUrl,
      }

      await updateUserProfile(profileData)
      await refreshUserData()

      toast({
        title: "Profile Updated",
        description: "Your profile has been successfully updated",
      })
    } catch (error: any) {
      console.error("Error updating profile:", error)
      toast({
        title: "Update Failed",
        description: error.message || "Failed to update profile. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast({
        title: "Password Mismatch",
        description: "New password and confirm password do not match",
        variant: "destructive",
      })
      return
    }

    setIsSaving(true)

    try {
      await updatePassword(passwordForm.currentPassword, passwordForm.newPassword)

      // Reset form
      setPasswordForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      })

      toast({
        title: "Password Updated",
        description: "Your password has been successfully updated",
      })
    } catch (error: any) {
      console.error("Error updating password:", error)
      toast({
        title: "Update Failed",
        description: error.message || "Failed to update password. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsUploading(true)

    try {
      const response = await uploadProfileImage(file)
      setImageUrl(response.data.imageurl)

      toast({
        title: "Image Uploaded",
        description: "Your profile picture has been uploaded successfully",
      })
    } catch (error: any) {
      console.error("Error uploading image:", error)
      toast({
        title: "Upload Failed",
        description: error.message || "Failed to upload profile picture. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsUploading(false)
    }
  }

  const handleRemoveImage = async () => {
    setIsUploading(true)

    try {
      // Update profile with empty imageurl
      await updateUserProfile({ imageurl: "" })
      setImageUrl("")
      await refreshUserData()

      toast({
        title: "Image Removed",
        description: "Your profile picture has been removed",
      })
    } catch (error: any) {
      console.error("Error removing image:", error)
      toast({
        title: "Remove Failed",
        description: error.message || "Failed to remove profile picture. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsUploading(false)
    }
  }

  const handleSaveNotifications = async () => {
    setIsSaving(true)

    try {
      await updateNotificationSettings(notificationSettings)

      toast({
        title: "Notifications Updated",
        description: "Your notification preferences have been updated",
      })
    } catch (error: any) {
      console.error("Error updating notifications:", error)
      toast({
        title: "Update Failed",
        description: error.message || "Failed to update notification settings. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  const getInitials = () => {
    if (!user) return "GG"
    return `${user.userDetails.firstName.charAt(0)}${user.userDetails.surName.charAt(0)}`
  }

  if (isLoading) {
    return (
      <UserDashboardLayout>
        <div className="container flex items-center justify-center min-h-[60vh]">
          <LoadingAnimation message="Loading your profile..." />
        </div>
      </UserDashboardLayout>
    )
  }

  return (
    <UserDashboardLayout>
      <div className="container relative pb-10">
        <div className="flex items-center justify-between space-y-2">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Settings</h2>
            <p className="text-muted-foreground">Manage your account settings and set preferences.</p>
          </div>
        </div>
        <Tabs defaultValue="profile" className="mt-6">
          <TabsList>
            <TabsTrigger value="profile">
              <User className="mr-2 h-4 w-4" />
              Profile
            </TabsTrigger>
            <TabsTrigger value="password">
              <Lock className="mr-2 h-4 w-4" />
              Password
            </TabsTrigger>
            <TabsTrigger value="notifications">
              <Bell className="mr-2 h-4 w-4" />
              Notifications
            </TabsTrigger>
          </TabsList>
          <TabsContent value="profile" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
                <CardDescription>Update your profile information.</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="col-span-1 md:col-span-1 flex flex-col items-center justify-center">
                    <Avatar className="h-32 w-32">
                      {imageUrl ? (
                        <AvatarImage src={imageUrl || "/placeholder.svg"} alt="Profile Image" />
                      ) : (
                        <AvatarFallback>{getInitials()}</AvatarFallback>
                      )}
                    </Avatar>
                    <div className="flex items-center justify-center mt-4 space-x-2">
                      <div className="relative">
                        <Button variant="outline" size="sm" className="flex items-center gap-2" disabled={isUploading}>
                          {isUploading ? (
                            <>
                              <Loader2 className="h-4 w-4 animate-spin" />
                              Uploading...
                            </>
                          ) : (
                            <>
                              <Upload className="h-4 w-4" />
                              Upload Image
                            </>
                          )}
                        </Button>
                        <Input
                          type="file"
                          id="imageUpload"
                          className="absolute inset-0 opacity-0 cursor-pointer"
                          onChange={handleImageUpload}
                          accept="image/*"
                          disabled={isUploading}
                        />
                      </div>
                      {imageUrl && (
                        <Button variant="outline" size="sm" onClick={handleRemoveImage} disabled={isUploading}>
                          <Trash2 className="h-4 w-4 mr-2" />
                          Remove
                        </Button>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground mt-2 text-center">
                      Upload a profile picture. JPG, PNG or GIF. Max 2MB.
                    </p>
                  </div>
                  <div className="col-span-1 md:col-span-2">
                    <form onSubmit={handleProfileSubmit}>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="firstName">First Name</Label>
                          <Input
                            type="text"
                            id="firstName"
                            name="firstName"
                            value={profileForm.firstName}
                            onChange={handleProfileChange}
                          />
                        </div>
                        <div>
                          <Label htmlFor="middleName">Middle Name</Label>
                          <Input
                            type="text"
                            id="middleName"
                            name="middleName"
                            value={profileForm.middleName}
                            onChange={handleProfileChange}
                          />
                        </div>
                        <div>
                          <Label htmlFor="surName">Surname</Label>
                          <Input
                            type="text"
                            id="surName"
                            name="surName"
                            value={profileForm.surName}
                            onChange={handleProfileChange}
                          />
                        </div>
                        <div>
                          <Label htmlFor="email">Email</Label>
                          <Input
                            type="email"
                            id="email"
                            name="email"
                            value={profileForm.email}
                            onChange={handleProfileChange}
                            disabled
                          />
                          <p className="text-xs text-muted-foreground mt-1">
                            Email cannot be changed. Contact support for assistance.
                          </p>
                        </div>
                        <div>
                          <Label htmlFor="phoneNumber">Phone Number</Label>
                          <Input
                            type="tel"
                            id="phoneNumber"
                            name="phoneNumber"
                            value={profileForm.phoneNumber}
                            onChange={handleProfileChange}
                          />
                        </div>
                        <div>
                          <Label htmlFor="country">Country</Label>
                          <Select
                            value={profileForm.country}
                            onValueChange={(value) => handleSelectChange("country", value)}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select a country" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Nigeria">Nigeria</SelectItem>
                              <SelectItem value="Ghana">Ghana</SelectItem>
                              <SelectItem value="Kenya">Kenya</SelectItem>
                              <SelectItem value="South Africa">South Africa</SelectItem>
                              <SelectItem value="United States">United States</SelectItem>
                              <SelectItem value="United Kingdom">United Kingdom</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor="stateOfOrigin">State of Origin</Label>
                          <Input
                            type="text"
                            id="stateOfOrigin"
                            name="stateOfOrigin"
                            value={profileForm.stateOfOrigin}
                            onChange={handleProfileChange}
                          />
                        </div>
                        <div className="md:col-span-2">
                          <Label htmlFor="address">Address</Label>
                          <Input
                            type="text"
                            id="address"
                            name="address"
                            value={profileForm.address}
                            onChange={handleProfileChange}
                          />
                        </div>
                      </div>
                      <Button className="mt-6" type="submit" disabled={isLoading || isSaving}>
                        {isSaving ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Saving...
                          </>
                        ) : (
                          "Save Changes"
                        )}
                      </Button>
                    </form>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="password" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Change Password</CardTitle>
                <CardDescription>Update your password.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <form onSubmit={handlePasswordSubmit}>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="currentPassword">Current Password</Label>
                      <Input
                        id="currentPassword"
                        name="currentPassword"
                        type="password"
                        value={passwordForm.currentPassword}
                        onChange={handlePasswordChange}
                      />
                    </div>
                    <div>
                      <Label htmlFor="newPassword">New Password</Label>
                      <Input
                        id="newPassword"
                        name="newPassword"
                        type="password"
                        value={passwordForm.newPassword}
                        onChange={handlePasswordChange}
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        Password must be at least 8 characters and include a number and special character.
                      </p>
                    </div>
                    <div>
                      <Label htmlFor="confirmPassword">Confirm Password</Label>
                      <Input
                        id="confirmPassword"
                        name="confirmPassword"
                        type="password"
                        value={passwordForm.confirmPassword}
                        onChange={handlePasswordChange}
                      />
                    </div>
                    <Button className="mt-2" type="submit" disabled={isLoading || isSaving}>
                      {isSaving ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Updating...
                        </>
                      ) : (
                        "Update Password"
                      )}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="notifications" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Notification Settings</CardTitle>
                <CardDescription>Manage your notification preferences.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="emailNotifications" className="text-base">
                        Email Notifications
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        Receive email notifications about your account and devices.
                      </p>
                    </div>
                    <Input
                      id="emailNotifications"
                      type="checkbox"
                      className="h-4 w-4"
                      checked={notificationSettings.email}
                      onChange={(e) => handleNotificationChange("email", e.target.checked)}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="smsNotifications" className="text-base">
                        SMS Notifications
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        Receive SMS alerts for important updates about your devices.
                      </p>
                    </div>
                    <Input
                      id="smsNotifications"
                      type="checkbox"
                      className="h-4 w-4"
                      checked={notificationSettings.sms}
                      onChange={(e) => handleNotificationChange("sms", e.target.checked)}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="appNotifications" className="text-base">
                        App Notifications
                      </Label>
                      <p className="text-sm text-muted-foreground">Receive in-app notifications and alerts.</p>
                    </div>
                    <Input
                      id="appNotifications"
                      type="checkbox"
                      className="h-4 w-4"
                      checked={notificationSettings.app}
                      onChange={(e) => handleNotificationChange("app", e.target.checked)}
                    />
                  </div>
                  <Button className="mt-4" onClick={handleSaveNotifications} disabled={isSaving}>
                    {isSaving ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      "Save Notification Settings"
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </UserDashboardLayout>
  )
}
