import { Suspense } from "react"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import ProductGrid from "@/components/product-grid"
import CategoryBar from "@/components/category-bar"
import BannerCarousel from "@/components/banner-carousel"
import PersonaSidebar from "@/components/persona-sidebar"
import ChatAssistant from "@/components/chat-assistant"
import { Skeleton } from "@/components/ui/skeleton"

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-1 flex">
        <PersonaSidebar />
        <div className="flex-1">
          <CategoryBar />
          <div className="container mx-auto px-4 py-4">
            <BannerCarousel />
            <h2 className="text-2xl font-bold mt-8 mb-4">Recommended For You</h2>
            <Suspense fallback={<ProductGridSkeleton />}>
              <ProductGrid category="all" showMatchScore={true} />
            </Suspense>

            <h2 className="text-2xl font-bold mt-8 mb-4">Electronics</h2>
            <Suspense fallback={<ProductGridSkeleton />}>
              <ProductGrid category="electronics" limit={4} showMatchScore={true} />
            </Suspense>

            <h2 className="text-2xl font-bold mt-8 mb-4">Fashion</h2>
            <Suspense fallback={<ProductGridSkeleton />}>
              <ProductGrid category="fashion" limit={4} showMatchScore={true} />
            </Suspense>
          </div>
        </div>
      </div>
      <Footer />
      <ChatAssistant />
    </main>
  )
}

function ProductGridSkeleton() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
      {Array(10)
        .fill(0)
        .map((_, i) => (
          <div key={i} className="border rounded-md p-3 h-full flex flex-col">
            <Skeleton className="h-40 w-full rounded-md mb-4" />
            <Skeleton className="h-4 w-3/4 mb-2" />
            <Skeleton className="h-4 w-1/2 mb-2" />
            <Skeleton className="h-4 w-2/3" />
          </div>
        ))}
    </div>
  )
}
