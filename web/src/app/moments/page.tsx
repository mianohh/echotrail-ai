'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { Sparkles, Play, Calendar, Hash, MessageCircle, Lightbulb, Database, Zap, Crown, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import AppLayout from '@/components/AppLayout'
import { useAuth } from '@/hooks/useAuth'
import { api, formatDate, getEmotionalToneColor } from '@/lib/utils'
import { Moment, AnalysisResponse } from '@/types'

export default function MomentsPage() {
  const [moments, setMoments] = useState<Moment[]>([])
  const [loading, setLoading] = useState(false)
  const [analyzing, setAnalyzing] = useState(false)
  const [lastAnalysis, setLastAnalysis] = useState<AnalysisResponse | null>(null)
  const [showDemoNotice, setShowDemoNotice] = useState(false)
  
  const { isAuthenticated } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()
  const isDemoMode = searchParams.get('demo') === 'true'
  const highlightMoment = searchParams.get('highlight')

  useEffect(() => {
    if (isAuthenticated) {
      fetchMoments()
      if (isDemoMode) {
        setShowDemoNotice(true)
      }
    }
  }, [isAuthenticated, isDemoMode])

  const fetchMoments = async () => {
    setLoading(true)
    try {
      const response = await api.get<Moment[]>('/moments')
      setMoments(response.data)
    } catch (error) {
      console.error('Failed to fetch moments:', error)
    } finally {
      setLoading(false)
    }
  }

  const runAnalysis = async () => {
    setAnalyzing(true)
    try {
      const response = await api.post<AnalysisResponse>('/analyze', {
        min_cluster_size: 2
      })
      setLastAnalysis(response.data)
      setMoments(response.data.moments)
    } catch (error) {
      console.error('Failed to run analysis:', error)
    } finally {
      setAnalyzing(false)
    }
  }

  const clearDemoData = async () => {
    try {
      // This would clear the demo data and redirect to empty state
      localStorage.removeItem('token')
      router.push('/')
    } catch (error) {
      console.error('Failed to clear demo data:', error)
    }
  }

  if (!isAuthenticated) {
    return <div>Please log in to access this page.</div>
  }

  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold mb-2">Your Moments</h1>
              <p className="text-muted-foreground">
                AI-generated insights from your life experiences
              </p>
            </div>
            <div className="flex gap-2">
              <Button 
                onClick={runAnalysis}
                disabled={analyzing}
              >
                <Play className="h-4 w-4 mr-2" />
                {analyzing ? 'Analyzing...' : 'Run Analysis'}
              </Button>
            </div>
          </div>

          {/* Demo Mode Notice */}
          {showDemoNotice && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6"
            >
              <Card className="bg-gradient-to-r from-primary/10 to-primary/5 border-primary/20">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Crown className="h-5 w-5 text-primary" />
                      <div>
                        <h3 className="font-semibold text-primary">Demo Mode Active</h3>
                        <p className="text-sm text-muted-foreground">
                          You're viewing curated demo data with 32 notes and 6 moments. 
                          Look for the highlighted "A Period of Transition" moment below.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button variant="outline" size="sm" onClick={clearDemoData}>
                        Clear Demo Data
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => setShowDemoNotice(false)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
          {/* Analysis Stats */}
          {lastAnalysis && (
            <Card className="mb-6 bg-primary/5 border-primary/20">
              <CardContent className="pt-6">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-primary">
                      {lastAnalysis.moments.length}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Moments Created
                    </div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-primary">
                      {lastAnalysis.total_notes_analyzed}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Notes Analyzed
                    </div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-primary">
                      {lastAnalysis.analysis_time.toFixed(1)}s
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Analysis Time
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Moments Grid */}
          {loading ? (
            <div className="space-y-6">
              {[...Array(3)].map((_, i) => (
                <Card key={i} className="animate-pulse">
                  <CardHeader>
                    <div className="h-6 bg-muted rounded w-3/4"></div>
                    <div className="h-4 bg-muted rounded w-1/2"></div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="h-4 bg-muted rounded"></div>
                      <div className="h-4 bg-muted rounded w-5/6"></div>
                      <div className="flex gap-2">
                        <div className="h-6 bg-muted rounded w-16"></div>
                        <div className="h-6 bg-muted rounded w-16"></div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : moments.length === 0 ? (
            <Card className="text-center py-12">
              <CardContent>
                <Sparkles className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                <h3 className="text-lg font-medium mb-2">No moments yet</h3>
                <p className="text-muted-foreground mb-6">
                  Create some notes first, then run the AI analysis to generate meaningful moments from your experiences.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Button onClick={() => router.push('/demo/judge')} disabled={loading}>
                    <Crown className="h-4 w-4 mr-2" />
                    Try Demo
                  </Button>
                  <Button variant="outline" onClick={runAnalysis} disabled={analyzing}>
                    <Play className="h-4 w-4 mr-2" />
                    Analyze Existing Notes
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-6">
              {moments.map((moment, index) => {
                const isHighlighted = highlightMoment && moment.title === decodeURIComponent(highlightMoment)
                return (
                  <motion.div
                    key={moment.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <Card className={`hover:shadow-lg transition-all ${
                      isHighlighted 
                        ? 'ring-2 ring-primary shadow-lg bg-gradient-to-r from-primary/5 to-primary/10' 
                        : ''
                    }`}>
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <CardTitle className="text-xl mb-2 flex items-center">
                              {isHighlighted && <Crown className="h-5 w-5 text-primary mr-2" />}
                              {moment.title}
                              {isHighlighted && (
                                <Badge className="ml-2 bg-primary text-primary-foreground">
                                  Standout Moment
                                </Badge>
                              )}
                            </CardTitle>
                          <CardDescription className="flex items-center gap-4 text-sm">
                            <span className="flex items-center gap-1">
                              <Calendar className="h-4 w-4" />
                              {formatDate(moment.start_date)}
                              {moment.start_date !== moment.end_date && (
                                <> - {formatDate(moment.end_date)}</>
                              )}
                            </span>
                            <span className="flex items-center gap-1">
                              <Hash className="h-4 w-4" />
                              {moment.note_count} notes
                            </span>
                          </CardDescription>
                        </div>
                        <Badge 
                          className={getEmotionalToneColor(moment.emotional_tone)}
                        >
                          {moment.emotional_tone}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p className="text-muted-foreground leading-relaxed">
                        {moment.summary}
                      </p>
                      
                      <div>
                        <h4 className="font-medium mb-2 flex items-center">
                          <Hash className="h-4 w-4 mr-1" />
                          Key Themes
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {moment.keywords.slice(0, 6).map((keyword, i) => (
                            <Badge key={i} variant="secondary" className="text-xs">
                              {keyword}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      
                      <div className="bg-muted/50 rounded-lg p-4">
                        <h4 className="font-medium mb-2 flex items-center text-primary">
                          <Lightbulb className="h-4 w-4 mr-1" />
                          Reflection Prompt
                        </h4>
                        <p className="text-sm italic">
                          {moment.reflection_prompt}
                        </p>
                      </div>
                      
                      <div className="flex items-center justify-between text-xs text-muted-foreground pt-2 border-t">
                        <span>
                          Emotional Score: {moment.emotional_score > 0 ? '+' : ''}{moment.emotional_score.toFixed(2)}
                        </span>
                        <span>
                          Generated {formatDate(moment.created_at)}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}

          {/* Help Card */}
          <Card className="mt-8 bg-primary/5 border-primary/20">
            <CardContent className="pt-6">
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <Sparkles className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium mb-1">How Moments Work</h3>
                  <p className="text-sm text-muted-foreground">
                    Our AI analyzes your notes using advanced clustering algorithms to group related experiences by content similarity and time proximity. 
                    Each moment includes emotional analysis, key themes, and personalized reflection prompts to help you understand your patterns and growth.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </AppLayout>
  )
}