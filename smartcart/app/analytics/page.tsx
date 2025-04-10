"use client"

import { useState } from "react"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import PersonaSidebar from "@/components/persona-sidebar"
import ChatAssistant from "@/components/chat-assistant"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"
import { Calendar, Clock, TrendingUp, ShoppingBag, Heart, Eye, ArrowUpRight, Download, Share2 } from "lucide-react"

// Mock data for charts
const moodData = [
  { name: "Happy", value: 35 },
  { name: "Neutral", value: 25 },
  { name: "Sad", value: 10 },
  { name: "Loving", value: 15 },
  { name: "Energetic", value: 15 },
]

const categoryData = [
  { name: "Electronics", value: 40 },
  { name: "Fashion", value: 25 },
  { name: "Home", value: 15 },
  { name: "Beauty", value: 10 },
  { name: "Toys", value: 5 },
  { name: "Others", value: 5 },
]

const weeklyActivityData = [
  { day: "Mon", views: 20, likes: 5, purchases: 2 },
  { day: "Tue", views: 15, likes: 3, purchases: 1 },
  { day: "Wed", views: 25, likes: 8, purchases: 3 },
  { day: "Thu", views: 30, likes: 10, purchases: 4 },
  { day: "Fri", views: 40, likes: 15, purchases: 6 },
  { day: "Sat", views: 45, likes: 18, purchases: 7 },
  { day: "Sun", views: 35, likes: 12, purchases: 5 },
]

const monthlySpendingData = [
  { month: "Jan", amount: 5000 },
  { month: "Feb", amount: 6200 },
  { month: "Mar", amount: 4800 },
  { month: "Apr", amount: 7500 },
  { month: "May", amount: 8200 },
  { month: "Jun", amount: 7800 },
  { month: "Jul", amount: 9500 },
  { month: "Aug", amount: 8700 },
  { month: "Sep", amount: 7900 },
  { month: "Oct", amount: 8500 },
  { month: "Nov", amount: 9800 },
  { month: "Dec", amount: 12000 },
]

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8", "#82ca9d"]

