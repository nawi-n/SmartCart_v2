"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import { authAPI, type User } from "@/lib/api"

interface AuthContextType {
  user: User | null
  isLoading: boolean
  error: string | null
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  register: (userData: { email: string; password: string; first_name: string; last_name: string }) => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem("token")
    if (token) {
      fetchUser()
    } else {
      setIsLoading(false)
    }
  }, [])

  const fetchUser = async () => {
    try {
      setIsLoading(true)
      const userData = await authAPI.getCurrentUser()
      setUser(userData)
      localStorage.setItem("userId", userData.id.toString())
    } catch (err) {
      console.error("Error fetching user:", err)
      setError("Failed to fetch user data")
      // Clear token if it's invalid
      localStorage.removeItem("token")
      localStorage.removeItem("userId")
    } finally {
      setIsLoading(false)
    }
  }

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true)
      const response = await authAPI.login(email, password)
      localStorage.setItem("token", response.access_token)
      await fetchUser()
    } catch (err) {
      console.error("Login error:", err)
      setError("Failed to login")
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  const logout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("userId")
    setUser(null)
  }

  const register = async (userData: { email: string; password: string; first_name: string; last_name: string }) => {
    try {
      setIsLoading(true)
      const user = await authAPI.register(userData)
      // Don't automatically log in after registration
      return user
    } catch (err) {
      console.error("Registration error:", err)
      setError("Failed to register")
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AuthContext.Provider value={{ user, isLoading, error, login, logout, register }}>{children}</AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
