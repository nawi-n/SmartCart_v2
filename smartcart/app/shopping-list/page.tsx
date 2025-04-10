"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import PersonaSidebar from "@/components/persona-sidebar"
import ChatAssistant from "@/components/chat-assistant"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Plus, Trash2, ShoppingCart, ArrowRight, Check, AlertCircle, Sparkles, DollarSign } from "lucide-react"
import { getMockProducts } from "@/lib/mock-data"

interface ShoppingItem {
  id: string
  name: string
  category: string
  quantity: number
  isCompleted: boolean
  image?: string
  price?: number
  matchScore?: number
}

export default function ShoppingListPage() {
  const [newItemName, setNewItemName] = useState("")
  const [shoppingList, setShoppingList] = useState<ShoppingItem[]>([
    {
      id: "1",
      name: "Milk",
      category: "groceries",
      quantity: 2,
      isCompleted: false,
    },
    {
      id: "2",
      name: "Bread",
      category: "groceries",
      quantity: 1,
      isCompleted: true,
    },
    {
      id: "3",
      name: "Eggs",
      category: "groceries",
      quantity: 12,
      isCompleted: false,
    },
    {
      id: "4",
      name: "Smartphone",
      category: "electronics",
      quantity: 1,
      isCompleted: false,
      image: "/placeholder.svg?height=80&width=80&text=electronics",
      price: 15999,
      matchScore: 85,
    },
  ])

  const addItem = () => {
    if (!newItemName.trim()) return

    const newItem: ShoppingItem = {
      id: Date.now().toString(),
      name: newItemName,
      category: "other",
      quantity: 1,
      isCompleted: false,
    }

    setShoppingList([...shoppingList, newItem])
    setNewItemName("")
  }

  const toggleItemCompletion = (id: string) => {
    setShoppingList(shoppingList.map((item) => (item.id === id ? { ...item, isCompleted: !item.isCompleted } : item)))
  }

  const removeItem = (id: string) => {
    setShoppingList(shoppingList.filter((item) => item.id !== id))
  }

  const updateQuantity = (id: string, newQuantity: number) => {
    if (newQuantity < 1) return

    setShoppingList(shoppingList.map((item) => (item.id === id ? { ...item, quantity: newQuantity } : item)))
  }

  const pendingItems = shoppingList.filter((item) => !item.isCompleted)
  const completedItems = shoppingList.filter((item) => item.isCompleted)

  // Get product recommendations based on shopping list
  const recommendations = getMockProducts("all", 4).map((product) => ({
    ...product,
    matchScore: Math.floor(Math.random() * 31) + 70,
  }))

  return (
    <main className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-1 flex">
        <PersonaSidebar />
        <div className="flex-1">
          <div className="container mx-auto px-4 py-8">
            <h1 className="text-2xl font-bold mb-6">Your Shopping List</h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                {/* Add new item */}
                <div className="bg-white rounded-md shadow-sm p-4 mb-6">
                  <div className="flex gap-2">
                    <Input
                      type="text"
                      placeholder="Add an item to your list..."
                      value={newItemName}
                      onChange={(e) => setNewItemName(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") addItem()
                      }}
                    />
                    <Button onClick={addItem}>
                      <Plus className="h-4 w-4 mr-1" /> Add
                    </Button>
                  </div>
                </div>

                {/* Pending items */}
                <div className="bg-white rounded-md shadow-sm mb-6">
                  <div className="p-4 border-b">
                    <h2 className="text-lg font-medium">Items to Buy ({pendingItems.length})</h2>
                  </div>

                  {pendingItems.length === 0 ? (
                    <div className="p-6 text-center">
                      <Check className="h-12 w-12 mx-auto text-green-500 mb-2" />
                      <p className="text-gray-500">All items have been purchased!</p>
                    </div>
                  ) : (
                    <ul>
                      {pendingItems.map((item) => (
                        <li key={item.id} className="p-4 border-b last:border-b-0">
                          <div className="flex items-center gap-3">
                            <Checkbox
                              checked={item.isCompleted}
                              onCheckedChange={() => toggleItemCompletion(item.id)}
                            />

                            {item.image && (
                              <div className="relative h-16 w-16 flex-shrink-0">
                                <Image
                                  src={item.image || "/placeholder.svg"}
                                  alt={item.name}
                                  fill
                                  className="object-contain"
                                />
                              </div>
                            )}

                            <div className="flex-1">
                              <div className="flex items-start justify-between">
                                <div>
                                  <h3 className="font-medium">{item.name}</h3>
                                  <p className="text-sm text-gray-500 capitalize">{item.category}</p>
                                </div>

                                {item.matchScore && (
                                  <div className="bg-green-600 text-white text-xs font-bold rounded-full h-6 w-6 flex items-center justify-center">
                                    {item.matchScore}%
                                  </div>
                                )}
                              </div>

                              {item.price && <p className="text-sm font-medium mt-1">₹{item.price.toLocaleString()}</p>}
                            </div>

                            <div className="flex items-center gap-2">
                              <Button
                                variant="outline"
                                size="icon"
                                className="h-8 w-8"
                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              >
                                -
                              </Button>
                              <span className="w-6 text-center">{item.quantity}</span>
                              <Button
                                variant="outline"
                                size="icon"
                                className="h-8 w-8"
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              >
                                +
                              </Button>
                            </div>

                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-gray-500"
                              onClick={() => removeItem(item.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                {/* Completed items */}
                {completedItems.length > 0 && (
                  <div className="bg-white rounded-md shadow-sm">
                    <div className="p-4 border-b">
                      <h2 className="text-lg font-medium">Purchased Items ({completedItems.length})</h2>
                    </div>

                    <ul>
                      {completedItems.map((item) => (
                        <li key={item.id} className="p-4 border-b last:border-b-0">
                          <div className="flex items-center gap-3">
                            <Checkbox
                              checked={item.isCompleted}
                              onCheckedChange={() => toggleItemCompletion(item.id)}
                            />

                            {item.image && (
                              <div className="relative h-16 w-16 flex-shrink-0">
                                <Image
                                  src={item.image || "/placeholder.svg"}
                                  alt={item.name}
                                  fill
                                  className="object-contain"
                                />
                              </div>
                            )}

                            <div className="flex-1">
                              <h3 className="font-medium line-through text-gray-500">{item.name}</h3>
                              <p className="text-sm text-gray-400 capitalize">{item.category}</p>

                              {item.price && (
                                <p className="text-sm font-medium mt-1 text-gray-500">₹{item.price.toLocaleString()}</p>
                              )}
                            </div>

                            <div className="text-gray-500">
                              <span>Qty: {item.quantity}</span>
                            </div>

                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-gray-400"
                              onClick={() => removeItem(item.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              <div className="space-y-6">
                {/* Shopping insights */}
                <div className="bg-white rounded-md shadow-sm p-4">
                  <h2 className="text-lg font-medium mb-4">Shopping Insights</h2>

                  <div className="space-y-4">
                    <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-md">
                      <Sparkles className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <h3 className="text-sm font-medium text-blue-800">AI Recommendation</h3>
                        <p className="text-sm text-blue-700">
                          Based on your shopping list, we recommend adding milk and bread to complete your breakfast
                          essentials.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 p-3 bg-green-50 rounded-md">
                      <DollarSign className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <h3 className="text-sm font-medium text-green-800">Savings Opportunity</h3>
                        <p className="text-sm text-green-700">Buy in bulk to save 15% on your grocery items.</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 p-3 bg-yellow-50 rounded-md">
                      <AlertCircle className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <h3 className="text-sm font-medium text-yellow-800">Shopping Reminder</h3>
                        <p className="text-sm text-yellow-700">
                          You usually buy coffee every two weeks. It's been 12 days since your last purchase.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Product recommendations */}
                <div className="bg-white rounded-md shadow-sm p-4">
                  <h2 className="text-lg font-medium mb-4">Recommended for Your List</h2>

                  <div className="space-y-3">
                    {recommendations.map((product) => (
                      <Link
                        key={product.id}
                        href={`/products/${product.id}`}
                        className="flex items-center gap-3 p-3 border rounded-md hover:bg-gray-50"
                      >
                        <div className="relative h-16 w-16 flex-shrink-0">
                          <Image
                            src={product.image || "/placeholder.svg"}
                            alt={product.name}
                            fill
                            className="object-contain"
                          />
                        </div>

                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium text-sm truncate">{product.name}</h3>
                          <p className="text-sm text-gray-500">₹{product.price.toLocaleString()}</p>
                        </div>

                        <div className="bg-green-600 text-white text-xs font-bold rounded-full h-6 w-6 flex items-center justify-center">
                          {product.matchScore}%
                        </div>
                      </Link>
                    ))}
                  </div>

                  <Button className="w-full mt-4" variant="outline">
                    View More Recommendations
                  </Button>
                </div>

                {/* Quick actions */}
                <div className="bg-white rounded-md shadow-sm p-4">
                  <h2 className="text-lg font-medium mb-4">Quick Actions</h2>

                  <div className="space-y-2">
                    <Button className="w-full justify-between" variant="outline">
                      <span className="flex items-center">
                        <ShoppingCart className="h-4 w-4 mr-2" /> Add all to cart
                      </span>
                      <ArrowRight className="h-4 w-4" />
                    </Button>

                    <Button className="w-full justify-between" variant="outline">
                      <span className="flex items-center">
                        <Sparkles className="h-4 w-4 mr-2" /> Optimize my list
                      </span>
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
      <ChatAssistant />
    </main>
  )
}
