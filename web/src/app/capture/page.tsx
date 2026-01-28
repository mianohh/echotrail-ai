'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Save, Image, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Slider } from '@/components/ui/slider'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import AppLayout from '@/components/AppLayout'
import { useAuth } from '@/hooks/useAuth'
import { api, MOOD_EMOJIS } from '@/lib/utils'
import { NoteCreate } from '@/types'

export default function CapturePage() {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [mood, setMood] = useState('😐')
  const [energyLevel, setEnergyLevel] = useState([3])
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  
  const { isAuthenticated } = useAuth()

  if (!isAuthenticated) {
    return <div>Please log in to access this page.</div>
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim() || !content.trim()) return

    setLoading(true)
    try {
      const noteData: NoteCreate = {
        title: title.trim(),
        content: content.trim(),
        mood,
        energy_level: energyLevel[0]
      }

      await api.post('/notes', noteData)
      
      // Reset form
      setTitle('')
      setContent('')
      setMood('😐')
      setEnergyLevel([3])
      setSuccess(true)
      
      setTimeout(() => setSuccess(false), 3000)
    } catch (error) {
      console.error('Failed to save note:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <AppLayout>
      <div className="max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Capture Your Moment</h1>
            <p className="text-muted-foreground">
              Record your thoughts, feelings, and experiences. Every note becomes part of your story.
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Sparkles className="h-5 w-5 mr-2 text-primary" />
                New Note
              </CardTitle>
              <CardDescription>
                Share what's on your mind right now
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Title
                  </label>
                  <Input
                    placeholder="What's this about?"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                  />
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Your thoughts
                  </label>
                  <Textarea
                    placeholder="Write about your experience, feelings, or anything on your mind..."
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    rows={6}
                    required
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="text-sm font-medium mb-3 block">
                      How are you feeling?
                    </label>
                    <div className="grid grid-cols-5 gap-2">
                      {MOOD_EMOJIS.slice(0, 15).map((emoji) => (
                        <Button
                          key={emoji}
                          type="button"
                          variant={mood === emoji ? "default" : "outline"}
                          className="h-12 text-lg"
                          onClick={() => setMood(emoji)}
                        >
                          {emoji}
                        </Button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-3 block">
                      Energy Level: {energyLevel[0]}
                    </label>
                    <div className="px-3">
                      <Slider
                        value={energyLevel}
                        onValueChange={setEnergyLevel}
                        max={5}
                        min={1}
                        step={1}
                        className="w-full"
                      />
                      <div className="flex justify-between text-xs text-muted-foreground mt-2">
                        <span>Low</span>
                        <span>High</span>
                      </div>
                    </div>
                  </div>
                </div>

                {success && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-3 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 rounded-md text-sm"
                  >
                    ✨ Note saved successfully! Your moment has been captured.
                  </motion.div>
                )}

                <div className="flex gap-3">
                  <Button 
                    type="submit" 
                    disabled={loading || !title.trim() || !content.trim()}
                    className="flex-1"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    {loading ? 'Saving...' : 'Save Note'}
                  </Button>
                  
                  <Button 
                    type="button" 
                    variant="outline"
                    onClick={() => {
                      setTitle('')
                      setContent('')
                      setMood('😐')
                      setEnergyLevel([3])
                    }}
                  >
                    Clear
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          <Card className="mt-6 bg-primary/5 border-primary/20">
            <CardContent className="pt-6">
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <Sparkles className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium mb-1">Pro Tip</h3>
                  <p className="text-sm text-muted-foreground">
                    The more notes you capture, the better AI can identify patterns and create meaningful moments. 
                    Try to write regularly about different aspects of your life.
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