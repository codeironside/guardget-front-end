"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/mode-toggle";
import { Menu, X, Shield, ChevronDown, Home } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { useMobile } from "@/hooks/use-mobile";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const isMobile = useMobile();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);

    // Check if user is logged in based on localStorage or session
    const checkLoginStatus = () => {
      // Check for auth token
      const token = localStorage.getItem("accessToken");
      const userData = localStorage.getItem("user");

      if (token && userData) {
        setIsLoggedIn(true);
        try {
          setUser(JSON.parse(userData));
        } catch (error) {
          console.error("Error parsing user data:", error);
        }
      } else {
        setIsLoggedIn(false);
        setUser(null);
      }
    };

    checkLoginStatus();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const closeMenu = () => {
    setIsOpen(false);
  };

  const isActive = (path: string) => {
    return pathname === path;
  };

  const handleLogout = () => {
    // Clear auth data
    localStorage.removeItem("accessToken");
    localStorage.removeItem("user");
    setIsLoggedIn(false);
    setUser(null);

    // Redirect to home page
    window.location.href = "/";
  };

  const getInitials = () => {
    if (!user) return "GG";
    return `${user.firstName?.charAt(0) || ""}${user.surName?.charAt(0) || ""}`;
  };

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full transition-all duration-300",
        isScrolled
          ? "bg-background/80 backdrop-blur-md shadow-sm"
          : "bg-transparent"
      )}
    >
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <Shield className="h-8 w-8 text-primary animated-icon" />
            <span className="font-anta text-xl md:text-2xl">Guardget</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link
              href="/"
              className={cn(
                "text-sm font-medium transition-colors hover:text-primary",
                isActive("/") ? "text-primary" : "text-foreground/80"
              )}
            >
              Home
            </Link>
            <Link
              href="/about"
              className={cn(
                "text-sm font-medium transition-colors hover:text-primary",
                isActive("/about") ? "text-primary" : "text-foreground/80"
              )}
            >
              About
            </Link>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center text-sm font-medium transition-colors hover:text-primary text-foreground/80">
                  Services <ChevronDown className="ml-1 h-4 w-4" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="center">
                <DropdownMenuItem asChild>
                  <Link href="/device-status" className="w-full cursor-pointer">
                    Device Status Checker
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/faq" className="w-full cursor-pointer">
                    FAQs
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Link
              href="/contact"
              className={cn(
                "text-sm font-medium transition-colors hover:text-primary",
                isActive("/contact") ? "text-primary" : "text-foreground/80"
              )}
            >
              Contact
            </Link>
          </nav>

          <div className="hidden md:flex items-center space-x-4">
            <ModeToggle />
            {isLoggedIn ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="relative h-8 w-8 rounded-full"
                  >
                    <Avatar className="h-8 w-8">
                      {user?.imageurl ? (
                        <AvatarImage
                          src={user.imageurl || "/placeholder.svg"}
                          alt={`${user.firstName} ${user.surName}`}
                        />
                      ) : (
                        <AvatarFallback>{getInitials()}</AvatarFallback>
                      )}
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard" className="cursor-pointer">
                      Dashboard
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard/profile" className="cursor-pointer">
                      Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleLogout}>
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Link href="/auth/login">
                  <Button variant="outline" size="sm">
                    Login
                  </Button>
                </Link>
                <Link href="/auth/register">
                  <Button size="sm">Register</Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Navigation */}
          <div className="flex md:hidden items-center space-x-4">
            <ModeToggle />
            <button
              onClick={toggleMenu}
              className="p-2 rounded-md hover:bg-accent"
              aria-label="Toggle menu"
            >
              {isOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden pt-4 pb-6 space-y-4">
            <Link
              href="/"
              className={cn(
                "block py-2 text-sm font-medium transition-colors hover:text-primary",
                isActive("/") ? "text-primary" : "text-foreground/80"
              )}
              onClick={closeMenu}
            >
              Home
            </Link>
            <Link
              href="/about"
              className={cn(
                "block py-2 text-sm font-medium transition-colors hover:text-primary",
                isActive("/about") ? "text-primary" : "text-foreground/80"
              )}
              onClick={closeMenu}
            >
              About
            </Link>
            <div className="py-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-foreground/80">
                  Services
                </span>
                <ChevronDown className="h-4 w-4" />
              </div>
              <div className="pl-4 mt-2 space-y-2">
                <Link
                  href="/device-status"
                  className="block py-1 text-sm font-medium transition-colors hover:text-primary"
                  onClick={closeMenu}
                >
                  Device Status Checker
                </Link>
                <Link
                  href="/faq"
                  className="block py-1 text-sm font-medium transition-colors hover:text-primary"
                  onClick={closeMenu}
                >
                  FAQs
                </Link>
              </div>
            </div>
            <Link
              href="/contact"
              className={cn(
                "block py-2 text-sm font-medium transition-colors hover:text-primary",
                isActive("/contact") ? "text-primary" : "text-foreground/80"
              )}
              onClick={closeMenu}
            >
              Contact
            </Link>
            <div className="pt-4 flex flex-col space-y-2">
              {isLoggedIn ? (
                <>
                  <Link href="/dashboard" onClick={closeMenu}>
                    <Button variant="outline" className="w-full">
                      <Home className="mr-2 h-4 w-4" />
                      Dashboard
                    </Button>
                  </Link>
                  <Button className="w-full" onClick={handleLogout}>
                    Logout
                  </Button>
                </>
              ) : (
                <>
                  <Link href="/auth/login" onClick={closeMenu}>
                    <Button variant="outline" className="w-full">
                      Login
                    </Button>
                  </Link>
                  <Link href="/auth/register" onClick={closeMenu}>
                    <Button className="w-full">Register</Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
