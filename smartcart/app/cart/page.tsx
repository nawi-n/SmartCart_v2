"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Minus, Plus, Trash2 } from "lucide-react"
import { getMockCart } from "@/lib/mock-data"

export default function CartPage() {
  const [cart, setCart] = useState(getMockCart())

  const updateQuantity = (id: string, newQuantity: number) => {
    if (newQuantity < 1) return

    setCart(cart.map((item) => (item.id === id ? { ...item, quantity: newQuantity } : item)))
  }

  const removeItem = (id: string) => {
    setCart(cart.filter((item) => item.id !== id))
  }

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const discount = subtotal * 0.1 // 10% discount
  const deliveryFee = subtotal > 500 ? 0 : 40
  const total = subtotal - discount + deliveryFee

  return (
    <main className="min-h-screen flex flex-col bg-gray-100">
      <Navbar />
      <div className="flex-1 container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-md shadow-sm">
              <div className="p-4 border-b">
                <h2 className="text-xl font-medium">My Cart ({cart.length})</h2>
              </div>

              {cart.length === 0 ? (
                <div className="p-8 text-center">
                  <Image
                    src="/placeholder.svg?height=200&width=200"
                    alt="Empty cart"
                    width={200}
                    height={200}
                    className="mx-auto mb-4"
                  />
                  <h3 className="text-lg font-medium mb-2">Your cart is empty!</h3>
                  <p className="text-gray-500 mb-4">Add items to it now.</p>
                  <Button asChild>
                    <Link href="/">Shop now</Link>
                  </Button>
                </div>
              ) : (
                <div>
                  {cart.map((item) => (
                    <div key={item.id} className="p-4 border-b flex flex-col sm:flex-row gap-4">
                      <div className="flex-shrink-0">
                        <div className="relative h-24 w-24">
                          <Image
                            src={item.image || "/placeholder.svg"}
                            alt={item.name}
                            fill
                            className="object-contain"
                          />
                        </div>
                      </div>

                      <div className="flex-grow">
                        <h3 className="font-medium">{item.name}</h3>
                        <p className="text-sm text-gray-500 mb-2">Seller: RetailNet</p>

                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-lg font-medium">₹{item.price.toLocaleString()}</span>
                          {item.originalPrice && (
                            <>
                              <span className="text-gray-500 line-through text-sm">
                                ₹{item.originalPrice.toLocaleString()}
                              </span>
                              <span className="text-green-600 text-sm">
                                {Math.round((1 - item.price / item.originalPrice) * 100)}% off
                              </span>
                            </>
                          )}
                        </div>

                        <div className="flex items-center gap-4">
                          <div className="flex items-center border rounded-sm">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 rounded-none"
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            >
                              <Minus className="h-3 w-3" />
                            </Button>
                            <span className="w-8 text-center">{item.quantity}</span>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 rounded-none"
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                          </div>

                          <Button
                            variant="ghost"
                            className="text-[#2874f0] hover:bg-transparent hover:text-[#2874f0]/80 p-0"
                          >
                            SAVE FOR LATER
                          </Button>

                          <Button
                            variant="ghost"
                            className="text-[#2874f0] hover:bg-transparent hover:text-[#2874f0]/80 p-0"
                            onClick={() => removeItem(item.id)}
                          >
                            <Trash2 className="h-4 w-4 mr-1" /> REMOVE
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}

                  <div className="p-4 flex justify-end">
                    <Button className="bg-[#fb641b] hover:bg-[#fb641b]/90">PLACE ORDER</Button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Price Details */}
          {cart.length > 0 && (
            <div className="lg:col-span-1">
              <div className="bg-white rounded-md shadow-sm p-4">
                <h2 className="text-lg font-medium pb-4 border-b">PRICE DETAILS</h2>

                <div className="mt-4 space-y-3">
                  <div className="flex justify-between">
                    <span>Price ({cart.length} items)</span>
                    <span>₹{subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Discount</span>
                    <span className="text-green-600">- ₹{discount.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Delivery Charges</span>
                    {deliveryFee === 0 ? <span className="text-green-600">FREE</span> : <span>₹{deliveryFee}</span>}
                  </div>

                  <div className="border-t border-dashed pt-3 font-medium flex justify-between">
                    <span>Total Amount</span>
                    <span>₹{total.toLocaleString()}</span>
                  </div>

                  <p className="text-green-600 font-medium">You will save ₹{discount.toLocaleString()} on this order</p>
                </div>
              </div>

              <div className="mt-4 bg-white rounded-md shadow-sm p-4">
                <h3 className="font-medium mb-2">Have a Coupon?</h3>
                <div className="flex gap-2">
                  <Input placeholder="Enter coupon code" />
                  <Button variant="outline" className="shrink-0">
                    Apply
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </main>
  )
}
