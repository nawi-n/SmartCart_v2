"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"

const banners = [
  "/placeholder.svg?height=300&width=1200",
  "/placeholder.svg?height=300&width=1200",
  "/placeholder.svg?height=300&width=1200",
]

export default function BannerCarousel() {
  const [currentSlide, setCurrentSlide] = useState(0)

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev === banners.length - 1 ? 0 : prev + 1))
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? banners.length - 1 : prev - 1))
  }

  useEffect(() => {
    const interval = setInterval(nextSlide, 5000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="relative rounded-md overflow-hidden">
      <div className="relative h-[180px] md:h-[300px] w-full">
        {banners.map((banner, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-500 ${
              index === currentSlide ? "opacity-100" : "opacity-0"
            }`}
          >
            <Image src={banner || "/placeholder.svg"} alt={`Banner ${index + 1}`} fill className="object-cover" />
          </div>
        ))}
      </div>

      <Button
        variant="ghost"
        size="icon"
        className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white/90 text-gray-800 rounded-full h-8 w-8"
        onClick={prevSlide}
      >
        <ChevronLeft className="h-5 w-5" />
      </Button>

      <Button
        variant="ghost"
        size="icon"
        className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white/90 text-gray-800 rounded-full h-8 w-8"
        onClick={nextSlide}
      >
        <ChevronRight className="h-5 w-5" />
      </Button>

      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
        {banners.map((_, index) => (
          <button
            key={index}
            className={`h-1.5 rounded-full transition-all ${
              index === currentSlide ? "w-6 bg-white" : "w-1.5 bg-white/60"
            }`}
            onClick={() => setCurrentSlide(index)}
          />
        ))}
      </div>
    </div>
  )
}
