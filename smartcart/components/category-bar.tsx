import Link from "next/link"
import Image from "next/image"

const categories = [
  { name: "Grocery", icon: "/placeholder.svg?height=40&width=40" },
  { name: "Mobiles", icon: "/placeholder.svg?height=40&width=40" },
  { name: "Fashion", icon: "/placeholder.svg?height=40&width=40" },
  { name: "Electronics", icon: "/placeholder.svg?height=40&width=40" },
  { name: "Home", icon: "/placeholder.svg?height=40&width=40" },
  { name: "Appliances", icon: "/placeholder.svg?height=40&width=40" },
  { name: "Travel", icon: "/placeholder.svg?height=40&width=40" },
  { name: "Beauty, Toys & More", icon: "/placeholder.svg?height=40&width=40" },
]

export default function CategoryBar() {
  return (
    <div className="bg-white shadow-sm">
      <div className="container mx-auto px-4 py-2">
        <div className="flex items-center justify-between overflow-x-auto hide-scrollbar">
          {categories.map((category) => (
            <Link
              key={category.name}
              href={`/category/${category.name.toLowerCase().replace(/,|\s+/g, "-")}`}
              className="flex flex-col items-center min-w-[80px] p-2 hover:text-[#2874f0]"
            >
              <div className="relative h-16 w-16 mb-1">
                <Image src={category.icon || "/placeholder.svg"} alt={category.name} fill className="object-contain" />
              </div>
              <span className="text-xs text-center font-medium">{category.name}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
