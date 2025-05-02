"use client";

import type React from "react";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  Smartphone,
  Search,
  Receipt,
  Settings,
  LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
} from "@/components/ui/sidebar";

type NavItem = {
  title: string;
  href: string;
  icon: React.ElementType;
};

const navItems: NavItem[] = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: Home,
  },
  {
    title: "My Devices",
    href: "/dashboard/devices",
    icon: Smartphone,
  },
  {
    title: "Device Status",
    href: "/dashboard/device-status",
    icon: Search,
  },
  {
    title: "Receipts",
    href: "/dashboard/receipts",
    icon: Receipt,
  },
  {
    title: "Settings",
    href: "/dashboard/settings",
    icon: Settings,
  },
];

export function CollapsibleSidebar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  // Handle hover events
  const handleMouseEnter = () => setOpen(true);
  const handleMouseLeave = () => setOpen(false);

  return (
    <SidebarProvider defaultOpen={false} open={open} onOpenChange={setOpen}>
      <Sidebar
        className="border-r transition-all duration-300 ease-in-out"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <SidebarHeader className="p-4">
          <div
            className={cn(
              "flex items-center gap-2 transition-opacity duration-200",
              !open && "opacity-0"
            )}
          >
            <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold">
              G
            </div>
            <span className="font-bold text-lg">Guardget</span>
          </div>
          {!open && (
            <div className="absolute left-1/2 top-4 -translate-x-1/2">
              <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold">
                G
              </div>
            </div>
          )}
        </SidebarHeader>

        <SidebarContent>
          <SidebarMenu>
            {navItems.map((item) => {
              const isActive =
                pathname === item.href || pathname.startsWith(`${item.href}/`);

              return (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton
                    asChild
                    isActive={isActive}
                    tooltip={item.title}
                  >
                    <Link href={item.href} className="flex items-center">
                      <item.icon className="mr-2 h-5 w-5" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>
        </SidebarContent>

        <SidebarFooter className="p-4">
          <Button variant="outline" className="w-full justify-start" asChild>
            <Link href="/auth/login">
              <LogOut className="mr-2 h-4 w-4" />
              <span>Logout</span>
            </Link>
          </Button>
        </SidebarFooter>
      </Sidebar>
    </SidebarProvider>
  );
}
