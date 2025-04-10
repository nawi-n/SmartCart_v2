"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import {
  Search,
  ShoppingCart,
  User,
  ChevronDown,
  Menu,
  X,
  Heart,
  Package,
  LogOut,
  Bell,
  Mic,
  BarChart2,
  ShoppingBag,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

export default function Navbar() {
  const pathname = usePathname()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(true)

  // Skip rendering navbar on login page
  if (pathname === "/login") {
    return null
  }

  return (
    <header className="sticky top-0 z-50 bg-[#2874f0] text-white shadow-md">
      <div className="container mx-auto px-4 py-2.5">
        <div className="flex items-center justify-between gap-4">
          {/* Mobile Menu Button */}
          <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon" className="text-white">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="p-0">
              <div className="bg-[#2874f0] p-4 flex items-center justify-between">
                {isLoggedIn ? (
                  <div className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    <span>Hello, User</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Button asChild variant="secondary" size="sm">
                      <Link href="/login">Login</Link>
                    </Button>
                    <span className="text-sm">Sign Up</span>
                  </div>
                )}
                <Button variant="ghost" size="icon" onClick={() => setIsMenuOpen(false)}>
                  <X className="h-5 w-5" />
                </Button>
              </div>

              <div className="p-4 space-y-4">
                <Link
                  href="/"
                  className="flex items-center gap-3 p-2 hover:bg-gray-100 rounded-md"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <Package className="h-5 w-5 text-[#2874f0]" />
                  <span>All Categories</span>
                </Link>
                <Link
                  href="/voice-search"
                  className="flex items-center gap-3 p-2 hover:bg-gray-100 rounded-md"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <Mic className="h-5 w-5 text-[#2874f0]" />
                  <span>Voice Search</span>
                </Link>
                <Link
                  href="/shopping-list"
                  className="flex items-center gap-3 p-2 hover:bg-gray-100 rounded-md"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <ShoppingBag className="h-5 w-5 text-[#2874f0]" />
                  <span>Shopping List</span>
                </Link>
                <Link
                  href="/analytics"
                  className="flex items-center gap-3 p-2 hover:bg-gray-100 rounded-md"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <BarChart2 className="h-5 w-5 text-[#2874f0]" />
                  <span>Analytics</span>
                </Link>
                <Link
                  href="/wishlist"
                  className="flex items-center gap-3 p-2 hover:bg-gray-100 rounded-md"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <Heart className="h-5 w-5 text-[#2874f0]" />
                  <span>Wishlist</span>
                </Link>
                <Link
                  href="/cart"
                  className="flex items-center gap-3 p-2 hover:bg-gray-100 rounded-md"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <ShoppingCart className="h-5 w-5 text-[#2874f0]" />
                  <span>Cart</span>
                </Link>
                <Link
                  href="/orders"
                  className="flex items-center gap-3 p-2 hover:bg-gray-100 rounded-md"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <Package className="h-5 w-5 text-[#2874f0]" />
                  <span>My Orders</span>
                </Link>
                <Link
                  href="/notifications"
                  className="flex items-center gap-3 p-2 hover:bg-gray-100 rounded-md"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <Bell className="h-5 w-5 text-[#2874f0]" />
                  <span>Notifications</span>
                </Link>

                {isLoggedIn && (
                  <button
                    className="flex items-center gap-3 p-2 hover:bg-gray-100 rounded-md w-full text-left"
                    onClick={() => {
                      setIsLoggedIn(false)
                      setIsMenuOpen(false)
                    }}
                  >
                    <LogOut className="h-5 w-5 text-[#2874f0]" />
                    <span>Logout</span>
                  </button>
                )}
              </div>
            </SheetContent>
          </Sheet>

          {/* Logo */}
          <Link href="/" className="flex items-center">
            <div className="relative h-7 w-20">
              <Image src="/placeholder.svg?height=28&width=80" alt="SmartCart" fill className="object-contain" />
            </div>
            <span className="text-xs italic text-white/80 hidden sm:inline-block">
              Smart <span className="text-yellow-300">AI</span>
            </span>
          </Link>

          {/* Search */}
          <div className="flex-1 max-w-xl hidden md:block">
            <div className="relative">
              <Input
                type="search"
                placeholder="Search for products, brands and more"
                className="bg-white text-black h-10 pl-4 pr-10 rounded-sm focus-visible:ring-0 focus-visible:ring-offset-0"
              />
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-[#2874f0]" />
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-4">
            <Button asChild variant="ghost" className="text-white">
              <Link href="/voice-search" className="flex items-center">
                <Mic className="h-4 w-4 mr-1" />
                <span>Voice</span>
              </Link>
            </Button>

            <Button asChild variant="ghost" className="text-white">
              <Link href="/shopping-list" className="flex items-center">
                <ShoppingBag className="h-4 w-4 mr-1" />
                <span>List</span>
              </Link>
            </Button>

            <Button asChild variant="ghost" className="text-white">
              <Link href="/analytics" className="flex items-center">
                <BarChart2 className="h-4 w-4 mr-1" />
                <span>Analytics</span>
              </Link>
            </Button>

            {!isLoggedIn ? (
              <Button asChild className="bg-white text-[#2874f0] hover:bg-white/90" onClick={() => setIsLoggedIn(true)}>
                <Link href="/login">Login</Link>
              </Button>
            ) : (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="text-white">
                    <User className="h-4 w-4 mr-1" />
                    <span>Account</span>
                    <ChevronDown className="h-4 w-4 ml-1" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem asChild>
                    <Link href="/profile" className="cursor-pointer">
                      My Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/orders" className="cursor-pointer">
                      Orders
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/wishlist" className="cursor-pointer">
                      Wishlist
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => setIsLoggedIn(false)}>Logout</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}

            <Button asChild variant="ghost" className="text-white">
              <Link href="/cart" className="flex items-center">
                <ShoppingCart className="h-4 w-4 mr-1" />
                <span>Cart</span>
              </Link>
            </Button>
          </nav>

          {/* Mobile Cart Button */}
          <Button asChild variant="ghost" size="icon" className="md:hidden text-white">
            <Link href="/cart">
              <ShoppingCart className="h-6 w-6" />
            </Link>
          </Button>
        </div>

        {/* Mobile Search */}
        <div className="mt-2 md:hidden">
          <div className="relative">
            <Input
              type="search"
              placeholder="Search for products, brands and more"
              className="bg-white text-black h-9 pl-4 pr-10 rounded-sm focus-visible:ring-0 focus-visible:ring-offset-0"
            />
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-[#2874f0]" />
          </div>
        </div>
      </div>
    </header>
  )
}
