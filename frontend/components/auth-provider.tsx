"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import { useToast } from "@/hooks/use-toast"

type User = {
  id: number
  email: string
  first_name: string
  last_name: string
  is_active: boolean
  preferences: Record<string, any>
  created_at: string
  updated_at: string
  shopping_lists: any[]
  behaviors: any[]
  mood_states: any[]
  personas: any[]
}

type AuthContextType = {
  user: User | null
  token: string | null
  login: (email: string, password: string) => Promise<void>
  register: (data: RegisterData) => Promise<void>
  logout: () => void
  loading: boolean
  fetchUser: () => Promise<void>
}

type RegisterData = {
  email: string
  password: string
  first_name: string
  last_name: string
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const pathname = usePathname()
  const { toast } = useToast()
  const baseUrl = "http://127.0.0.1:8000"

  useEffect(() => {
    // Check if we have a token in localStorage
    const storedToken = localStorage.getItem("token")
    if (storedToken) {
      setToken(storedToken)
      fetchUser()
    } else {
      setLoading(false)
      // If no token and not on auth pages, redirect to login
      if (pathname !== "/login" && pathname !== "/register" && pathname !== "/") {
        router.push("/login")
      }
    }
  }, [pathname])

  const fetchUser = async () => {
    if (!token) return

    try {
      setLoading(true)
      const response = await fetch(`${baseUrl}/users/me/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.ok) {
        const userData = await response.json()
        setUser(userData)

        // Generate persona if not exists, but only after user is set
        if (!userData.personas || userData.personas.length === 0) {
          // Wait a bit to ensure user state is updated
          setTimeout(() => {
            generatePersona()
          }, 100)
        }
      } else {
        // Token might be invalid
        logout()
      }
    } catch (error) {
      console.error("Error fetching user:", error)
      toast({
        title: "Error",
        description: "Failed to fetch user data",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const generatePersona = async () => {
    try {
      // Ensure we have both user and token
      if (!user?.id || !token) {
        console.error("User ID or token not available for persona generation")
        return
      }

      const response = await fetch(`${baseUrl}/users/me/persona`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ user_id: user.id }),
      })

      if (!response.ok) {
        const error = await response.json()
        console.error("Error generating persona:", error)
        toast({
          title: "Error",
          description: "Failed to generate persona",
          variant: "destructive",
        })
        return
      }

      // Refresh user data to get the new persona
      await fetchUser()
      toast({
        title: "Success",
        description: "Persona generated successfully",
      })
    } catch (error) {
      console.error("Error generating persona:", error)
      toast({
        title: "Error",
        description: "Failed to generate persona",
        variant: "destructive",
      })
    }
  }

  const login = async (email: string, password: string) => {
    try {
      // Validate input before making the request
      if (!email || !password) {
        toast({
          title: "Validation Error",
          description: "Both email and password are required",
          variant: "destructive",
        })
        return
      }

      setLoading(true)
      const formData = new URLSearchParams()
      formData.append('username', email)
      formData.append('password', password)

      const response = await fetch(`${baseUrl}/token`, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: formData,
      })

      if (response.ok) {
        const data = await response.json()
        localStorage.setItem("token", data.access_token)
        setToken(data.access_token)
        await fetchUser()
        router.push("/dashboard")
        toast({
          title: "Success",
          description: "Logged in successfully",
        })
      } else {
        const error = await response.json()
        if (Array.isArray(error.detail)) {
          error.detail.forEach((err: any) => {
            toast({
              title: "Validation Error",
              description: `${err.loc?.join(" → ")}: ${err.msg}`,
              variant: "destructive",
            })
          })
        } else {
          toast({
            title: "Login failed",
            description: error.detail || "Invalid credentials",
            variant: "destructive",
          })
        }
      }
    } catch (error) {
      console.error("Login error:", error)
      toast({
        title: "Error",
        description: "An error occurred during login",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const register = async (data: RegisterData) => {
    try {
      setLoading(true)
      const response = await fetch(`${baseUrl}/users/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: "Account created successfully",
        })
        // Auto login after registration
        await login(data.email, data.password)
      } else {
        const error = await response.json()
        if (Array.isArray(error.detail)) {
          error.detail.forEach((err: any) => {
            toast({
              title: "Validation Error",
              description: `${err.loc?.join(" → ")}: ${err.msg}`,
              variant: "destructive",
            })
          })
        } else {
          toast({
            title: "Registration failed",
            description: error.detail || "Could not create account",
            variant: "destructive",
          })
        }
      }
    } catch (error) {
      console.error("Registration error:", error)
      toast({
        title: "Error",
        description: "An error occurred during registration",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const logout = () => {
    localStorage.removeItem("token")
    setToken(null)
    setUser(null)
    router.push("/login")
    toast({
      title: "Logged out",
      description: "You have been logged out successfully",
    })
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        login,
        register,
        logout,
        loading,
        fetchUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
