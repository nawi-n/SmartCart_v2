"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { useAuth } from "@/components/auth-provider"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { Loader2, ArrowLeft } from "lucide-react"
import { BarChart, LineChart, PieChart } from "@/components/ui/chart"

type ShoppingListAnalysis = {
  shopping_patterns: {
    dates: string[]
    frequencies: number[]
  }
  mood_trends: {
    dates: string[]
    intensities: number[]
  }
  category_distribution: {
    categories: string[]
    counts: number[]
  }
  recommendations: any[]
}

export default function ShoppingListAnalysisPage() {
  const params = useParams()
  const router = useRouter()
  const { token } = useAuth()
  const { toast } = useToast()
  const [loading, setLoading] = useState(true)
  const [analysis, setAnalysis] = useState<ShoppingListAnalysis | null>(null)
  const [listName, setListName] = useState<string>("")
  const baseUrl = "http://127.0.0.1:8000"
  const listId = params.id

  useEffect(() => {
    if (token && listId) {
      fetchListDetails()
      fetchAnalysis()
    }
  }, [token, listId])

  const fetchListDetails = async () => {
    try {
      const response = await fetch(`${baseUrl}/shopping-lists/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.ok) {
        const lists = await response.json()
        const currentList = lists.find((l: any) => l.id.toString() === listId)

        if (currentList) {
          setListName(currentList.name)
        }
      }
    } catch (error) {
      console.error("Error fetching list details:", error)
    }
  }

  const fetchAnalysis = async () => {
    try {
      setLoading(true)
      const response = await fetch(`${baseUrl}/shopping-lists/${listId}/analysis`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.ok) {
        const data = await response.json()
        setAnalysis(data)
      } else {
        toast({
          title: "Error",
          description: "Failed to fetch analysis data",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error fetching analysis:", error)
      toast({
        title: "Error",
        description: "Failed to fetch analysis data",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const getShoppingPatternsData = () => {
    if (!analysis) return []

    return analysis.shopping_patterns.dates.map((date, index) => ({
      date,
      frequency: analysis.shopping_patterns.frequencies[index],
    }))
  }

  const getMoodTrendsData = () => {
    if (!analysis) return []

    return analysis.mood_trends.dates.map((date, index) => ({
      date,
      intensity: analysis.mood_trends.intensities[index],
    }))
  }

  const getCategoryDistributionData = () => {
    if (!analysis) return []

    return analysis.category_distribution.categories.map((category, index) => ({
      category,
      count: analysis.category_distribution.counts[index],
    }))
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center space-x-2">
        <Button variant="ghost" size="icon" onClick={() => router.push(`/lists/${listId}`)}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{listName} Analysis</h1>
          <p className="text-muted-foreground">Insights and patterns from your shopping list</p>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : analysis ? (
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Shopping Patterns</CardTitle>
              <CardDescription>Frequency of shopping over time</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <LineChart
                  data={getShoppingPatternsData()}
                  index="date"
                  categories={["frequency"]}
                  colors={["#6366f1"]}
                  valueFormatter={(value) => `${value} items`}
                  showLegend={false}
                  showXAxis={true}
                  showYAxis={true}
                  showGridLines={true}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Mood Trends</CardTitle>
              <CardDescription>Your mood intensity over time</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <LineChart
                  data={getMoodTrendsData()}
                  index="date"
                  categories={["intensity"]}
                  colors={["#ec4899"]}
                  valueFormatter={(value) => `${(value * 100).toFixed(0)}%`}
                  showLegend={false}
                  showXAxis={true}
                  showYAxis={true}
                  showGridLines={true}
                />
              </div>
            </CardContent>
          </Card>

          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Category Distribution</CardTitle>
              <CardDescription>Breakdown of product categories in your list</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col md:flex-row items-center justify-center gap-8">
              <div className="w-full md:w-1/2 h-80">
                <PieChart
                  data={getCategoryDistributionData()}
                  index="category"
                  categories={["count"]}
                  colors={["#6366f1", "#ec4899", "#10b981", "#f59e0b", "#ef4444"]}
                  valueFormatter={(value) => `${value} items`}
                  showLegend={true}
                  showAnimation={true}
                />
              </div>
              <div className="w-full md:w-1/2 h-80">
                <BarChart
                  data={getCategoryDistributionData()}
                  index="category"
                  categories={["count"]}
                  colors={["#6366f1"]}
                  valueFormatter={(value) => `${value} items`}
                  showLegend={false}
                  showXAxis={true}
                  showYAxis={true}
                  showGridLines={true}
                  layout="vertical"
                />
              </div>
            </CardContent>
          </Card>

          {analysis.recommendations && analysis.recommendations.length > 0 && (
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Recommended Products</CardTitle>
                <CardDescription>Based on your shopping patterns and preferences</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-3">
                  {analysis.recommendations.map((recommendation, index) => (
                    <Card key={index} className="overflow-hidden">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base">{recommendation.product.name}</CardTitle>
                        <CardDescription>${recommendation.product.price.toFixed(2)}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">Match</span>
                          <span className="text-sm font-medium">{Math.round(recommendation.score * 100)}%</span>
                        </div>
                        <div className="w-full bg-secondary h-2 rounded-full overflow-hidden mt-1">
                          <div className="bg-primary h-full" style={{ width: `${recommendation.score * 100}%` }} />
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-muted-foreground mb-4">No analysis data available for this shopping list</p>
          <Button onClick={fetchAnalysis}>Refresh</Button>
        </div>
      )}
    </div>
  )
}
