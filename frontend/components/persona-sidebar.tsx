"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/components/auth-provider"
import { useSidebar } from "@/components/sidebar-provider"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { cn } from "@/lib/utils"
import { X } from "lucide-react"

const moodOptions = [
  { emoji: "😊", label: "Happy", value: "happy" },
  { emoji: "😔", label: "Sad", value: "sad" },
  { emoji: "😡", label: "Angry", value: "angry" },
  { emoji: "😌", label: "Relaxed", value: "relaxed" },
  { emoji: "🤔", label: "Curious", value: "curious" },
  { emoji: "😴", label: "Tired", value: "tired" },
  { emoji: "🥳", label: "Excited", value: "excited" },
  { emoji: "😎", label: "Cool", value: "cool" },
]

export function PersonaSidebar() {
  const { user, token, fetchUser } = useAuth()
  const { isSidebarOpen, closeSidebar } = useSidebar()
  const { toast } = useToast()
  const [currentMood, setCurrentMood] = useState<string | null>(null)
  const [moodIntensity, setMoodIntensity] = useState<number>(0.5)
  const baseUrl = "http://127.0.0.1:8000"

  useEffect(() => {
    if (user?.mood_states && user.mood_states.length > 0) {
      const latestMood = user.mood_states[user.mood_states.length - 1]
      setCurrentMood(latestMood.mood)
      setMoodIntensity(latestMood.intensity)
    }
  }, [user])

  const updateMood = async (mood: string) => {
    if (!token) return

    try {
      const response = await fetch(`${baseUrl}/mood/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          mood,
          intensity: moodIntensity,
          context: {
            source: "mood_selector",
            description: "User selected mood",
          },
        }),
      })

      if (response.ok) {
        setCurrentMood(mood)
        toast({
          title: "Mood updated",
          description: `Your mood has been updated to ${mood}`,
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
            action_type: "mood_update",
            details: { mood, intensity: moodIntensity },
          }),
        })

        // Refresh user data
        fetchUser()
      }
    } catch (error) {
      console.error("Error updating mood:", error)
      toast({
        title: "Error",
        description: "Failed to update mood",
        variant: "destructive",
      })
    }
  }

  const getPersonaTraits = () => {
    if (!user?.personas || user.personas.length === 0) {
      return []
    }

    const latestPersona = user.personas[user.personas.length - 1]
    const traits = latestPersona.traits || {}

    return Object.entries(traits).map(([key, value]) => ({
      trait: key,
      value: value as string,
    }))
  }

  return (
    <div
      className={cn(
        "fixed inset-y-0 left-0 z-50 w-full max-w-xs border-r bg-background transition-transform duration-300 ease-in-out lg:translate-x-0",
        isSidebarOpen ? "translate-x-0" : "-translate-x-full",
      )}
    >
      <div className="flex h-16 items-center justify-between border-b px-4">
        <h2 className="text-lg font-semibold">Your Profile</h2>
        <Button variant="ghost" size="icon" className="lg:hidden" onClick={closeSidebar}>
          <X className="h-5 w-5" />
          <span className="sr-only">Close sidebar</span>
        </Button>
      </div>
      <div className="flex-1 overflow-auto py-4 px-4 space-y-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Current Mood</CardTitle>
            <CardDescription>How are you feeling today?</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-4 gap-2">
              {moodOptions.map((mood) => (
                <Button
                  key={mood.value}
                  variant={currentMood === mood.value ? "default" : "outline"}
                  className="h-12 p-0 flex flex-col"
                  onClick={() => updateMood(mood.value)}
                >
                  <span className="text-xl">{mood.emoji}</span>
                  <span className="text-xs mt-1">{mood.label}</span>
                </Button>
              ))}
            </div>
            {currentMood && (
              <div className="mt-4">
                <p className="text-sm text-muted-foreground mb-2">Intensity</p>
                <input
                  type="range"
                  min="0.1"
                  max="1"
                  step="0.1"
                  value={moodIntensity}
                  onChange={(e) => setMoodIntensity(Number.parseFloat(e.target.value))}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Mild</span>
                  <span>Strong</span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <div>
          <h3 className="text-lg font-medium mb-2">Your Persona</h3>
          <div className="space-y-2">
            {getPersonaTraits().length > 0 ? (
              getPersonaTraits().map((trait, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-sm capitalize">{trait.trait.replace("_", " ")}</span>
                  <Badge variant="outline">{trait.value}</Badge>
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">Your persona is being generated...</p>
            )}
          </div>
        </div>

        <Separator />

        <div>
          <h3 className="text-lg font-medium mb-2">Shopping Style</h3>
          <div className="space-y-2">
            {user?.personas && user.personas.length > 0 && user.personas[0].shopping_style ? (
              Object.entries(user.personas[0].shopping_style).map(([key, value], index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-sm capitalize">{key.replace("_", " ")}</span>
                  <Badge variant="outline">{value as string}</Badge>
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">Your shopping style is being analyzed...</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
