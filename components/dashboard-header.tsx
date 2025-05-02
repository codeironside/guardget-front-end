"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/mode-toggle";
import { Bell, Menu } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";

interface DashboardHeaderProps {
  user: any;
  onToggleSidebar: () => void;
  onLogout: () => void;
}

const DashboardHeader = ({
  user,
  onToggleSidebar,
  onLogout,
}: DashboardHeaderProps) => {
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: "Subscription Reminder",
      message: "Your subscription will expire in 7 days.",
    },
    {
      id: 2,
      title: "New Feature",
      message: "Check out our new device tracking feature!",
    },
  ]);

  return (
    <header className="sticky top-0 z-40 bg-background border-b">
      <div className="flex items-center justify-between p-4">
        <button
          onClick={onToggleSidebar}
          className="p-2 rounded-md hover:bg-accent md:hidden"
        >
          <Menu className="h-5 w-5" />
        </button>

        <div className="flex-1" />

        <div className="flex items-center space-x-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                {notifications.length > 0 && (
                  <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-primary text-[10px] text-primary-foreground flex items-center justify-center">
                    {notifications.length}
                  </span>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
              <DropdownMenuLabel>Notifications</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {notifications.length > 0 ? (
                notifications.map((notification) => (
                  <DropdownMenuItem
                    key={notification.id}
                    className="flex flex-col items-start py-2"
                  >
                    <span className="font-medium">{notification.title}</span>
                    <span className="text-sm text-muted-foreground">
                      {notification.message}
                    </span>
                  </DropdownMenuItem>
                ))
              ) : (
                <DropdownMenuItem>No new notifications</DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>

          <ModeToggle />

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                <Avatar className="h-8 w-8">
                  {user?.imageurl ? (
                    <AvatarImage
                      src={user.imageurl || "/placeholder.svg"}
                      alt={user?.firstName || "User"}
                    />
                  ) : (
                    <AvatarFallback>
                      {user?.firstName?.charAt(0) || "U"}
                      {user?.surName?.charAt(0) || ""}
                    </AvatarFallback>
                  )}
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/dashboard/settings">Profile Settings</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/dashboard/subscription">Subscription</Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={onLogout}>Logout</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;
