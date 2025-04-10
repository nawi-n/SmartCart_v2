"use client"

import { useState, useEffect } from "react"
import {
  User,
  Settings,
  ChevronLeft,
  ChevronRight,
  Smile,
  Frown,
  Meh,
  Heart,
  ThumbsUp,
  ThumbsDown,
  Zap,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

// Mock persona data
const mockPersona = {
  name: "Tech Enthusiast",
  traits: [
    { name: "Tech-savvy", value: 85 },
    { name: "Budget-conscious", value: 60 },
    { name: "Brand-loyal", value: 70 },
    { name: "Eco-friendly", value: 45 },
    { name: "Trend-follower", value: 75 },
  ],
  description:
    "You're a tech enthusiast who values innovation and quality. You prefer products with good reviews and are willing to pay more for premium features.",
}

const moods = [
  { emoji: "😊", name: "Happy", icon: Smile },
  { emoji: "😐", name: "Neutral", icon: Meh },
  { emoji: "😞", name: "Sad", icon: Frown },
  { emoji: "❤️", name: "Loving", icon: Heart },
  { emoji: "👍", name: "Satisfied", icon: ThumbsUp },
  { emoji: "👎", name: "Dissatisfied", icon: ThumbsDown },
  { emoji: "⚡", name: "Energetic", icon: Zap },
]

export default function PersonaSidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [selectedMood, setSelectedMood] = useState<number | null>(0)
  const [persona, setPersona] = useState(mockPersona)

  // Simulate fetching persona data
  useEffect(() => {
    // In a real app, this would be an API call
    const timer = setTimeout(() => {
      setPersona(mockPersona)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  return (
    <div className={`bg-white border-r transition-all duration-300 relative ${isCollapsed ? "w-16" : "w-64"}`}>
      <Button
        variant="ghost"
        size="icon"
        className="absolute -right-3 top-4 h-6 w-6 rounded-full border bg-white z-10"
        onClick={() => setIsCollapsed(!isCollapsed)}
      >
        {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
      </Button>

      <div className="p-4">
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-blue-100 text-blue-600 h-10 w-10 rounded-full flex items-center justify-center flex-shrink-0">
            <User className="h-5 w-5" />
          </div>
          <div className={`transition-opacity duration-300 ${isCollapsed ? "opacity-0" : "opacity-100"}`}>
            <h3 className="font-medium">Your Persona</h3>
            <p className="text-xs text-gray-500">AI-generated profile</p>
          </div>
        </div>

        {!isCollapsed && (
          <>
            <div className="mb-6">
              <h4 className="text-sm font-medium mb-2">{persona.name}</h4>
              <p className="text-xs text-gray-600">{persona.description}</p>
            </div>

            <div className="mb-6">
              <h4 className="text-sm font-medium mb-2">Your Traits</h4>
              <div className="space-y-3">
                {persona.traits.map((trait) => (
                  <div key={trait.name}>
                    <div className="flex justify-between text-xs mb-1">
                      <span>{trait.name}</span>
                      <span>{trait.value}%</span>
                    </div>
                    <Progress value={trait.value} className="h-1.5" />
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        <div>
          <h4 className={`text-sm font-medium mb-2 ${isCollapsed ? "sr-only" : ""}`}>Your Mood</h4>
          <div className={`grid gap-2 ${isCollapsed ? "grid-cols-1" : "grid-cols-4"}`}>
            {moods.map((mood, index) => (
              <TooltipProvider key={mood.name}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant={selectedMood === index ? "default" : "outline"}
                      size="icon"
                      className={`h-10 w-10 ${selectedMood === index ? "bg-blue-600" : ""}`}
                      onClick={() => setSelectedMood(index)}
                    >
                      {isCollapsed ? <mood.icon className="h-5 w-5" /> : <span className="text-lg">{mood.emoji}</span>}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="right">
                    <p>{mood.name}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            ))}
          </div>
        </div>

        {!isCollapsed && (
          <div className="mt-6">
            <Button variant="outline" size="sm" className="w-full text-xs" onClick={() => {}}>
              <Settings className="h-3.5 w-3.5 mr-1" />
              Customize Persona
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
