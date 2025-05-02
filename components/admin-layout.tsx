"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { Users, Smartphone, Receipt, LayoutDashboard, LogOut, Settings, User, CreditCard, Bell } from "lucide-react"
import { ModeToggle } from "@/components/mode-toggle"

interface AdminLayoutProps {
  children: React.ReactNode
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const pathname = usePathname()
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    // In a real app, this would fetch the admin user data
    // For now, we'll use mock data
    const mockUser = {
      username: "AYOadmin.user",
      firstName: "tobi",
      middleName: "Adenike",
      surName: "Adekunle",
      role: "admin",
      imageurl: "",
    }
    setUser(mockUser)
  }, [])

  const getInitials = () => {
    if (!user) return "AD"
    return `${user.firstName.charAt(0)}${user.surName.charAt(0)}`
  }

  const navItems = [
    {
      title: "Dashboard",
      icon: LayoutDashboard,
      href: "/admin/dashboard",
      active: pathname === "/admin/dashboard",
    },
    {
      title: "Users",
      icon: Users,
      href: "/admin/users",
      active: pathname.startsWith("/admin/users"),
    },
    {
      title: "Devices",
      icon: Smartphone,
      href: "/admin/devices",
      active: pathname.startsWith("/admin/devices"),
    },
    {
      title: "Receipts",
      icon: Receipt,
      href: "/admin/receipts",
      active: pathname.startsWith("/admin/receipts"),
    },
    {
      title: "Subscriptions",
      icon: CreditCard,
      href: "/admin/subscriptions",
      active: pathname.startsWith("/admin/subscriptions"),
    },
    {
      title: "Settings",
      icon: Settings,
      href: "/admin/settings",
      active: pathname === "/admin/settings",
    },
  ]

  return (
    <SidebarProvider>
      <div className="flex min-h-screen">
        {/* Sidebar for larger screens */}
        <Sidebar className="hidden md:flex">
          <SidebarHeader className="flex h-14 items-center border-b px-4">
            <Link href="/admin/dashboard" className="flex items-center gap-2 font-semibold">
              <Smartphone className="h-5 w-5" />
              <span>Guardget Admin</span>
            </Link>
          </SidebarHeader>
          <SidebarContent>
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={item.active}>
                    <Link href={item.href}>
                      <item.icon className="h-5 w-5" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarContent>
          <SidebarFooter className="border-t p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Avatar className="h-8 w-8">
                  {user?.imageurl ? (
                    <AvatarImage src={user.imageurl || "/placeholder.svg"} alt={user?.username || "Admin"} />
                  ) : (
                    <AvatarFallback>{getInitials()}</AvatarFallback>
                  )}
                </Avatar>
                <div>
                  <p className="text-sm font-medium">{user?.username || "Admin User"}</p>
                  <p className="text-xs text-muted-foreground">Administrator</p>
                </div>
              </div>
              <ModeToggle />
            </div>
          </SidebarFooter>
        </Sidebar>

        {/* Main content */}
        <div className="flex flex-1 flex-col">
          {/* Top navigation for mobile */}
          <header className="sticky top-0 z-10 flex h-14 items-center gap-4 border-b bg-background px-4 md:h-16 md:px-6">
            <SidebarTrigger className="md:hidden" />
            <div className="flex items-center gap-2 font-semibold md:hidden">
              <Smartphone className="h-5 w-5" />
              <span>Guardget Admin</span>
            </div>

            <div className="ml-auto flex items-center gap-4">
              <Button variant="ghost" size="icon" className="rounded-full">
                <Bell className="h-5 w-5" />
                <span className="sr-only">Notifications</span>
              </Button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-full">
                    <Avatar className="h-8 w-8">
                      {user?.imageurl ? (
                        <AvatarImage src={user.imageurl || "/placeholder.svg"} alt={user?.username || "Admin"} />
                      ) : (
                        <AvatarFallback>{getInitials()}</AvatarFallback>
                      )}
                    </Avatar>
                    <span className="sr-only">User menu</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/admin/settings">
                      <User className="mr-2 h-4 w-4" />
                      <span>Profile</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/admin/settings">
                      <Settings className="mr-2 h-4 w-4" />
                      <span>Settings</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/auth/login">
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Log out</span>
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </header>

          {/* Page content */}
          <main className="flex-1 overflow-auto p-4 md:p-6">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  )
}
