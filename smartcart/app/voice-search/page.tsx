"use client"

import { useState, useEffect } from "react"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import PersonaSidebar from "@/components/persona-sidebar"
import ChatAssistant from "@/components/chat-assistant"
import ProductGrid from "@/components/product-grid"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Mic, MicOff, Search } from "lucide-react"

export default function VoiceSearchPage() {
  const [isListening, setIsListening] = useState(false)
  const [transcript, setTranscript] = useState("")
  const [searchQuery, setSearchQuery] = useState("")
  const [hasSearched, setHasSearched] = useState(false)

  const toggleListening = () => {
    if (isListening) {
      setIsListening(false)
    } else {
      setIsListening(true)
      // Simulate voice recognition
      setTimeout(() => {
        const demoQueries = [
          "show me smartphones under 20000",
          "find me wireless headphones with noise cancellation",
          "I need a laptop for gaming",
          "show me running shoes",
        ]
        const randomQuery = demoQueries[Math.floor(Math.random() * demoQueries.length)]
        setTranscript(randomQuery)
        setIsListening(false)
      }, 2000)
    }
  }

  const handleSearch = () => {
    setSearchQuery(transcript || "")
    setHasSearched(true)
  }

  useEffect(() => {
    if (transcript) {
      handleSearch()
    }
  }, [transcript])

  return (
    <main className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-1 flex">
        <PersonaSidebar />
        <div className="flex-1">
          <div className="container mx-auto px-4 py-8">
            <h1 className="text-2xl font-bold mb-6">Voice Search</h1>

            <div className="max-w-2xl mx-auto mb-8">
              <div className="flex gap-2">
                <Input
                  type="text"
                  placeholder="Search by voice or type..."
                  value={transcript}
                  onChange={(e) => setTranscript(e.target.value)}
                  className="flex-1"
                />
                <Button variant={isListening ? "destructive" : "default"} size="icon" onClick={toggleListening}>
                  {isListening ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
                </Button>
                <Button onClick={handleSearch}>
                  <Search className="h-5 w-5 mr-2" /> Search
                </Button>
              </div>

              {isListening && (
                <div className="mt-4 text-center">
                  <div className="inline-flex items-center px-4 py-2 bg-blue-50 text-blue-700 rounded-full">
                    <span className="relative flex h-3 w-3 mr-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-blue-500"></span>
                    </span>
                    Listening...
                  </div>
                </div>
              )}
            </div>

            {hasSearched && (
              <div>
                <h2 className="text-xl font-medium mb-4">Search results for "{searchQuery}"</h2>
                <ProductGrid showMatchScore={true} />
              </div>
            )}

            {!hasSearched && (
              <div className="text-center py-12">
                <div className="mb-6">
                  <Mic className="h-16 w-16 mx-auto text-blue-500 mb-4" />
                  <h3 className="text-lg font-medium mb-2">Speak to search</h3>
                  <p className="text-gray-600 max-w-md mx-auto">
                    Click the microphone button and speak your search query. Our AI will understand what you're looking
                    for.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
                  <div className="border rounded-lg p-6 bg-white shadow-sm">
                    <h3 className="font-medium mb-2">Popular voice searches</h3>
                    <ul className="space-y-2 text-sm text-gray-600">
                      <li>"Show me smartphones under 20000"</li>
                      <li>"Find wireless headphones"</li>
                      <li>"I need a laptop for gaming"</li>
                      <li>"Show running shoes"</li>
                    </ul>
                  </div>

                  <div className="border rounded-lg p-6 bg-white shadow-sm">
                    <h3 className="font-medium mb-2">Search by category</h3>
                    <ul className="space-y-2 text-sm text-gray-600">
                      <li>"Show me electronics"</li>
                      <li>"Find fashion items"</li>
                      <li>"Show home appliances"</li>
                      <li>"Beauty products"</li>
                    </ul>
                  </div>

                  <div className="border rounded-lg p-6 bg-white shadow-sm">
                    <h3 className="font-medium mb-2">Search by features</h3>
                    <ul className="space-y-2 text-sm text-gray-600">
                      <li>"Products with high ratings"</li>
                      <li>"Items with free delivery"</li>
                      <li>"Products that match my persona"</li>
                      <li>"Best deals today"</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
      <ChatAssistant />
    </main>
  )
}
