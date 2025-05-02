"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, Plus } from "lucide-react"
import AdminLayout from "@/components/admin-layout"
import { toast } from "@/hooks/use-toast"

interface Subscription {
  _id: string
  name: string
  NoOfDevices?: number
  NoOfDecives?: number
  price: number
  description?: string
  createdAt: string
  updatedAt: string
}

export default function AdminSubscriptionsPage() {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([])
  const [filteredSubscriptions, setFilteredSubscriptions] = useState<Subscription[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [selectedSubscription, setSelectedSubscription] = useState<Subscription | null>(null)
  const [subscriptionForm, setSubscriptionForm] = useState({
    name: "",
    NoOfDevices: 1,
    price: 100,
    description: "",
  })

  useEffect(() => {
    fetchSubscriptions()
  }, [])

  useEffect(() => {
    filterSubscriptions()
  }, [subscriptions, searchQuery])

  const fetchSubscriptions = async () => {
    setIsLoading(true)
    try {
      // In a real app, this would be an API call
      // Example: const response = await fetch('/api/admin/subscriptions')

      // Simulate API response
      setTimeout(() => {
        const mockResponse = {
          status: "success",
          data: [
            {
              _id: "680e22ad20178e4d0b435de9",
              name: "extended",
              NoOfDevices: 3,
              price: 100,
              description: "subscribe for everyone ",
              createdAt: "2025-04-27T12:27:25.196Z",
              updatedAt: "2025-04-27T12:27:25.196Z",
            },
            {
              _id: "680e22506bad5fa515e7580f",
              name: "parents",
              NoOfDevices: 3,
              price: 100,
              createdAt: "2025-04-27T12:25:52.551Z",
              updatedAt: "2025-04-27T12:25:52.551Z",
            },
            {
              _id: "680e209b754b0c24df23d2e6",
              name: "student",
              NoOfDecives: 3,
              price: 100,
              createdAt: "2025-04-27T12:18:35.514Z",
              updatedAt: "2025-04-27T12:18:35.514Z",
            },
            {
              _id: "680e204804eacdd89de168ac",
              name: "family",
              NoOfDecives: 10,
              price: 5000,
              createdAt: "2025-04-27T12:17:12.048Z",
              updatedAt: "2025-04-27T12:17:12.048Z",
            },
            {
              _id: "680e1e0b07589742e3fd3ee3",
              name: "premium",
              NoOfDecives: 10,
              price: 5000,
              createdAt: "2025-04-27T12:07:39.061Z",
              updatedAt: "2025-04-27T12:07:39.061Z",
            },
            {
              _id: "680e1d589525f6bf529d47db",
              name: "basic",
              NoOfDecives: 5,
              price: 100,
              createdAt: "2025-04-27T12:04:40.728Z",
              updatedAt: "2025-04-27T12:04:40.728Z",
            },
          ],
        }

        setSubscriptions(mockResponse.data)
        setIsLoading(false)
      }, 1500)
    } catch (error) {
      console.error("Error fetching subscriptions:", error)
      toast({
        title: "Error",
        description: "Failed to load subscription plans. Please try again.",
        variant: "destructive",
      })
      setIsLoading(false)
    }
  }

  const filterSubscriptions = () => {
    if (!searchQuery) {
      setFilteredSubscriptions(subscriptions)
      return
    }

    const query = searchQuery.toLowerCase()
    const filtered = subscriptions.filter((subscription) => 
      subscription.name.toLowerCase().includes(query) || 
      subscription.description?.toLowerCase().includes(query)
    )
    
    setFilteredSubscriptions(filtered)
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    filterSubscriptions()
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setSubscriptionForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleNumberInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    const numValue = Number.parseInt(value, 10)
    
    if (!isNaN(numValue) && numValue > 0) {
      setSubscriptionForm((prev) => ({ ...prev, [name]: numValue }))
    }
  }

  const handleCreateSubscription = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // In a real app, this would be an API call
      // Example: const response = await fetch('/api/admin/subscriptions', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(subscriptionForm)
      // })

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Add the new subscription to the list
      const newSubscription: Subscription = {
        _id: `new_${Date.now()}`,
        name: subscriptionForm.name,
        NoOfDevices: subscriptionForm.NoOfDevices,
        price: subscriptionForm.price,
        description: subscriptionForm.description,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }

      setSubscriptions([newSubscription, ...subscriptions])
      setIsSubmitting(false)
      setIsCreateDialogOpen(false)

      // Reset form
      setSubscriptionForm({
        name: "",
        NoOfDevices: 1,
        price: 100,
        description: "",
      })

      toast({
        title: "Subscription Created",
        description: "New subscription plan has been created successfully",
      })
    } catch (error) {
      console.error("Error creating subscription:", error)
      toast({
        title: "Error",
        description: "Failed to create subscription plan. Please try again.",
        variant: "destructive",
      })
      setIsSubmitting(false)
    }
  }

  const handleEditSubscription = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // In a real app, this would be an API call
      // Example: const response = await fetch(`/api/admin/subscriptions/${selectedSubscription?._id}`, {
      //   method: 'PUT',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(subscriptionForm)
      // })

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Update the subscription in the list
      if (selectedSubscription) {
        const updatedSubscriptions = subscriptions.map((sub) => 
          sub._id === selectedSubscription._id 
            ? { 
                ...sub, 
                name: subscriptionForm.name,
                NoOfDevices: subscriptionForm.NoOfDevices,
                price: subscriptionForm.price,
                description: subscriptionForm.description,
                updatedAt: new Date().toISOString(),
              } 
            : sub
        )

        setSubscriptions(updatedSubscriptions)
      }

      setIsSubmitting(false)
      setIsEditDialogOpen(false)
      setSelectedSubscription(null)

      toast({
        title: "Subscription Updated",
        description: "Subscription plan has been updated successfully",
      })
    } catch (error) {
      console.error("Error updating subscription:", error)
      toast({
        title: "Error",
        description: "Failed to update subscription plan. Please try again.",
        variant: "destructive",
      })
      setIsSubmitting(false)
    }
  }

  const handleDeleteSubscription = async () => {
    setIsSubmitting(true)

    try {
      // In a real app, this would be an API call
      // Example: const response = await fetch(`/api/admin/subscriptions/${selectedSubscription?._id}`, {
      //   method: 'DELETE'
      // })

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Remove the subscription from the list
      if (selectedSubscription) {
        const updatedSubscriptions = subscriptions.filter((sub) => sub._id !== selectedSubscription._id)
        setSubscriptions(updatedSubscriptions)
      }

      setIsSubmitting(false)
      setIsDeleteDialogOpen(false)
      setSelectedSubscription(null)

      toast({
        title: "Subscription Deleted",
        description: "Subscription plan has been deleted successfully",
      })
    } catch (error) {
      console.error("Error deleting subscription:", error)
      toast({
        title: "Error",
        description: "Failed to delete subscription plan. Please try again.",
        variant: "destructive",
      })
      setIsSubmitting(false)
    }
  }

  const openEditDialog = (subscription: Subscription) => {
    setSelectedSubscription(subscription)
    setSubscriptionForm({
      name: subscription.name,
      NoOfDevices: subscription.NoOfDevices || subscription.NoOfDecives || 1,
      price: subscription.price,
      description: subscription.description || "",
    })
    setIsEditDialogOpen(true)
  }

  const openDeleteDialog = (subscription: Subscription) => {
    setSelectedSubscription(subscription)
    setIsDeleteDialogOpen(true)
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Subscription Plans</h1>
            <p className="text-muted-foreground">Manage subscription plans available to users.</p>
          </div>

          <div className="mt-4 md:mt-0">
            <Button onClick={() => setIsCreateDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Create Subscription
            </Button>
          </div>
        </div>

        <Card>
          <CardHeader>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <CardTitle>All Subscription Plans</CardTitle>
                <CardDescription>
                  Total {subscriptions.length} subscription plans available
                </CardDescription>
              </div>

              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search plans..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 w-full md:w-64"
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:gri\
