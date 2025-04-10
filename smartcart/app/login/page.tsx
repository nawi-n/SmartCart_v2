"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false)

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false)
      window.location.href = "/"
    }, 1500)
  }

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false)
      window.location.href = "/"
    }, 1500)
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="grid grid-cols-1 md:grid-cols-5 bg-white rounded-md shadow-md overflow-hidden max-w-5xl w-full">
        {/* Left Panel */}
        <div className="md:col-span-2 bg-[#2874f0] p-8 text-white flex flex-col">
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-4">Login</h2>
            <p className="text-sm opacity-90">Get access to your Orders, Wishlist and Recommendations</p>
          </div>
          <div className="mt-auto">
            <Image
              src="/placeholder.svg?height=200&width=200"
              alt="Login illustration"
              width={200}
              height={200}
              className="mx-auto"
            />
          </div>
        </div>

        {/* Right Panel */}
        <div className="md:col-span-3 p-8">
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="register">Register</TabsTrigger>
            </TabsList>

            <TabsContent value="login">
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email or mobile number</Label>
                  <Input id="email" type="text" placeholder="Enter Email/Mobile number" required />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label htmlFor="password">Password</Label>
                    <Link href="/forgot-password" className="text-sm text-[#2874f0]">
                      Forgot?
                    </Link>
                  </div>
                  <Input id="password" type="password" placeholder="Enter Password" required />
                </div>
                <p className="text-xs text-gray-500">
                  By continuing, you agree to Flipkart's Terms of Use and Privacy Policy.
                </p>
                <Button type="submit" className="w-full bg-[#fb641b] hover:bg-[#fb641b]/90" disabled={isLoading}>
                  {isLoading ? "Logging in..." : "Login"}
                </Button>
                <div className="text-center">
                  <span className="text-sm text-gray-500">OR</span>
                </div>
                <Button type="button" variant="outline" className="w-full">
                  Request OTP
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="register">
              <form onSubmit={handleRegister} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="register-mobile">Mobile number</Label>
                  <Input id="register-mobile" type="tel" placeholder="Enter Mobile number" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="register-name">Name</Label>
                  <Input id="register-name" type="text" placeholder="Enter your name" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="register-email">Email</Label>
                  <Input id="register-email" type="email" placeholder="Enter Email" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="register-password">Password</Label>
                  <Input id="register-password" type="password" placeholder="Enter Password" required />
                </div>
                <p className="text-xs text-gray-500">
                  By continuing, you agree to Flipkart's Terms of Use and Privacy Policy.
                </p>
                <Button type="submit" className="w-full bg-[#fb641b] hover:bg-[#fb641b]/90" disabled={isLoading}>
                  {isLoading ? "Creating account..." : "Create Account"}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
