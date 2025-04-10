import Link from "next/link"
import Image from "next/image"
import { getMockProducts } from "@/lib/mock-data"
import { Star, Info } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface ProductGridProps {
  category?: string
  limit?: number
  showMatchScore?: boolean
}

export default function ProductGrid({ category = "all", limit, showMatchScore = false }: ProductGridProps) {
  const products = getMockProducts(category, limit)

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
      {products.map((product) => (
        <Link
          key={product.id}
          href={`/products/${product.id}`}
          className="border rounded-md p-3 bg-white hover:shadow-md transition-shadow flex flex-col h-full relative"
        >
          {showMatchScore && (
            <div className="absolute top-2 right-2 z-10">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="bg-green-600 text-white text-xs font-bold rounded-full h-8 w-8 flex items-center justify-center">
                      {product.matchScore || Math.floor(Math.random() * 31) + 70}%
                    </div>
                  </TooltipTrigger>
                  <TooltipContent side="left">
                    <p className="text-sm">Match score based on your persona</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          )}

          <div className="relative h-40 mb-3">
            <Image src={product.image || "/placeholder.svg"} alt={product.name} fill className="object-contain" />
          </div>

          <h3 className="font-medium text-sm line-clamp-2 mb-1">{product.name}</h3>

          <div className="flex items-center gap-1 mb-1">
            <span className="bg-green-600 text-white px-1.5 py-0.5 rounded-sm text-xs flex items-center">
              {product.rating} <Star className="ml-0.5 h-2.5 w-2.5 fill-white" />
            </span>
            <span className="text-gray-500 text-xs">({product.reviews})</span>
          </div>

          <div className="mt-auto">
            <div className="flex items-center gap-2">
              <span className="font-medium">₹{product.price.toLocaleString()}</span>
              {product.originalPrice && (
                <>
                  <span className="text-gray-500 line-through text-xs">₹{product.originalPrice.toLocaleString()}</span>
                  <span className="text-green-600 text-xs">
                    {Math.round((1 - product.price / product.originalPrice) * 100)}% off
                  </span>
                </>
              )}
            </div>

            {showMatchScore && (
              <div className="mt-2 flex items-start gap-1">
                <Info className="h-3.5 w-3.5 text-blue-500 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-gray-600 line-clamp-2">
                  {product.aiReason || "This product matches your preferences for quality and style."}
                </p>
              </div>
            )}
          </div>
        </Link>
      ))}
    </div>
  )
}
