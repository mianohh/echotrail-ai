'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Search, Filter, Plus, Edit, Trash2, Calendar, Zap } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import AppLayout from '@/components/AppLayout'
import { useAuth } from '@/hooks/useAuth'
import { api, formatRelativeTime, getMoodColor } from '@/lib/utils'
import { Note } from '@/types'
import Link from 'next/link'

export default function LibraryPage() {
  const [notes, setNotes] = useState<Note[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedMood, setSelectedMood] = useState('')
  
  const { isAuthenticated } = useAuth()

  useEffect(() => {
    if (isAuthenticated) {
      fetchNotes()
    }
  }, [isAuthenticated])

  const fetchNotes = async () => {
    try {
      const response = await api.get<Note[]>('/notes', {
        params: {
          search: searchTerm || undefined,
          mood: selectedMood || undefined,
          limit: 50
        }
      })
      setNotes(response.data)
    } catch (error) {
      console.error('Failed to fetch notes:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (noteId: number) => {
    if (!confirm('Are you sure you want to delete this note?')) return
    
    try {
      await api.delete(`/notes/${noteId}`)
      setNotes(notes.filter(note => note.id !== noteId))
    } catch (error) {
      console.error('Failed to delete note:', error)
    }
  }

  const filteredNotes = notes.filter(note => {
    const matchesSearch = !searchTerm || 
      note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      note.content.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesMood = !selectedMood || note.mood === selectedMood
    
    return matchesSearch && matchesMood
  })

  const uniqueMoods = Array.from(new Set(notes.map(note => note.mood)))

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
              <h1 className="text-3xl font-bold mb-2">Your Library</h1>
              <p className="text-muted-foreground">
                All your captured moments in one place
              </p>
            </div>
            <Link href="/capture">
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                New Note
              </Button>
            </Link>
          </div>

          {/* Search and Filters */}
          <Card className="mb-6">
            <CardContent className="pt-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search your notes..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                
                <div className="flex gap-2 flex-wrap">
                  <Button
                    variant={selectedMood === '' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSelectedMood('')}
                  >
                    All Moods
                  </Button>
                  {uniqueMoods.slice(0, 8).map(mood => (
                    <Button
                      key={mood}
                      variant={selectedMood === mood ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setSelectedMood(mood)}
                    >
                      {mood}
                    </Button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Notes Grid */}
          {loading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[...Array(6)].map((_, i) => (
                <Card key={i} className="animate-pulse">
                  <CardHeader>
                    <div className="h-4 bg-muted rounded w-3/4"></div>
                    <div className="h-3 bg-muted rounded w-1/2"></div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="h-3 bg-muted rounded"></div>
                      <div className="h-3 bg-muted rounded w-5/6"></div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : filteredNotes.length === 0 ? (
            <Card className="text-center py-12">
              <CardContent>
                <div className="text-muted-foreground mb-4">
                  {notes.length === 0 ? (
                    <>
                      <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <h3 className="text-lg font-medium mb-2">No notes yet</h3>
                      <p>Start capturing your thoughts and experiences!</p>
                    </>
                  ) : (
                    <>
                      <Search className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <h3 className="text-lg font-medium mb-2">No matching notes</h3>
                      <p>Try adjusting your search or filters</p>
                    </>
                  )}
                </div>
                {notes.length === 0 && (
                  <Link href="/capture">
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      Create Your First Note
                    </Button>
                  </Link>
                )}
              </CardContent>
            </Card>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredNotes.map((note, index) => (
                <motion.div
                  key={note.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                >
                  <Card className="h-full hover:shadow-lg transition-shadow group">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <CardTitle className="text-lg truncate">
                            {note.title}
                          </CardTitle>
                          <CardDescription className="flex items-center gap-2 mt-1">
                            <span className={getMoodColor(note.mood)}>
                              {note.mood}
                            </span>
                            <span>•</span>
                            <span>{formatRelativeTime(note.created_at)}</span>
                          </CardDescription>
                        </div>
                        <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <Edit className="h-3 w-3" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8 text-destructive hover:text-destructive"
                            onClick={() => handleDelete(note.id)}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <p className="text-sm text-muted-foreground line-clamp-3 mb-3">
                        {note.content}
                      </p>
                      <div className="flex items-center justify-between">
                        <Badge variant="secondary" className="text-xs">
                          <Zap className="h-3 w-3 mr-1" />
                          Energy {note.energy_level}/5
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}

          {/* Stats */}
          {notes.length > 0 && (
            <Card className="mt-8 bg-primary/5 border-primary/20">
              <CardContent className="pt-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-primary">
                      {notes.length}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Total Notes
                    </div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-primary">
                      {uniqueMoods.length}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Unique Moods
                    </div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-primary">
                      {Math.round(notes.reduce((sum, note) => sum + note.energy_level, 0) / notes.length * 10) / 10}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Avg Energy
                    </div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-primary">
                      {Math.round(notes.reduce((sum, note) => sum + note.content.split(' ').length, 0) / notes.length)}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Avg Words
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </motion.div>
      </div>
    </AppLayout>
  )
}