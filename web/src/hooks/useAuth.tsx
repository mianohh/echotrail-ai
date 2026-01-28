'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { api, getStoredToken, setStoredToken, removeStoredToken } from '@/lib/utils'
import { User, LoginCredentials, RegisterCredentials, AuthTokens } from '@/types'

interface AuthContextType {
  user: User | null
  loading: boolean
  login: (credentials: LoginCredentials) => Promise<void>
  register: (credentials: RegisterCredentials) => Promise<void>
  logout: () => void
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  const isAuthenticated = !!user

  useEffect(() => {
    const token = getStoredToken()
    if (token) {
      fetchUser()
    } else {
      setLoading(false)
    }
  }, [])

  const fetchUser = async () => {
    try {
      const response = await api.get<User>('/auth/me')
      setUser(response.data)
    } catch (error) {
      removeStoredToken()
    } finally {
      setLoading(false)
    }
  }

  const login = async (credentials: LoginCredentials) => {
    const response = await api.post<AuthTokens>('/auth/login', credentials)
    const { access_token } = response.data
    
    setStoredToken(access_token)
    await fetchUser()
  }

  const register = async (credentials: RegisterCredentials) => {
    const response = await api.post<AuthTokens>('/auth/register', credentials)
    const { access_token } = response.data
    
    setStoredToken(access_token)
    await fetchUser()
  }

  const logout = () => {
    removeStoredToken()
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      login,
      register,
      logout,
      isAuthenticated
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}