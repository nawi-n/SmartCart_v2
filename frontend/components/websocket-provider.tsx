"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"
import { useAuth } from "@/components/auth-provider"
import { useToast } from "@/hooks/use-toast"

type WebSocketMessage = {
  message: string
  type: "info" | "success" | "warning" | "error"
  timestamp: string
}

type WebSocketContextType = {
  messages: WebSocketMessage[]
  connected: boolean
}

const WebSocketContext = createContext<WebSocketContextType | undefined>(undefined)

export function WebSocketProvider({ children }: { children: React.ReactNode }) {
  const { token } = useAuth()
  const { toast } = useToast()
  const [socket, setSocket] = useState<WebSocket | null>(null)
  const [connected, setConnected] = useState(false)
  const [messages, setMessages] = useState<WebSocketMessage[]>([])
  const baseUrl = "ws://127.0.0.1:8000"

  useEffect(() => {
    if (!token) return

    // Initialize WebSocket connection
    const ws = new WebSocket(`${baseUrl}/ws/updates`)

    ws.onopen = () => {
      console.log("WebSocket connected")
      setConnected(true)
    }

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data) as WebSocketMessage
        setMessages((prev) => [...prev, data])

        // Show toast notification for new messages
        toast({
          title: data.type.charAt(0).toUpperCase() + data.type.slice(1),
          description: data.message,
          variant: data.type === "error" ? "destructive" : "default",
        })
      } catch (error) {
        console.error("Error parsing WebSocket message:", error)
      }
    }

    ws.onerror = (error) => {
      console.error("WebSocket error:", error)
      setConnected(false)
    }

    ws.onclose = () => {
      console.log("WebSocket disconnected")
      setConnected(false)
    }

    setSocket(ws)

    // Cleanup on unmount
    return () => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.close()
      }
    }
  }, [token])

  return (
    <WebSocketContext.Provider
      value={{
        messages,
        connected,
      }}
    >
      {children}
    </WebSocketContext.Provider>
  )
}

export const useWebSocket = () => {
  const context = useContext(WebSocketContext)
  if (context === undefined) {
    throw new Error("useWebSocket must be used within a WebSocketProvider")
  }
  return context
}
