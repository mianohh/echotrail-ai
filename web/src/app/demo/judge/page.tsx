'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Sparkles, Brain, CheckCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

export default function JudgeDemoPage() {
  const [loading, setLoading] = useState(true)
  const [progress, setProgress] = useState(0)
  const [currentStep, setCurrentStep] = useState(0)
  const [error, setError] = useState('')
  const router = useRouter()

  const steps = [
    'Loading demo account...',
    'Generating life moments...',
    'Analyzing emotional patterns...',
    'Preparing insights...',
    'Complete!'
  ]

  useEffect(() => {
    const loadDemo = async () => {
      try {
        // Simulate loading steps with realistic timing
        const stepDuration = 600
        
        for (let i = 0; i < steps.length; i++) {
          setCurrentStep(i)
          setProgress((i / (steps.length - 1)) * 100)
          await new Promise(resolve => setTimeout(resolve, stepDuration))
        }

        // Login as demo user with pre-loaded data
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/demo/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' }
        })

        if (response.ok) {
          const { access_token } = await response.json()
          localStorage.setItem('token', access_token)
          
          // Success - navigate to moments
          setTimeout(() => {
            setLoading(false)
            window.location.href = '/moments?demo=true&highlight=A%20Period%20of%20Transition'
          }, 500)
        } else {
          throw new Error('Failed to load demo')
        }

      } catch (err) {
        console.error('Demo loading error:', err)
        setError('Failed to load demo. Please try again.')
        setLoading(false)
      }
    }

    loadDemo()
  }, [])

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-primary/5">
        <Card className="max-w-md mx-auto">
          <CardContent className="p-8 text-center">
            <div className="text-red-500 mb-4">
              <svg className="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 19.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold mb-2">Demo Error</h2>
            <p className="text-muted-foreground mb-4">{error}</p>
            <div className="space-y-2">
              <Button onClick={() => window.location.reload()} className="w-full">
                Try Again
              </Button>
              <Button variant="outline" onClick={() => router.push('/')} className="w-full">
                Back to Home
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-primary/5">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Demo Ready!</h2>
          <p className="text-muted-foreground">Redirecting to your moments...</p>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-primary/5">
      <Card className="max-w-lg mx-auto">
        <CardContent className="p-8">
          <div className="text-center mb-8">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="inline-block mb-4"
            >
              <Sparkles className="h-12 w-12 text-primary" />
            </motion.div>
            <h1 className="text-2xl font-bold mb-2">EchoTrail AI Demo</h1>
            <p className="text-muted-foreground">
              Reconstructing meaningful life moments from curated demo data
            </p>
          </div>

          {/* Progress Bar */}
          <div className="mb-6">
            <div className="flex justify-between text-sm text-muted-foreground mb-2">
              <span>Progress</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <div className="w-full bg-secondary rounded-full h-2">
              <motion.div
                className="bg-primary h-2 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
          </div>

          {/* Current Step */}
          <div className="space-y-3">
            {steps.map((step, index) => (
              <motion.div
                key={step}
                initial={{ opacity: 0.3 }}
                animate={{ 
                  opacity: index <= currentStep ? 1 : 0.3,
                  x: index === currentStep ? 0 : index < currentStep ? -10 : 0
                }}
                className="flex items-center space-x-3"
              >
                {index < currentStep ? (
                  <CheckCircle className="h-5 w-5 text-green-500" />
                ) : index === currentStep ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  >
                    <Brain className="h-5 w-5 text-primary" />
                  </motion.div>
                ) : (
                  <div className="h-5 w-5 rounded-full border-2 border-muted" />
                )}
                <span className={index <= currentStep ? 'text-foreground' : 'text-muted-foreground'}>
                  {step}
                </span>
              </motion.div>
            ))}
          </div>

          <div className="mt-8 p-4 bg-primary/5 rounded-lg">
            <p className="text-sm text-muted-foreground text-center">
              <strong>Demo Mode:</strong> This creates a temporary account with 32 curated notes 
              spanning 16 days, generating 6 meaningful moments including the standout 
              "A Period of Transition" moment.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}