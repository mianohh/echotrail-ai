import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import axios from "axios"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// API Client
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = getStoredToken()
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      removeStoredToken()
      window.location.href = '/auth/login'
    }
    return Promise.reject(error)
  }
)

// Date formatting utilities
export function formatDate(date: string | Date): string {
  const d = new Date(date)
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

export function formatDateTime(date: string | Date): string {
  const d = new Date(date)
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export function formatRelativeTime(date: string | Date): string {
  const d = new Date(date)
  const now = new Date()
  const diffInSeconds = Math.floor((now.getTime() - d.getTime()) / 1000)
  
  if (diffInSeconds < 60) return 'Just now'
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`
  
  return formatDate(d)
}

// Mood utilities
export const MOOD_EMOJIS = [
  '😊', '😄', '😃', '🙂', '😐', '😔', '😢', '😭', '😤', '😡',
  '🤔', '😴', '🤗', '😍', '🥰', '😎', '🤩', '😇', '🙃', '😋',
  '🌟', '💪', '🎉', '❤️', '🧘', '📚', '🏕️', '🎯', '🌱'
]

export function getMoodColor(mood: string): string {
  const positiveEmojis = ['😊', '😄', '😃', '🙂', '🤗', '😍', '🥰', '😎', '🤩', '😇', '🌟', '💪', '🎉', '❤️', '🧘', '📚', '🏕️', '🎯', '🌱']
  const negativeEmojis = ['😔', '😢', '😭', '😤', '😡']
  
  if (positiveEmojis.includes(mood)) return 'text-green-500'
  if (negativeEmojis.includes(mood)) return 'text-red-500'
  return 'text-yellow-500'
}

export function getEmotionalToneColor(tone: string): string {
  switch (tone) {
    case 'Positive': return 'text-green-500 bg-green-50 dark:bg-green-900/20'
    case 'Negative': return 'text-red-500 bg-red-50 dark:bg-red-900/20'
    default: return 'text-yellow-500 bg-yellow-50 dark:bg-yellow-900/20'
  }
}

// Local storage utilities
export function getStoredToken(): string | null {
  if (typeof window === 'undefined') return null
  return localStorage.getItem('access_token') || localStorage.getItem('token')
}

export function setStoredToken(token: string): void {
  if (typeof window === 'undefined') return
  localStorage.setItem('access_token', token)
}

export function removeStoredToken(): void {
  if (typeof window === 'undefined') return
  localStorage.removeItem('access_token')
}

// Validation utilities
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export function isValidPassword(password: string): boolean {
  return password.length >= 6
}