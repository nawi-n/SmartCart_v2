import { Suspense } from "react"
import { notFound } from "next/navigation"
import Image from "next/image"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { ShoppingCart, Star, Info } from "lucide-react"
import RelatedProducts from "@/components/related-products"
import PersonaSidebar from "@/components/persona-sidebar"
import ChatAssistant from "@/components/chat-assistant"
import { getMockProduct } from "@/lib/mock-data"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

export default function ProductPage({ params }: { params: { id: string } }) {
  const product = getMockProduct(params.id)

  if (!product) {
    notFound()
  }

  // Generate a random match score for demo
  const matchScore = Math.floor(Math.random() * 31) + 70

  // AI-generated story for the product
  const aiStory = `This ${product.name} represents the perfect blend of innovation and practicality. Crafted with meticulous attention to detail, it embodies the quality you've come to expect from ${product.brand}. The sleek design not only complements your aesthetic preferences but also aligns with your practical needs. Based on your persona traits, this product scores a ${matchScore}% match with your preferences for quality, functionality, and style.`

  return (
    <main className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-1 flex">
        <PersonaSidebar />
        <div className="flex-1">
          <div className="container mx-auto px-4 py-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Product Images */}
              <div className="sticky top-24 h-fit">
                <div className="border rounded-md p-4 bg-white">
                  <div className="relative h-80 w-full mb-4">
                    <Image
                      src={product.image || "/placeholder.svg"}
                      alt={product.name}
                      fill
                      className="object-contain"
                    />
                  </div>
                  <div className="flex gap-4">
                    <Button className="flex-1 bg-[#ff9f00] hover:bg-[#ff9f00]/90">
                      <ShoppingCart className="mr-2 h-4 w-4" /> Add to Cart
                    </Button>
                    <Button className="flex-1 bg-[#fb641b] hover:bg-[#fb641b]/90">Buy Now</Button>
                  </div>
                </div>
              </div>

              {/* Product Details */}
              <div>
                <div className="flex items-start justify-between">
                  <h1 className="text-xl md:text-2xl font-medium text-gray-800">{product.name}</h1>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="bg-green-600 text-white text-sm font-bold rounded-full h-10 w-10 flex items-center justify-center flex-shrink-0">
                          {matchScore}%
                        </div>
                      </TooltipTrigger>
                      <TooltipContent side="left">
                        <p className="text-sm">Match score based on your persona</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>

                <div className="flex items-center gap-2 mt-2">
                  <span className="bg-green-600 text-white px-2 py-0.5 rounded-sm text-sm flex items-center">
                    {product.rating} <Star className="ml-1 h-3 w-3 fill-white" />
                  </span>
                  <span className="text-gray-500 text-sm">{product.reviews} Reviews</span>
                </div>

                <div className="mt-4">
                  <span className="text-3xl font-medium">₹{product.price.toLocaleString()}</span>
                  {product.originalPrice && (
                    <>
                      <span className="text-gray-500 line-through ml-2">₹{product.originalPrice.toLocaleString()}</span>
                      <span className="text-green-600 ml-2">
                        {Math.round((1 - product.price / product.originalPrice) * 100)}% off
                      </span>
                    </>
                  )}
                </div>

                {/* AI Story */}
                <div className="mt-6 bg-blue-50 p-4 rounded-md border border-blue-100">
                  <div className="flex items-start gap-2">
                    <Info className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <h3 className="text-sm font-medium text-blue-800 mb-1">AI-Powered Insight</h3>
                      <p className="text-sm text-blue-700">{aiStory}</p>
                    </div>
                  </div>
                </div>

                <div className="mt-6">
                  <h3 className="text-lg font-medium mb-2">Available Offers</h3>
                  <ul className="space-y-2">
                    <li className="flex items-start">
                      <span className="text-green-600 font-medium mr-2">•</span>
                      <span>Bank Offer: 5% Cashback on Flipkart Axis Bank Card</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-green-600 font-medium mr-2">•</span>
                      <span>Special Price: Get extra ₹1000 off (price inclusive of discount)</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-green-600 font-medium mr-2">•</span>
                      <span>Partner Offer: Sign up for Flipkart Pay Later and get Flipkart Gift Card worth ₹500</span>
                    </li>
                  </ul>
                </div>

                <div className="mt-6">
                  <h3 className="text-lg font-medium mb-2">Specifications</h3>
                  <div className="space-y-4">
                    {product.specifications?.map((spec, index) => (
                      <div key={index}>
                        <h4 className="font-medium text-gray-700">{spec.title}</h4>
                        <ul className="mt-1">
                          {spec.details.map((detail, idx) => (
                            <li key={idx} className="flex py-1 border-b border-gray-100">
                              <span className="text-gray-500 w-1/3">{detail.name}</span>
                              <span className="w-2/3">{detail.value}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-6">
                  <h3 className="text-lg font-medium mb-2">Description</h3>
                  <p className="text-gray-700">{product.description}</p>
                </div>
              </div>
            </div>

            <div className="mt-12">
              <h2 className="text-2xl font-bold mb-4">Similar Products</h2>
              <Suspense fallback={<Skeleton className="h-60 w-full" />}>
                <RelatedProducts category={product.category} currentProductId={params.id} showMatchScore={true} />
              </Suspense>
            </div>
          </div>
        </div>
      </div>
      <Footer />
      <ChatAssistant />
    </main>
  )
}
