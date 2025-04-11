"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/components/auth-provider"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import { Loader2 } from "lucide-react"
import { BarChart, LineChart, PieChart } from "@/components/ui/chart"

type ShoppingPatterns = {
  dates: string[]
  frequencies: number[]
}

type MoodTrends = {
  dates: string[]
  intensities: number[]
}

type CategoryDistribution = {
  categories: string[]
  counts: number[]
}

type RecommendationPerformance = {
  products: string[]
  scores: number[]
}

export default function AnalyticsPage() {
  const { token } = useAuth()
  const { toast } = useToast()
  const [loading, setLoading] = useState(true)
  const [shoppingPatterns, setShoppingPatterns] = useState<ShoppingPatterns>({ dates: [], frequencies: [] })
  const [moodTrends, setMoodTrends] = useState<MoodTrends>({ dates: [], intensities: [] })
  const [categoryDistribution, setCategoryDistribution] = useState<CategoryDistribution>({ categories: [], counts: [] })
  const [recommendationPerformance, setRecommendationPerformance] = useState<RecommendationPerformance>({ products: [], scores: [] })
  const baseUrl = "http://127.0.0.1:8000"

  useEffect(() => {
    if (token) {
      fetchAnalytics()
    }
  }, [token])

  const fetchAnalytics = async () => {
    try {
      setLoading(true)

      // Fetch shopping patterns
      const patternsResponse = await fetch(`${baseUrl}/analytics/shopping-patterns`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (patternsResponse.ok) {
        const patternsData = await patternsResponse.json()
        setShoppingPatterns(patternsData || { dates: [], frequencies: [] })
      }

      // Fetch mood trends
      const moodResponse = await fetch(`${baseUrl}/analytics/mood-trends`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (moodResponse.ok) {
        const moodData = await moodResponse.json()
        setMoodTrends(moodData || { dates: [], intensities: [] })
      }

      // Fetch category distribution
      const categoryResponse = await fetch(`${baseUrl}/analytics/categories`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (categoryResponse.ok) {
        const categoryData = await categoryResponse.json()
        setCategoryDistribution(categoryData || { categories: [], counts: [] })
      }

      // Fetch recommendation performance
      const recommendationResponse = await fetch(`${baseUrl}/analytics/recommendations`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (recommendationResponse.ok) {
        const recommendationData = await recommendationResponse.json()
        setRecommendationPerformance(recommendationData || { products: [], scores: [] })
      }
    } catch (error) {
      console.error("Error fetching analytics:", error)
      toast({
        title: "Error",
        description: "Failed to fetch analytics data",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const getShoppingPatternsData = () => {
    return shoppingPatterns.dates.map((date, index) => ({
      date,
      frequency: shoppingPatterns.frequencies[index],
    }))
  }

  const getMoodTrendsData = () => {
    return moodTrends.dates.map((date, index) => ({
      date,
      intensity: moodTrends.intensities[index],
    }))
  }

  const getCategoryDistributionData = () => {
    return categoryDistribution.categories.map((category, index) => ({
      category,
      count: categoryDistribution.counts[index],
    }))
  }

  const getRecommendationPerformanceData = () => {
    return recommendationPerformance.products.map((product, index) => ({
      product,
      score: recommendationPerformance.scores[index],
    }))
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
        <p className="text-muted-foreground">Insights into your shopping patterns and preferences</p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <Tabs defaultValue="shopping" className="space-y-6">
          <TabsList className="grid grid-cols-4 w-full">
            <TabsTrigger value="shopping">Shopping Patterns</TabsTrigger>
            <TabsTrigger value="mood">Mood Trends</TabsTrigger>
            <TabsTrigger value="categories">Categories</TabsTrigger>
            <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
          </TabsList>

          <TabsContent value="shopping">
            <Card>
              <CardHeader>
                <CardTitle>Shopping Patterns</CardTitle>
                <CardDescription>Your shopping frequency over time</CardDescription>
              </CardHeader>
              <CardContent>
                {shoppingPatterns && shoppingPatterns.dates.length > 0 ? (
                  <div className="h-96">
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
                ) : (
                  <div className="text-center py-12">
                    <p className="text-muted-foreground">Not enough shopping data to display patterns</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="mood">
            <Card>
              <CardHeader>
                <CardTitle>Mood Trends</CardTitle>
                <CardDescription>Your mood intensity over time</CardDescription>
              </CardHeader>
              <CardContent>
                {moodTrends && moodTrends.dates.length > 0 ? (
                  <div className="h-96">
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
                ) : (
                  <div className="text-center py-12">
                    <p className="text-muted-foreground">Not enough mood data to display trends</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="categories">
            <Card>
              <CardHeader>
                <CardTitle>Category Distribution</CardTitle>
                <CardDescription>Breakdown of product categories in your shopping</CardDescription>
              </CardHeader>
              <CardContent>
                {categoryDistribution && categoryDistribution.categories.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="h-96">
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
                    <div className="h-96">
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
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <p className="text-muted-foreground">Not enough category data to display distribution</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="recommendations">
            <Card>
              <CardHeader>
                <CardTitle>Recommendation Performance</CardTitle>
                <CardDescription>How well our recommendations match your preferences</CardDescription>
              </CardHeader>
              <CardContent>
                {recommendationPerformance && recommendationPerformance.products.length > 0 ? (
                  <div className="h-96">
                    <BarChart
                      data={getRecommendationPerformanceData()}
                      index="product"
                      categories={["score"]}
                      colors={["#10b981"]}
                      valueFormatter={(value) => `${(value * 100).toFixed(0)}%`}
                      showLegend={false}
                      showXAxis={true}
                      showYAxis={true}
                      showGridLines={true}
                    />
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <p className="text-muted-foreground">Not enough recommendation data to display performance</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}
    </div>
  )
}
