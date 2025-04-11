"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useAuth } from "@/components/auth-provider"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { Loader2, ShoppingBag, Mic, BarChart3, List } from "lucide-react"
import Link from "next/link"

type QuickAction = {
  id: string
  name: string
  description: string
  icon: React.ReactNode
  href: string
}

export default function DashboardPage() {
  const { user, token } = useAuth()
  const { toast } = useToast()
  const [loading, setLoading] = useState(true)
  const [recentProducts, setRecentProducts] = useState<any[]>([])
  const baseUrl = "http://127.0.0.1:8000"

  useEffect(() => {
    if (token) {
      fetchRecentProducts()
    }
  }, [token])

  const fetchRecentProducts = async () => {
    try {
      setLoading(true)
      const response = await fetch(`${baseUrl}/recommend_products`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          customer_id: user?.id.toString(),
          limit: 3,
        }),
      })

      if (response.ok) {
        const data = await response.json()
        setRecentProducts(data)
      }
    } catch (error) {
      console.error("Error fetching products:", error)
      toast({
        title: "Error",
        description: "Failed to fetch recommended products",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const quickActions: QuickAction[] = [
    {
      id: "recommendations",
      name: "Product Recommendations",
      description: "Discover products tailored to your preferences",
      icon: <ShoppingBag className="h-5 w-5" />,
      href: "/recommendations",
    },
    {
      id: "voice-search",
      name: "Voice Search",
      description: "Search for products using your voice",
      icon: <Mic className="h-5 w-5" />,
      href: "/voice-search",
    },
    {
      id: "lists",
      name: "Shopping Lists",
      description: "Manage your shopping lists",
      icon: <List className="h-5 w-5" />,
      href: "/lists",
    },
    {
      id: "analytics",
      name: "Analytics",
      description: "View insights about your shopping habits",
      icon: <BarChart3 className="h-5 w-5" />,
      href: "/analytics",
    },
  ]

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">Welcome back, {user?.first_name || "User"}!</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {quickActions.map((action) => (
          <Link href={action.href} key={action.id}>
            <Card className="h-full cursor-pointer transition-all hover:bg-accent/10">
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-sm font-medium">{action.name}</CardTitle>
                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">{action.icon}</div>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground">{action.description}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-4">Recent Recommendations</h2>
        {loading ? (
          <div className="flex items-center justify-center h-40">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-3">
            {recentProducts.length > 0 ? (
              recentProducts.map((product, index) => (
                <Card key={index} className="overflow-hidden">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">{product.name}</CardTitle>
                    <CardDescription>
                      {product.category} • ${product.price.toFixed(2)}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Match</span>
                      <span className="text-sm font-medium">{Math.round(product.match_score * 100)}%</span>
                    </div>
                    <div className="w-full bg-secondary h-2 rounded-full overflow-hidden">
                      <div className="bg-primary h-full" style={{ width: `${product.match_score * 100}%` }} />
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="col-span-3 text-center py-8">
                <p className="text-muted-foreground">No recommendations yet</p>
                <Button variant="outline" className="mt-4" onClick={fetchRecentProducts}>
                  Refresh
                </Button>
              </div>
            )}
          </div>
        )}
        <div className="mt-4 text-center">
          <Link href="/recommendations">
            <Button>View All Recommendations</Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
