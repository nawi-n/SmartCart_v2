import { getMockProducts } from "@/lib/mock-data"
import ProductGrid from "@/components/product-grid"

interface RelatedProductsProps {
  category: string
  currentProductId: string
  showMatchScore?: boolean
}

export default function RelatedProducts({ category, currentProductId, showMatchScore = false }: RelatedProductsProps) {
  // Get products from the same category, excluding the current product
  const products = getMockProducts(category, 5).filter((product) => product.id !== currentProductId)

  if (products.length === 0) {
    return null
  }

  return <ProductGrid category={category} limit={5} showMatchScore={showMatchScore} />
}
