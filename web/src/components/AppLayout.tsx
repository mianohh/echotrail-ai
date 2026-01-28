'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion } from 'framer-motion'
import { 
  PenTool, 
  BookOpen, 
  Sparkles, 
  BarChart3, 
  Menu, 
  X, 
  LogOut,
  User
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/hooks/useAuth'
import { cn } from '@/lib/utils'

const navigation = [
  { name: 'Capture', href: '/capture', icon: PenTool },
  { name: 'Library', href: '/library', icon: BookOpen },
  { name: 'Moments', href: '/moments', icon: Sparkles },
  { name: 'Insights', href: '/insights', icon: BarChart3 },
]

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const pathname = usePathname()
  const { user, logout } = useAuth()

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile sidebar */}
      <motion.div
        initial={false}
        animate={{ x: sidebarOpen ? 0 : '-100%' }}
        className="fixed inset-y-0 left-0 z-50 w-64 bg-card border-r lg:hidden"
      >
        <div className="flex items-center justify-between p-4 border-b">
          <h1 className="text-xl font-bold gradient-text">EchoTrail AI</h1>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="h-5 w-5" />
          </Button>
        </div>
        <SidebarContent pathname={pathname} />
      </motion.div>

      {/* Desktop sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:left-0 lg:z-50 lg:block lg:w-64 lg:bg-card lg:border-r">
        <div className="flex items-center p-4 border-b">
          <h1 className="text-xl font-bold gradient-text">EchoTrail AI</h1>
        </div>
        <SidebarContent pathname={pathname} />
      </div>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Top bar */}
        <div className="sticky top-0 z-40 bg-background/80 backdrop-blur-sm border-b">
          <div className="flex items-center justify-between px-4 py-3">
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="h-5 w-5" />
            </Button>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <User className="h-4 w-4" />
                <span>{user?.email}</span>
              </div>
              <Button variant="ghost" size="sm" onClick={logout}>
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>

        {/* Page content */}
        <main className="p-4 lg:p-8">
          {children}
        </main>
      </div>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  )
}

function SidebarContent({ pathname }: { pathname: string }) {
  return (
    <nav className="flex-1 p-4 space-y-2">
      {navigation.map((item) => {
        const isActive = pathname === item.href
        return (
          <Link key={item.name} href={item.href}>
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={cn(
                'flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                isActive
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:text-foreground hover:bg-accent'
              )}
            >
              <item.icon className="h-5 w-5" />
              <span>{item.name}</span>
            </motion.div>
          </Link>
        )
      })}
    </nav>
  )
}