import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { AuthProvider } from '@/hooks/useAuth'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'EchoTrail AI - Transform Your Notes Into Meaningful Life Moments',
  description: 'AI-powered memory reconstruction that turns scattered thoughts into structured life experiences with emotional insights.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body className={inter.className}>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  )
}