'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { BarChart3, TrendingUp, Calendar, Zap, Heart } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import AppLayout from '@/components/AppLayout'
import { useAuth } from '@/hooks/useAuth'
import { api } from '@/lib/utils'
import { InsightsStats } from '@/types'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts'

const COLORS = ['#3b82f6', '#ef4444', '#f59e0b', '#10b981', '#8b5cf6', '#f97316']

export default function InsightsPage() {
  const [stats, setStats] = useState<InsightsStats | null>(null)
  const [loading, setLoading] = useState(true)
  
  const { isAuthenticated } = useAuth()

  useEffect(() => {
    if (isAuthenticated) {
      fetchInsights()
    }
  }, [isAuthenticated])

  const fetchInsights = async () => {
    try {
      const response = await api.get<InsightsStats>('/insights/stats')
      setStats(response.data)
    } catch (error) {
      console.error('Failed to fetch insights:', error)
    } finally {
      setLoading(false)
    }
  }

  if (!isAuthenticated) {
    return <div>Please log in to access this page.</div>
  }

  if (loading) {
    return (
      <AppLayout>
        <div className="max-w-6xl mx-auto">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-muted rounded w-1/3"></div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              {[...Array(4)].map((_, i) => (
                <Card key={i}>
                  <CardContent className="pt-6">
                    <div className="h-8 bg-muted rounded mb-2"></div>
                    <div className="h-4 bg-muted rounded w-2/3"></div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </AppLayout>
    )
  }

  if (!stats || stats.total_notes === 0) {
    return (
      <AppLayout>
        <div className="max-w-6xl mx-auto">
          <Card className="text-center py-12">
            <CardContent>
              <BarChart3 className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
              <h3 className="text-lg font-medium mb-2">No insights yet</h3>
              <p className="text-muted-foreground">
                Create some notes first to see your personal analytics and trends.
              </p>
            </CardContent>
          </Card>
        </div>
      </AppLayout>
    )
  }

  // Prepare chart data
  const moodData = Object.entries(stats.mood_distribution).map(([mood, count]) => ({
    mood,
    count,
    percentage: Math.round((count / stats.total_notes) * 100)
  }))

  const energyTrendData = stats.energy_trends.slice(-14) // Last 14 days

  return (
    <AppLayout>
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Your Insights</h1>
            <p className="text-muted-foreground">
              Discover patterns and trends in your emotional journey
            </p>
          </div>

          {/* Stats Overview */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Total Notes</p>
                    <p className="text-2xl font-bold">{stats.total_notes}</p>
                  </div>
                  <Calendar className="h-8 w-8 text-primary" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Moments</p>
                    <p className="text-2xl font-bold">{stats.total_moments}</p>
                  </div>
                  <Heart className="h-8 w-8 text-primary" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Recent Activity</p>
                    <p className="text-2xl font-bold">{stats.recent_activity}</p>
                    <p className="text-xs text-muted-foreground">Last 7 days</p>
                  </div>
                  <TrendingUp className="h-8 w-8 text-primary" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Avg Energy</p>
                    <p className="text-2xl font-bold">
                      {energyTrendData.length > 0 
                        ? (energyTrendData.reduce((sum, day) => sum + day.average_energy, 0) / energyTrendData.length).toFixed(1)
                        : '0'
                      }
                    </p>
                    <p className="text-xs text-muted-foreground">Out of 5</p>
                  </div>
                  <Zap className="h-8 w-8 text-primary" />
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid lg:grid-cols-2 gap-6 mb-8">
            {/* Energy Trends */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TrendingUp className="h-5 w-5 mr-2" />
                  Energy Trends
                </CardTitle>
                <CardDescription>
                  Your energy levels over the past two weeks
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={energyTrendData}>
                      <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                      <XAxis 
                        dataKey="date" 
                        tickFormatter={(date) => new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        className="text-xs"
                      />
                      <YAxis domain={[1, 5]} className="text-xs" />
                      <Tooltip 
                        labelFormatter={(date) => new Date(date).toLocaleDateString()}
                        formatter={(value: number) => [value.toFixed(1), 'Energy Level']}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="average_energy" 
                        stroke="#3b82f6" 
                        strokeWidth={2}
                        dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Mood Distribution */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Heart className="h-5 w-5 mr-2" />
                  Mood Distribution
                </CardTitle>
                <CardDescription>
                  How you've been feeling overall
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={moodData.slice(0, 8)}>
                      <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                      <XAxis dataKey="mood" className="text-xs" />
                      <YAxis className="text-xs" />
                      <Tooltip formatter={(value: number) => [value, 'Count']} />
                      <Bar dataKey="count" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Mood Breakdown */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Mood Breakdown</CardTitle>
              <CardDescription>
                All your recorded moods and their frequency
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {moodData.map((item, index) => (
                  <motion.div
                    key={item.mood}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    className="text-center p-3 rounded-lg bg-muted/50"
                  >
                    <div className="text-2xl mb-1">{item.mood}</div>
                    <div className="text-sm font-medium">{item.count}</div>
                    <div className="text-xs text-muted-foreground">
                      {item.percentage}%
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Date Range Info */}
          {stats.date_range.start && (
            <Card className="bg-primary/5 border-primary/20">
              <CardContent className="pt-6">
                <div className="text-center">
                  <h3 className="font-medium mb-2">Your Journey</h3>
                  <p className="text-sm text-muted-foreground">
                    From {new Date(stats.date_range.start).toLocaleDateString()} to{' '}
                    {new Date(stats.date_range.end!).toLocaleDateString()}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {Math.ceil((new Date(stats.date_range.end!).getTime() - new Date(stats.date_range.start).getTime()) / (1000 * 60 * 60 * 24))} days of memories captured
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </motion.div>
      </div>
    </AppLayout>
  )
}