export default function AnalyticsPage() {
  const [activeTab, setActiveTab] = useState("overview")

  return (
    <main className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-1 flex">
        <PersonaSidebar />
        <div className="flex-1 bg-gray-50">
          <div className="container mx-auto px-4 py-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
              <div>
                <h1 className="text-2xl font-bold">Shopping Analytics</h1>
                <p className="text-gray-500">Insights into your shopping behavior and preferences</p>
              </div>

              <div className="flex items-center gap-2 mt-4 md:mt-0">
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-1" /> Export
                </Button>
                <Button variant="outline" size="sm">
                  <Share2 className="h-4 w-4 mr-1" /> Share
                </Button>
              </div>
            </div>

            <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="mb-6">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="mood">Mood Analysis</TabsTrigger>
                <TabsTrigger value="spending">Spending</TabsTrigger>
                <TabsTrigger value="behavior">Behavior</TabsTrigger>
              </TabsList>

              <TabsContent value="overview">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium text-gray-500">Total Spent</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between">
                        <div className="text-2xl font-bold">₹89,540</div>
                        <div className="flex items-center text-green-600 text-sm">
                          <ArrowUpRight className="h-4 w-4 mr-1" /> 12%
                        </div>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">Compared to last month</p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium text-gray-500">Products Viewed</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between">
                        <div className="text-2xl font-bold">245</div>
                        <div className="flex items-center text-green-600 text-sm">
                          <ArrowUpRight className="h-4 w-4 mr-1" /> 8%
                        </div>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">Compared to last month</p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium text-gray-500">Wishlist Items</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between">
                        <div className="text-2xl font-bold">32</div>
                        <div className="flex items-center text-green-600 text-sm">
                          <ArrowUpRight className="h-4 w-4 mr-1" /> 5%
                        </div>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">Compared to last month</p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium text-gray-500">Purchases</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between">
                        <div className="text-2xl font-bold">18</div>
                        <div className="flex items-center text-green-600 text-sm">
                          <ArrowUpRight className="h-4 w-4 mr-1" /> 15%
                        </div>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">Compared to last month</p>
                    </CardContent>
                  </Card>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Weekly Activity</CardTitle>
                      <CardDescription>Your shopping activity over the past week</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={weeklyActivityData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="day" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="views" name="Views" fill="#8884d8" />
                            <Bar dataKey="likes" name="Likes" fill="#82ca9d" />
                            <Bar dataKey="purchases" name="Purchases" fill="#ffc658" />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Monthly Spending</CardTitle>
                      <CardDescription>Your spending pattern over the past year</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart data={monthlySpendingData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="month" />
                            <YAxis />
                            <Tooltip formatter={(value) => [`₹${value}`, "Amount"]} />
                            <Legend />
                            <Line
                              type="monotone"
                              dataKey="amount"
                              name="Spending"
                              stroke="#8884d8"
                              activeDot={{ r: 8 }}
                            />
                          </LineChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Shopping by Mood</CardTitle>
                      <CardDescription>Distribution of your shopping based on mood</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={moodData}
                              cx="50%"
                              cy="50%"
                              labelLine={false}
                              outerRadius={80}
                              fill="#8884d8"
                              dataKey="value"
                              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                            >
                              {moodData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                              ))}
                            </Pie>
                            <Tooltip formatter={(value) => [`${value}%`, "Percentage"]} />
                            <Legend />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Shopping by Category</CardTitle>
                      <CardDescription>Distribution of your purchases by category</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={categoryData}
                              cx="50%"
                              cy="50%"
                              labelLine={false}
                              outerRadius={80}
                              fill="#8884d8"
                              dataKey="value"
                              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                            >
                              {categoryData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                              ))}
                            </Pie>
                            <Tooltip formatter={(value) => [`${value}%`, "Percentage"]} />
                            <Legend />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="mood">
                <Card>
                  <CardHeader>
                    <CardTitle>Mood Analysis</CardTitle>
                    <CardDescription>How your mood affects your shopping behavior</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-96">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={moodData}
                            cx="50%"
                            cy="50%"
                            labelLine={true}
                            outerRadius={120}
                            fill="#8884d8"
                            dataKey="value"
                            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                          >
                            {moodData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip formatter={(value) => [`${value}%`, "Percentage"]} />
                          <Legend />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                      <Card>
                        <CardHeader className="pb-2">
                          <div className="flex items-center gap-2">
                            <div className="bg-[#0088FE] h-3 w-3 rounded-full"></div>
                            <CardTitle className="text-sm font-medium">Happy Mood</CardTitle>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm text-gray-600">
                            When happy, you tend to spend more on luxury items and electronics.
                          </p>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader className="pb-2">
                          <div className="flex items-center gap-2">
                            <div className="bg-[#00C49F] h-3 w-3 rounded-full"></div>
                            <CardTitle className="text-sm font-medium">Neutral Mood</CardTitle>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm text-gray-600">
                            In a neutral mood, you browse more but make fewer purchases.
                          </p>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader className="pb-2">
                          <div className="flex items-center gap-2">
                            <div className="bg-[#FFBB28] h-3 w-3 rounded-full"></div>
                            <CardTitle className="text-sm font-medium">Energetic Mood</CardTitle>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm text-gray-600">
                            When energetic, you're more likely to make impulse purchases.
                          </p>
                        </CardContent>
                      </Card>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="spending">
                <Card>
                  <CardHeader>
                    <CardTitle>Spending Analysis</CardTitle>
                    <CardDescription>Your spending patterns over time</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-96">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={monthlySpendingData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="month" />
                          <YAxis />
                          <Tooltip formatter={(value) => [`₹${value}`, "Amount"]} />
                          <Legend />
                          <Line
                            type="monotone"
                            dataKey="amount"
                            name="Spending"
                            stroke="#8884d8"
                            strokeWidth={2}
                            activeDot={{ r: 8 }}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm font-medium">Highest Spending</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="text-2xl font-bold">₹12,000</div>
                          <p className="text-xs text-gray-500 mt-1">December 2023</p>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm font-medium">Average Monthly</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="text-2xl font-bold">₹7,950</div>
                          <p className="text-xs text-gray-500 mt-1">Over the past year</p>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm font-medium">Projected Annual</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="text-2xl font-bold">₹95,400</div>
                          <p className="text-xs text-gray-500 mt-1">Based on current trends</p>
                        </CardContent>
                      </Card>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="behavior">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Shopping Behavior</CardTitle>
                      <CardDescription>Analysis of your shopping patterns</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-6">
                        <div>
                          <h3 className="text-sm font-medium mb-2">Peak Shopping Times</h3>
                          <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2">
                              <Calendar className="h-4 w-4 text-blue-600" />
                              <span className="text-sm">Weekends</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Clock className="h-4 w-4 text-blue-600" />
                              <span className="text-sm">7PM - 10PM</span>
                            </div>
                          </div>
                        </div>

                        <div>
                          <h3 className="text-sm font-medium mb-2">Most Viewed Categories</h3>
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-sm">Electronics</span>
                              <span className="text-sm font-medium">45%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div className="bg-blue-600 h-2 rounded-full" style={{ width: "45%" }}></div>
                            </div>

                            <div className="flex items-center justify-between">
                              <span className="text-sm">Fashion</span>
                              <span className="text-sm font-medium">30%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div className="bg-blue-600 h-2 rounded-full" style={{ width: "30%" }}></div>
                            </div>

                            <div className="flex items-center justify-between">
                              <span className="text-sm">Home</span>
                              <span className="text-sm font-medium">15%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div className="bg-blue-600 h-2 rounded-full" style={{ width: "15%" }}></div>
                            </div>
                          </div>
                        </div>

                        <div>
                          <h3 className="text-sm font-medium mb-2">Behavior Insights</h3>
                          <ul className="space-y-2">
                            <li className="flex items-start gap-2">
                              <Eye className="h-4 w-4 text-blue-600 mt-0.5" />
                              <span className="text-sm">You browse 3x more items than the average user</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <Heart className="h-4 w-4 text-blue-600 mt-0.5" />
                              <span className="text-sm">You add items to wishlist more often than cart</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <ShoppingBag className="h-4 w-4 text-blue-600 mt-0.5" />
                              <span className="text-sm">You complete 65% of your cart purchases</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <TrendingUp className="h-4 w-4 text-blue-600 mt-0.5" />
                              <span className="text-sm">Your spending has increased by 15% in the last 3 months</span>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Category Preferences</CardTitle>
                      <CardDescription>Distribution of your interests by category</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={categoryData}
                              cx="50%"
                              cy="50%"
                              labelLine={false}
                              outerRadius={100}
                              fill="#8884d8"
                              dataKey="value"
                              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                            >
                              {categoryData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                              ))}
                            </Pie>
                            <Tooltip formatter={(value) => [`${value}%`, "Percentage"]} />
                            <Legend />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
      <Footer />
      <ChatAssistant />
    </main>
  )
}
