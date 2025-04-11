"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useAuth } from "@/components/auth-provider"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
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
import { useToast } from "@/hooks/use-toast"
import { Loader2, Plus, ShoppingBag, BarChart3 } from "lucide-react"

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
  }
}

export default function ShoppingListsPage() {
  const { user, token } = useAuth()
  const { toast } = useToast()
  const [loading, setLoading] = useState(true)
  const [lists, setLists] = useState<ShoppingList[]>([])
  const [newListName, setNewListName] = useState("")
  const [newListDescription, setNewListDescription] = useState("")
  const [isCreating, setIsCreating] = useState(false)
  const baseUrl = "http://127.0.0.1:8000"

  useEffect(() => {
    if (token) {
      fetchShoppingLists()
    }
  }, [token])

  const fetchShoppingLists = async () => {
    try {
      setLoading(true)
      const response = await fetch(`${baseUrl}/shopping-lists/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.ok) {
        const data = await response.json()
        setLists(data)
      }
    } catch (error) {
      console.error("Error fetching shopping lists:", error)
      toast({
        title: "Error",
        description: "Failed to fetch shopping lists",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const createShoppingList = async () => {
    if (!token || !newListName.trim()) return

    try {
      setIsCreating(true)
      const response = await fetch(`${baseUrl}/shopping-lists/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: newListName,
          description: newListDescription,
        }),
      })

      if (response.ok) {
        const newList = await response.json()
        setLists((prev) => [...prev, newList])
        setNewListName("")
        setNewListDescription("")
        toast({
          title: "Success",
          description: "Shopping list created successfully",
        })

        // Track behavior
        await fetch(`${baseUrl}/submit_behavior`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            customer_id: user?.id.toString(),
            action_type: "create_list",
            details: { list_name: newListName },
          }),
        })
      }
    } catch (error) {
      console.error("Error creating shopping list:", error)
      toast({
        title: "Error",
        description: "Failed to create shopping list",
        variant: "destructive",
      })
    } finally {
      setIsCreating(false)
    }
  }

  const calculateTotalItems = (list: ShoppingList) => {
    return list.items.reduce((total, item) => total + item.quantity, 0)
  }

  const calculateTotalPrice = (list: ShoppingList) => {
    return list.items.reduce((total, item) => total + item.product.price * item.quantity, 0)
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Shopping Lists</h1>
          <p className="text-muted-foreground">Manage your shopping lists</p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              New List
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Shopping List</DialogTitle>
              <DialogDescription>Add a new shopping list to organize your products</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">List Name</Label>
                <Input
                  id="name"
                  value={newListName}
                  onChange={(e) => setNewListName(e.target.value)}
                  placeholder="e.g., Weekly Groceries"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description (Optional)</Label>
                <Input
                  id="description"
                  value={newListDescription}
                  onChange={(e) => setNewListDescription(e.target.value)}
                  placeholder="e.g., Items for the week of April 10"
                />
              </div>
            </div>
            <DialogFooter>
              <Button onClick={createShoppingList} disabled={isCreating || !newListName.trim()}>
                {isCreating ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Creating...
                  </>
                ) : (
                  "Create List"
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
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {lists.length > 0 ? (
            lists.map((list) => (
              <Card key={list.id} className="overflow-hidden">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">{list.name}</CardTitle>
                  <CardDescription>Created on {new Date(list.created_at).toLocaleDateString()}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Total Items:</span>
                    <span className="font-medium">{calculateTotalItems(list)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Total Price:</span>
                    <span className="font-medium">${calculateTotalPrice(list).toFixed(2)}</span>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Link href={`/lists/${list.id}`}>
                    <Button variant="outline" size="sm">
                      <ShoppingBag className="h-4 w-4 mr-2" />
                      View Items
                    </Button>
                  </Link>
                  <Link href={`/lists/${list.id}/analysis`}>
                    <Button size="sm">
                      <BarChart3 className="h-4 w-4 mr-2" />
                      Analysis
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            ))
          ) : (
            <div className="col-span-3 text-center py-12">
              <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <ShoppingBag className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-lg font-medium mb-2">No Shopping Lists</h3>
              <p className="text-muted-foreground mb-4">You haven&apos;t created any shopping lists yet</p>
              <Dialog>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Create Your First List
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Create New Shopping List</DialogTitle>
                    <DialogDescription>Add a new shopping list to organize your products</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">List Name</Label>
                      <Input
                        id="name"
                        value={newListName}
                        onChange={(e) => setNewListName(e.target.value)}
                        placeholder="e.g., Weekly Groceries"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="description">Description (Optional)</Label>
                      <Input
                        id="description"
                        value={newListDescription}
                        onChange={(e) => setNewListDescription(e.target.value)}
                        placeholder="e.g., Items for the week of April 10"
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button onClick={createShoppingList} disabled={isCreating || !newListName.trim()}>
                      {isCreating ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Creating...
                        </>
                      ) : (
                        "Create List"
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
