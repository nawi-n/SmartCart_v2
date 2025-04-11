import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-40 border-b bg-background">
        <div className="container flex h-16 items-center justify-between py-4">
          <div className="flex items-center gap-2 font-bold text-xl">
            <span className="text-primary">Smart</span>
            <span>Cart</span>
          </div>
          <div className="flex items-center gap-2">
            <Link href="/login">
              <Button variant="ghost">Login</Button>
            </Link>
            <Link href="/register">
              <Button>Sign Up</Button>
            </Link>
          </div>
        </div>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl">Shopping that understands you</h1>
                  <p className="max-w-[600px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                    SmartCart uses AI to personalize your shopping experience based on your mood, preferences, and
                    shopping history.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Link href="/register">
                    <Button size="lg" className="gap-1">
                      Start Shopping <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                  <Link href="/login">
                    <Button size="lg" variant="outline">
                      Login
                    </Button>
                  </Link>
                </div>
              </div>
              <div className="flex items-center justify-center">
                <div className="relative h-[350px] w-[350px] rounded-lg bg-gradient-to-br from-primary/20 to-primary/5 p-4 flex items-center justify-center">
                  <div className="text-center space-y-4">
                    <div className="mx-auto w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center">
                      <span className="text-2xl">🛒</span>
                    </div>
                    <h3 className="text-xl font-semibold">Personalized Shopping</h3>
                    <p className="text-sm text-gray-500">
                      Products recommended based on your unique preferences and mood
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-50">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">Key Features</h2>
                <p className="max-w-[600px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Discover how SmartCart enhances your shopping experience
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
                <div className="flex flex-col items-center space-y-2 border rounded-lg p-6 bg-white">
                  <div className="p-2 bg-primary/10 rounded-full">
                    <span className="text-2xl">🧠</span>
                  </div>
                  <h3 className="text-xl font-bold">Mood-Based Shopping</h3>
                  <p className="text-gray-500 text-sm text-center">
                    Get recommendations that match your current mood and emotional state
                  </p>
                </div>
                <div className="flex flex-col items-center space-y-2 border rounded-lg p-6 bg-white">
                  <div className="p-2 bg-primary/10 rounded-full">
                    <span className="text-2xl">💬</span>
                  </div>
                  <h3 className="text-xl font-bold">AI Shopping Assistant</h3>
                  <p className="text-gray-500 text-sm text-center">
                    Chat with our AI to get personalized product recommendations
                  </p>
                </div>
                <div className="flex flex-col items-center space-y-2 border rounded-lg p-6 bg-white">
                  <div className="p-2 bg-primary/10 rounded-full">
                    <span className="text-2xl">📊</span>
                  </div>
                  <h3 className="text-xl font-bold">Shopping Analytics</h3>
                  <p className="text-gray-500 text-sm text-center">
                    Gain insights into your shopping patterns and preferences
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="border-t py-6 md:py-0">
        <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
          <p className="text-sm text-gray-500">© 2025 SmartCart. All rights reserved.</p>
          <div className="flex gap-4">
            <Link href="/terms" className="text-sm text-gray-500 hover:underline">
              Terms
            </Link>
            <Link href="/privacy" className="text-sm text-gray-500 hover:underline">
              Privacy
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
