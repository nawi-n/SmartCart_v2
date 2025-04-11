"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/components/auth-provider"
import { useSidebar } from "@/components/sidebar-provider"
import { Menu, X } from "lucide-react"

export function MainNav() {
  const pathname = usePathname()
  const { logout } = useAuth()
  const { isSidebarOpen, toggleSidebar } = useSidebar()

  const routes = [
    {
      href: "/dashboard",
      label: "Dashboard",
      active: pathname === "/dashboard",
    },
    {
      href: "/recommendations",
      label: "Recommendations",
      active: pathname === "/recommendations",
    },
    {
      href: "/voice-search",
      label: "Voice Search",
      active: pathname === "/voice-search",
    },
    {
      href: "/lists",
      label: "Shopping Lists",
      active: pathname.startsWith("/lists"),
    },
    {
      href: "/analytics",
      label: "Analytics",
      active: pathname === "/analytics",
    },
  ]

  return (
    <div className="flex h-16 items-center px-4 border-b bg-white">
      <Button variant="ghost" className="mr-2 px-2 lg:hidden" onClick={toggleSidebar}>
        {isSidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        <span className="sr-only">Toggle sidebar</span>
      </Button>
      <div className="flex items-center gap-2 font-bold text-xl mr-4">
        <span className="text-primary">Smart</span>
        <span>Cart</span>
      </div>
      <nav className="hidden lg:flex items-center space-x-4 lg:space-x-6 mx-6">
        {routes.map((route) => (
          <Link
            key={route.href}
            href={route.href}
            className={cn(
              "text-sm font-medium transition-colors hover:text-primary",
              route.active ? "text-primary" : "text-muted-foreground",
            )}
          >
            {route.label}
          </Link>
        ))}
      </nav>
      <div className="ml-auto flex items-center space-x-4">
        <Button
          variant="ghost"
          onClick={logout}
          className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
        >
          Logout
        </Button>
      </div>
    </div>
  )
}
