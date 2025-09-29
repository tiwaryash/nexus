'use client';

import { ReactNode } from 'react'
import Link from 'next/link'
import { ThemeToggle } from '../ui/ThemeToggle'
import { useAuth } from '@/contexts/AuthContext'
import { LogOut, User, MessageSquare, FileText, BarChart3 } from 'lucide-react'

interface MainLayoutProps {
  children: ReactNode
}

export default function MainLayout({ children }: MainLayoutProps) {
  const { user, logout } = useAuth()

  const handleLogout = async () => {
    await logout()
    window.location.href = '/'
  }

  return (
    <div className="h-screen bg-gray-50 dark:bg-gray-900 overflow-hidden">
      <nav className="bg-red-800 dark:bg-gray-800 shadow-lg border-b border-red-900 dark:border-gray-700">
        <div className="px-6">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link href="/" className="flex items-center space-x-2">
                <span className="text-2xl font-bold text-white">Nexus Mind</span>
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              {user && (
                <>
                 
                  <div className="flex items-center space-x-1">
                    <Link
                      href="/dashboard"
                      className="flex items-center space-x-1 text-red-100 dark:text-gray-300 hover:text-white hover:bg-red-900 dark:hover:bg-gray-700 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                    >
                      <FileText className="w-4 h-4" />
                      <span>Documents</span>
                    </Link>
                    <Link
                      href="/chat"
                      className="flex items-center space-x-1 text-red-100 dark:text-gray-300 hover:text-white hover:bg-red-900 dark:hover:bg-gray-700 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                    >
                      <MessageSquare className="w-4 h-4" />
                      <span>Chat</span>
                    </Link>
                  </div>
                </>
              )}
              {user ? (
                <>
                  <div className="flex items-center space-x-2 text-white">
                    <User className="w-5 h-5" />
                    <span className="hidden sm:inline">{user.name}</span>
                  </div>
                  <ThemeToggle />

                  <button
                    onClick={handleLogout}
                    className="text-red-100 dark:text-gray-300 hover:text-white hover:bg-red-900 dark:hover:bg-gray-700 px-4 py-2 rounded-md text-sm font-medium transition-colors"
                  >
                    <LogOut className="w-5 h-5" />
                  </button>
                </>
              ) : (
                <>
                  <Link 
                    href="/login"
                    className="text-red-100 dark:text-gray-300 hover:text-white hover:bg-red-900 dark:hover:bg-gray-700 px-4 py-2 rounded-md text-sm font-medium transition-colors"
                  >
                    Login
                  </Link>
                  <Link 
                    href="/register"
                    className="bg-white dark:bg-gray-200 text-red-800 dark:text-gray-800 hover:bg-red-50 dark:hover:bg-gray-300 px-4 py-2 rounded-md text-sm font-medium transition-colors"
                  >
                    Register
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>
      <main>
        {children}
      </main>
    </div>
  )
}


