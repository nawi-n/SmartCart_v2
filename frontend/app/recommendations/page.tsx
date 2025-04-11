"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/components/auth-provider"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import { Loader2, Info, ShoppingCart } from "lucide-react"
import { cn } from "@/lib/utils"

type Product = {
  product_id: string
  name: string
  category: string
  price: number
  match_score: number
  explanation: string
  story?: string
}

export default function RecommendationsPage() {
  const { user, token } = useAuth()
  const { toast } = useToast()
  const [loading, setLoading] = useState(true)
  const [products, setProducts] = useState<Product[]>([])
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [productStory, setProductStory] = useState<string>("")
  const [storyLoading, setStoryLoading] = useState(false)
  const baseUrl = "http://127.0.0.1:8000"

  useEffect(() => {
    if (token) {
      fetchRecommendations()
    }
  }, [token])

  const fetchRecommendations = async () => {
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
        }),
      })

      if (response.ok) {
        const data = await response.json()
        setProducts(data)
      }
    } catch (error) {
      console.error("Error fetching recommendations:", error)
      toast({
        title: "Error",
        description: "Failed to fetch recommendations",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const fetchProductStory = async (productId: string) => {
    if (!token) return

    try {
      setStoryLoading(true)
      const response = await fetch(`${baseUrl}/product_storytelling`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          product_id: productId,
        }),
      })

      if (response.ok) {
        const data = await response.json()
        setProductStory(data.story)

        // Track behavior
        await fetch(`${baseUrl}/submit_behavior`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            customer_id: user?.id.toString(),
            action_type: "view_product_story",
            product_id: productId,
            details: { product_id: productId },
          }),
        })
      }
    } catch (error) {
      console.error("Error fetching product story:", error)
      toast({
        title: "Error",
        description: "Failed to fetch product story",
        variant: "destructive",
      })
    } finally {
      setStoryLoading(false)
    }
  }

  const handleProductClick = async (product: Product) => {
    setSelectedProduct(product)
    await fetchProductStory(product.product_id)

    // Track behavior
    if (token) {
      try {
        await fetch(`${baseUrl}/submit_behavior`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            customer_id: user?.id.toString(),
            action_type: "view_product",
            product_id: product.product_id,
            details: {
              product_name: product.name,
              category: product.category,
              price: product.price,
            },
          }),
        })
      } catch (error) {
        console.error("Error tracking behavior:", error)
      }
    }
  }

  const addToShoppingList = async (productId: string) => {
    if (!token || !user) return

    try {
      // First, get user's shopping lists
      const listsResponse = await fetch(`${baseUrl}/shopping-lists/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!listsResponse.ok) {
        throw new Error("Failed to fetch shopping lists")
      }

      const lists = await listsResponse.json()

      // If no lists exist, create one
      let listId
      if (lists.length === 0) {
        const createListResponse = await fetch(`${baseUrl}/shopping-lists/`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            name: "My Shopping List",
            description: "Default shopping list",
          }),
        })

        if (!createListResponse.ok) {
          throw new Error("Failed to create shopping list")
        }

        const newList = await createListResponse.json()
        listId = newList.id
      } else {
        // Use the first list
        listId = lists[0].id
      }

      // Add item to the list
      const addItemResponse = await fetch(`${baseUrl}/shopping-lists/${listId}/items/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          product_id: Number.parseInt(productId),
          quantity: 1,
        }),
      })

      if (addItemResponse.ok) {
        toast({
          title: "Success",
          description: "Product added to shopping list",
        })

        // Track behavior
        await fetch(`${baseUrl}/submit_behavior`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            customer_id: user.id.toString(),
            action_type: "add_to_list",
            product_id: productId,
            details: { list_id: listId },
          }),
        })
      } else {
        throw new Error("Failed to add item to shopping list")
      }
    } catch (error) {
      console.error("Error adding to shopping list:", error)
      toast({
        title: "Error",
        description: "Failed to add product to shopping list",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Recommendations</h1>
        <p className="text-muted-foreground">Products tailored to your preferences and mood</p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {products.length > 0 ? (
            products.map((product) => (
              <Card key={product.product_id} className="overflow-hidden">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{product.name}</CardTitle>
                      <CardDescription>
                        {product.category} • ${product.price.toFixed(2)}
                      </CardDescription>
                    </div>
                    <Badge
                      className={cn(
                        "px-2 py-1",
                        product.match_score >= 0.8
                          ? "bg-green-100 text-green-800"
                          : product.match_score >= 0.6
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-gray-100 text-gray-800",
                      )}
                    >
                      {Math.round(product.match_score * 100)}% Match
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="w-full bg-secondary h-2 rounded-full overflow-hidden">
                    <div
                      className={cn(
                        "h-full",
                        product.match_score >= 0.8
                          ? "bg-green-500"
                          : product.match_score >= 0.6
                            ? "bg-yellow-500"
                            : "bg-primary",
                      )}
                      style={{ width: `${product.match_score * 100}%` }}
                    />
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-2">{product.explanation}</p>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm" onClick={() => handleProductClick(product)}>
                        <Info className="h-4 w-4 mr-2" />
                        Details
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-md">
                      <DialogHeader>
                        <DialogTitle>{selectedProduct?.name}</DialogTitle>
                        <DialogDescription>
                          {selectedProduct?.category} • ${selectedProduct?.price.toFixed(2)}
                        </DialogDescription>
                      </DialogHeader>
                      <Tabs defaultValue="story">
                        <TabsList className="grid w-full grid-cols-2">
                          <TabsTrigger value="story">Story</TabsTrigger>
                          <TabsTrigger value="explanation">Why For You</TabsTrigger>
                        </TabsList>
                        <TabsContent value="story" className="space-y-4">
                          {storyLoading ? (
                            <div className="flex items-center justify-center h-40">
                              <Loader2 className="h-6 w-6 animate-spin text-primary" />
                            </div>
                          ) : (
                            <div className="text-sm">{productStory || "No story available for this product."}</div>
                          )}
                        </TabsContent>
                        <TabsContent value="explanation" className="space-y-4">
                          <div className="text-sm">{selectedProduct?.explanation}</div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium">Match Score</span>
                            <Badge
                              className={cn(
                                "px-2 py-1",
                                (selectedProduct?.match_score || 0) >= 0.8
                                  ? "bg-green-100 text-green-800"
                                  : (selectedProduct?.match_score || 0) >= 0.6
                                    ? "bg-yellow-100 text-yellow-800"
                                    : "bg-gray-100 text-gray-800",
                              )}
                            >
                              {Math.round((selectedProduct?.match_score || 0) * 100)}%
                            </Badge>
                          </div>
                        </TabsContent>
                      </Tabs>
                    </DialogContent>
                  </Dialog>
                  <Button size="sm" onClick={() => addToShoppingList(product.product_id)}>
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    Add to List
                  </Button>
                </CardFooter>
              </Card>
            ))
          ) : (
            <div className="col-span-3 text-center py-12">
              <p className="text-muted-foreground mb-4">No recommendations available</p>
              <Button onClick={fetchRecommendations}>Refresh</Button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
