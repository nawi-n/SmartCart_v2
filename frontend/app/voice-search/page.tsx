"use client"

import { useState } from "react"
import { useAuth } from "@/components/auth-provider"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { Loader2, Mic, MicOff, ShoppingCart } from "lucide-react"
import { cn } from "@/lib/utils"

type Product = {
  product_id: string
  name: string
  category: string
  price: number
  match_score: number
  explanation: string
}

export default function VoiceSearchPage() {
  const { user, token } = useAuth()
  const { toast } = useToast()
  const [isListening, setIsListening] = useState(false)
  const [transcript, setTranscript] = useState("")
  const [loading, setLoading] = useState(false)
  const [products, setProducts] = useState<Product[]>([])
  const baseUrl = "http://127.0.0.1:8000"

  const startListening = () => {
    if (!("SpeechRecognition" in window || "webkitSpeechRecognition" in window)) {
      toast({
        title: "Not supported",
        description: "Voice recognition is not supported in your browser",
        variant: "destructive",
      })
      return
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    const recognition = new SpeechRecognition()

    recognition.lang = "en-US"
    recognition.interimResults = false
    recognition.maxAlternatives = 1

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript
      setTranscript(transcript)
      searchProducts(transcript)
    }

    recognition.onerror = (event) => {
      console.error("Speech recognition error", event.error)
      setIsListening(false)
      toast({
        title: "Error",
        description: `Voice recognition error: ${event.error}`,
        variant: "destructive",
      })
    }

    recognition.onend = () => {
      setIsListening(false)
    }

    recognition.start()
    setIsListening(true)
  }

  const searchProducts = async (query: string) => {
    if (!token) return

    try {
      setLoading(true)
      const response = await fetch(`${baseUrl}/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          message: query,
          customer_id: user?.id.toString(),
        }),
      })

      if (response.ok) {
        const data = await response.json()

        // Get recommendations based on the chat response
        const recommendResponse = await fetch(`${baseUrl}/recommend_products`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            customer_id: user?.id.toString(),
            query: query,
          }),
        })

        if (recommendResponse.ok) {
          const recommendData = await recommendResponse.json()
          setProducts(recommendData)
        }

        // Track behavior
        await fetch(`${baseUrl}/submit_behavior`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            customer_id: user?.id.toString(),
            action_type: "voice_search",
            details: { query: query },
          }),
        })
      }
    } catch (error) {
      console.error("Error searching products:", error)
      toast({
        title: "Error",
        description: "Failed to search products",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
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
        <h1 className="text-3xl font-bold tracking-tight">Voice Search</h1>
        <p className="text-muted-foreground">Search for products using your voice</p>
      </div>

      <Card className="w-full">
        <CardHeader>
          <CardTitle>Speak to search</CardTitle>
          <CardDescription>Click the microphone button and speak your query</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center space-y-6">
          <Button
            size="lg"
            className={cn("h-24 w-24 rounded-full", isListening && "bg-destructive hover:bg-destructive/90")}
            onClick={startListening}
            disabled={loading}
          >
            {isListening ? <MicOff className="h-10 w-10" /> : <Mic className="h-10 w-10" />}
          </Button>

          {transcript && (
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-1">You said:</p>
              <p className="text-lg font-medium">"{transcript}"</p>
            </div>
          )}
        </CardContent>
      </Card>

      {loading ? (
        <div className="flex items-center justify-center h-40">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : products.length > 0 ? (
        <div>
          <h2 className="text-xl font-semibold mb-4">Search Results</h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {products.map((product) => (
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
                <CardFooter>
                  <Button className="w-full" onClick={() => addToShoppingList(product.product_id)}>
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    Add to List
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      ) : transcript ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No products found for your query</p>
          <p className="text-sm mt-2">Try a different search term</p>
        </div>
      ) : null}
    </div>
  )
}
