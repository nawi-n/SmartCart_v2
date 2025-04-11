"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { useAuth } from "@/components/auth-provider"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { Loader2, Plus, Trash2, ArrowLeft } from "lucide-react"

type ShoppingList = {
  id: number
  name: string
  user_id: number
  created_at: string
  updated_at: string
  items: ShoppingListItem[]
}

type ShoppingListItem = {
  id: number
  product_id: number
  quantity: number
  created_at: string
  product: {
    id: number
    name: string
    price: number
    category?: string
  }
}

type Product = {
  id: number
  name: string
  description: string
  price: number
  category: string
}

export default function ShoppingListDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { token } = useAuth()
  const { toast } = useToast()
  const [loading, setLoading] = useState(true)
  const [list, setList] = useState<ShoppingList | null>(null)
  const [products, setProducts] = useState<Product[]>([])
  const [selectedProductId, setSelectedProductId] = useState<string>("")
  const [quantity, setQuantity] = useState<number>(1)
  const [isAdding, setIsAdding] = useState(false)
  const [isRemoving, setIsRemoving] = useState(false)
  const baseUrl = "http://127.0.0.1:8000"
  const listId = params.id

  useEffect(() => {
    if (token && listId) {
      fetchShoppingList()
      fetchProducts()
    }
  }, [token, listId])

  const fetchShoppingList = async () => {
    try {
      setLoading(true)
      const response = await fetch(`${baseUrl}/shopping-lists/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.ok) {
        const lists = await response.json()
        const currentList = lists.find((l: ShoppingList) => l.id.toString() === listId)

        if (currentList) {
          setList(currentList)
        } else {
          toast({
            title: "Error",
            description: "Shopping list not found",
            variant: "destructive",
          })
          router.push("/lists")
        }
      }
    } catch (error) {
      console.error("Error fetching shopping list:", error)
      toast({
        title: "Error",
        description: "Failed to fetch shopping list",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const fetchProducts = async () => {
    try {
      const response = await fetch(`${baseUrl}/products/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.ok) {
        const data = await response.json()
        setProducts(data)
      }
    } catch (error) {
      console.error("Error fetching products:", error)
    }
  }

  const addItemToList = async () => {
    if (!token || !selectedProductId || !listId) return

    try {
      setIsAdding(true)
      const response = await fetch(`${baseUrl}/shopping-lists/${listId}/items/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          product_id: Number.parseInt(selectedProductId),
          quantity: quantity,
        }),
      })

      if (response.ok) {
        const newItem = await response.json()
        setList((prev) => {
          if (!prev) return prev
          return {
            ...prev,
            items: [...prev.items, newItem],
          }
        })
        setSelectedProductId("")
        setQuantity(1)
        toast({
          title: "Success",
          description: "Item added to shopping list",
        })
      }
    } catch (error) {
      console.error("Error adding item to list:", error)
      toast({
        title: "Error",
        description: "Failed to add item to shopping list",
        variant: "destructive",
      })
    } finally {
      setIsAdding(false)
    }
  }

  const removeItem = async (itemId: number) => {
    if (!token || !listId) return

    try {
      setIsRemoving(true)
      const response = await fetch(`${baseUrl}/shopping-lists/${listId}/items/${itemId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.ok) {
        setList((prev) => {
          if (!prev) return prev
          return {
            ...prev,
            items: prev.items.filter((item) => item.id !== itemId),
          }
        })
        toast({
          title: "Success",
          description: "Item removed from shopping list",
        })
      }
    } catch (error) {
      console.error("Error removing item:", error)
      toast({
        title: "Error",
        description: "Failed to remove item from shopping list",
        variant: "destructive",
      })
    } finally {
      setIsRemoving(false)
    }
  }

  const calculateTotalPrice = () => {
    if (!list) return 0
    return list.items.reduce((total, item) => total + item.product.price * item.quantity, 0)
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center space-x-2">
        <Button variant="ghost" size="icon" onClick={() => router.push("/lists")}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{list?.name || "Shopping List"}</h1>
          <p className="text-muted-foreground">
            {list ? `Created on ${new Date(list.created_at).toLocaleDateString()}` : "Loading..."}
          </p>
        </div>
      </div>

      <div className="flex justify-between items-center">
        <div className="space-y-1">
          <h2 className="text-xl font-semibold">Items</h2>
          <p className="text-sm text-muted-foreground">Total: ${calculateTotalPrice().toFixed(2)}</p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Item
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Item to List</DialogTitle>
              <DialogDescription>Select a product and quantity to add to your list</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="product">Product</Label>
                <Select value={selectedProductId} onValueChange={setSelectedProductId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a product" />
                  </SelectTrigger>
                  <SelectContent>
                    {products.map((product) => (
                      <SelectItem key={product.id} value={product.id.toString()}>
                        {product.name} - ${product.price.toFixed(2)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="quantity">Quantity</Label>
                <Input
                  id="quantity"
                  type="number"
                  min="1"
                  value={quantity}
                  onChange={(e) => setQuantity(Number.parseInt(e.target.value) || 1)}
                />
              </div>
            </div>
            <DialogFooter>
              <Button onClick={addItemToList} disabled={isAdding || !selectedProductId}>
                {isAdding ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Adding...
                  </>
                ) : (
                  "Add to List"
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <div className="space-y-4">
          {list && list.items.length > 0 ? (
            list.items.map((item) => (
              <Card key={item.id}>
                <CardHeader className="py-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <CardTitle className="text-lg">{item.product.name}</CardTitle>
                      <CardDescription>
                        {item.product.category || "Product"} • ${item.product.price.toFixed(2)} each
                      </CardDescription>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-destructive"
                      onClick={() => removeItem(item.id)}
                      disabled={isRemoving}
                    >
                      {isRemoving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="py-0">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Quantity: {item.quantity}</span>
                    <span className="font-medium">${(item.product.price * item.quantity).toFixed(2)}</span>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground mb-4">This shopping list is empty</p>
              <Dialog>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Your First Item
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add Item to List</DialogTitle>
                    <DialogDescription>Select a product and quantity to add to your list</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="product">Product</Label>
                      <Select value={selectedProductId} onValueChange={setSelectedProductId}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a product" />
                        </SelectTrigger>
                        <SelectContent>
                          {products.map((product) => (
                            <SelectItem key={product.id} value={product.id.toString()}>
                              {product.name} - ${product.price.toFixed(2)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="quantity">Quantity</Label>
                      <Input
                        id="quantity"
                        type="number"
                        min="1"
                        value={quantity}
                        onChange={(e) => setQuantity(Number.parseInt(e.target.value) || 1)}
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button onClick={addItemToList} disabled={isAdding || !selectedProductId}>
                      {isAdding ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Adding...
                        </>
                      ) : (
                        "Add to List"
                      )}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
