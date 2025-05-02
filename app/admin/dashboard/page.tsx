"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Users, Smartphone, Receipt, Search, ArrowUpRight, ArrowDownRight, Loader2 } from "lucide-react"
import AdminLayout from "@/components/admin-layout"
import { LineChart, BarChart } from "@/components/charts"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { formatDate, formatCurrency } from "@/lib/utils"
import { toast } from "@/hooks/use-toast"

interface DashboardStats {
  users: {
    total: number
    active: number
    subscriptionTiers: Array<{ _id: string; count: number }>
    recent: Array<{
      _id: string
      username: string
      email: string
      createdAt: string
      subscriptionStatus: string
    }>
  }
  devices: {
    total: number
    byStatus: Array<{ _id: string; count: number }>
    byType: Array<{ _id: string; count: number }>
    recent: Array<{
      _id: string
      name: string
      status: string
      createdAt: string
    }>
  }
  receipts: {
    total: number
    revenue: number
    recent: Array<{
      _id: string
      amount: number
      status: string
      userId: string
      createdAt: string
    }>
  }
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")

  // Fetch dashboard statistics
  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        // In a real app, this would be an API call
        // Example: const response = await fetch('/api/admin/dashboard-stats')

        // Simulate API response
        setTimeout(() => {
          const mockStats: DashboardStats = {
            users: {
              total: 4,
              active: 2,
              subscriptionTiers: [
                {
                  _id: "No Subscription",
                  count: 2,
                },
                {
                  _id: "parents",
                  count: 2,
                },
              ],
              recent: [
                {
                  _id: "680e9ba78cfdea1829ff9bc1",
                  username: "AYOadmin.user",
                  email: "ayo.admin@example.ng",
                  createdAt: "2025-04-27T21:03:35.873Z",
                  subscriptionStatus: "Inactive",
                },
                {
                  _id: "680e8919db341ca6b1d159aa",
                  username: "Angelgold12",
                  email: "angel.adekunle@example.ng",
                  createdAt: "2025-04-27T19:44:25.804Z",
                  subscriptionStatus: "Active",
                },
                {
                  _id: "680d434222c953679fca02c2",
                  username: "Adekunlegold12",
                  email: "tobi.adekunle@example.ng",
                  createdAt: "2025-04-26T20:34:10.822Z",
                  subscriptionStatus: "Active",
                },
                {
                  _id: "680a3bf749c6275a46b21d07",
                  username: "ayo_adenike92",
                  email: "ayo.adekunle@example.ng",
                  createdAt: "2025-04-24T13:26:15.196Z",
                  subscriptionStatus: "Inactive",
                },
              ],
            },
            devices: {
              total: 3,
              byStatus: [
                {
                  _id: "inactive",
                  count: 3,
                },
              ],
              byType: [
                {
                  _id: "GPS",
                  count: 1,
                },
                {
                  _id: "Temperature",
                  count: 1,
                },
                {
                  _id: "mobile",
                  count: 1,
                },
              ],
              recent: [
                {
                  _id: "680e802789096849dce94cc2",
                  name: "Beta Tracker",
                  status: "inactive",
                  createdAt: "2025-04-27T19:06:15.227Z",
                },
                {
                  _id: "680e7e64647bc518a7fa5894",
                  name: "Alpha Sensor",
                  status: "inactive",
                  createdAt: "2025-04-27T18:58:44.882Z",
                },
                {
                  _id: "680e7a69b15a6cbd05343814",
                  name: "Redmi 12C",
                  status: "inactive",
                  createdAt: "2025-04-27T18:41:45.549Z",
                },
              ],
            },
            receipts: {
              total: 4,
              revenue: 1600,
              recent: [
                {
                  _id: "680e8b18b3951f8cc7302130",
                  amount: 400,
                  status: "completed",
                  userId: "680e8919db341ca6b1d159aa",
                  createdAt: "2025-04-27T19:52:56.346Z",
                },
                {
                  _id: "680e481b747ac30756899f0f",
                  amount: 400,
                  status: "completed",
                  userId: "680d434222c953679fca02c2",
                  createdAt: "2025-04-27T15:07:07.416Z",
                },
                {
                  _id: "680e47c13fe3e52a34a0e0a0",
                  amount: 400,
                  status: "completed",
                  userId: "680d434222c953679fca02c2",
                  createdAt: "2025-04-27T15:05:37.347Z",
                },
                {
                  _id: "680e4639b8ac3f14c4552e12",
                  amount: 400,
                  status: "completed",
                  userId: "680d434222c953679fca02c2",
                  createdAt: "2025-04-27T14:59:05.995Z",
                },
              ],
            },
          }

          setStats(mockStats)
          setIsLoading(false)
        }, 1500)
      } catch (error) {
        console.error("Error fetching dashboard stats:", error)
        toast({
          title: "Error",
          description: "Failed to load dashboard statistics. Please try again.",
          variant: "destructive",
        })
        setIsLoading(false)
      }
    }

    fetchDashboardStats()
  }, [])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    // In a real app, this would trigger a search API call
    console.log("Searching for:", searchQuery)
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "active":
        return "bg-green-100 text-green-600 border-green-200"
      case "inactive":
        return "bg-gray-100 text-gray-600 border-gray-200"
      case "stolen":
        return "bg-red-100 text-red-600 border-red-200"
      case "missing":
        return "bg-amber-100 text-amber-600 border-amber-200"
      case "completed":
        return "bg-green-100 text-green-600 border-green-200"
      default:
        return "bg-gray-100 text-gray-600 border-gray-200"
    }
  }

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-[80vh]">
          <div className="flex flex-col items-center gap-2">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-muted-foreground">Loading dashboard data...</p>
          </div>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <h1 className="text-3xl font-semibold">Admin Dashboard</h1>

          <form onSubmit={handleSearch} className="mt-4 md:mt-0 flex w-full md:w-auto">
            <div className="relative w-full md:w-80">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search users, devices, or reports..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button type="submit" className="ml-2">
              Search
            </Button>
          </form>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total Users"
            value={stats?.users.total.toLocaleString() || "0"}
            icon={<Users className="h-5 w-5" />}
            change={(stats?.users.active / (stats?.users.total || 1)) * 100 || 0}
            changeLabel="active users"
          />

          <StatCard
            title="Registered Devices"
            value={stats?.devices.total.toLocaleString() || "0"}
            icon={<Smartphone className="h-5 w-5" />}
            change={0}
            changeLabel="from last month"
          />

          <StatCard
            title="Total Revenue"
            value={formatCurrency(stats?.receipts.revenue || 0)}
            icon={<Receipt className="h-5 w-5" />}
            change={0}
            changeLabel="from last month"
          />

          <StatCard
            title="Total Receipts"
            value={stats?.receipts.total.toLocaleString() || "0"}
            icon={<Receipt className="h-5 w-5" />}
            change={0}
            changeLabel="from last month"
          />
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">User Growth</CardTitle>
            </CardHeader>
            <CardContent>
              <LineChart />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Device Statistics</CardTitle>
            </CardHeader>
            <CardContent>
              <BarChart />
            </CardContent>
          </Card>
        </div>

        {/* Tabs for different data views */}
        <Tabs defaultValue="recent-users">
          <TabsList className="grid grid-cols-1 md:grid-cols-3 mb-8">
            <TabsTrigger value="recent-users">Recent Users</TabsTrigger>
            <TabsTrigger value="recent-devices">Recent Devices</TabsTrigger>
            <TabsTrigger value="recent-receipts">Recent Receipts</TabsTrigger>
          </TabsList>

          <TabsContent value="recent-users">
            <Card>
              <CardHeader>
                <CardTitle>Recently Registered Users</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 px-4 font-medium">User</th>
                        <th className="text-left py-3 px-4 font-medium">Email</th>
                        <th className="text-left py-3 px-4 font-medium">Date Joined</th>
                        <th className="text-left py-3 px-4 font-medium">Status</th>
                        <th className="text-right py-3 px-4 font-medium">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {stats?.users.recent.map((user) => (
                        <tr key={user._id} className="border-b">
                          <td className="py-3 px-4">
                            <div className="flex items-center">
                              <Avatar className="h-8 w-8 mr-2">
                                <AvatarFallback>{user.username.substring(0, 2).toUpperCase()}</AvatarFallback>
                              </Avatar>
                              <span>{user.username}</span>
                            </div>
                          </td>
                          <td className="py-3 px-4">{user.email}</td>
                          <td className="py-3 px-4">{formatDate(user.createdAt)}</td>
                          <td className="py-3 px-4">
                            <Badge variant="outline" className={getStatusColor(user.subscriptionStatus)}>
                              {user.subscriptionStatus}
                            </Badge>
                          </td>
                          <td className="py-3 px-4 text-right">
                            <Button variant="ghost" size="sm" asChild>
                              <a href={`/admin/users/${user._id}`}>View</a>
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="recent-devices">
            <Card>
              <CardHeader>
                <CardTitle>Recently Registered Devices</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 px-4 font-medium">Device Name</th>
                        <th className="text-left py-3 px-4 font-medium">Status</th>
                        <th className="text-left py-3 px-4 font-medium">Date Added</th>
                        <th className="text-right py-3 px-4 font-medium">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {stats?.devices.recent.map((device) => (
                        <tr key={device._id} className="border-b">
                          <td className="py-3 px-4">
                            <div className="flex items-center">
                              <Smartphone className="h-5 w-5 mr-2 text-primary" />
                              <span>{device.name}</span>
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <Badge variant="outline" className={getStatusColor(device.status)}>
                              {device.status.charAt(0).toUpperCase() + device.status.slice(1)}
                            </Badge>
                          </td>
                          <td className="py-3 px-4">{formatDate(device.createdAt)}</td>
                          <td className="py-3 px-4 text-right">
                            <Button variant="ghost" size="sm" asChild>
                              <a href={`/admin/devices/${device._id}`}>View</a>
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="recent-receipts">
            <Card>
              <CardHeader>
                <CardTitle>Recent Receipts</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 px-4 font-medium">Receipt ID</th>
                        <th className="text-left py-3 px-4 font-medium">Amount</th>
                        <th className="text-left py-3 px-4 font-medium">Status</th>
                        <th className="text-left py-3 px-4 font-medium">Date</th>
                        <th className="text-right py-3 px-4 font-medium">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {stats?.receipts.recent.map((receipt) => (
                        <tr key={receipt._id} className="border-b">
                          <td className="py-3 px-4">
                            <div className="flex items-center">
                              <Receipt className="h-5 w-5 mr-2 text-primary" />
                              <span className="font-mono text-sm">{receipt._id.substring(0, 10)}...</span>
                            </div>
                          </td>
                          <td className="py-3 px-4">{formatCurrency(receipt.amount)}</td>
                          <td className="py-3 px-4">
                            <Badge variant="outline" className={getStatusColor(receipt.status)}>
                              {receipt.status.charAt(0).toUpperCase() + receipt.status.slice(1)}
                            </Badge>
                          </td>
                          <td className="py-3 px-4">{formatDate(receipt.createdAt)}</td>
                          <td className="py-3 px-4 text-right">
                            <Button variant="ghost" size="sm" asChild>
                              <a href={`/admin/receipts/${receipt._id}`}>View</a>
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  )
}

interface StatCardProps {
  title: string
  value: string
  icon: React.ReactNode
  change: number
  changeLabel: string
}

const StatCard = ({ title, value, icon, change, changeLabel }: StatCardProps) => {
  const isPositive = change >= 0

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="font-semibold text-muted-foreground">{title}</div>
          <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center">{icon}</div>
        </div>
        <div className="text-3xl font-bold mb-2">{value}</div>
        <div className="flex items-center">
          <Badge
            variant="outline"
            className={`mr-2 ${isPositive ? "text-green-500 border-green-500" : "text-red-500 border-red-500"}`}
          >
            <span className="flex items-center">
              {isPositive ? <ArrowUpRight className="h-3 w-3 mr-1" /> : <ArrowDownRight className="h-3 w-3 mr-1" />}
              {Math.abs(change).toFixed(1)}%
            </span>
          </Badge>
          <span className="text-xs text-muted-foreground">{changeLabel}</span>
        </div>
      </CardContent>
    </Card>
  )
}
