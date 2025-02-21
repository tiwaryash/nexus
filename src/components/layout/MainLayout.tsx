import { ReactNode } from 'react'
import Link from 'next/link'
import { ThemeToggle } from '../ui/ThemeToggle'

interface MainLayoutProps {
  children: ReactNode
}

export default function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <nav className="bg-white dark:bg-gray-800 shadow-lg border-b border-gray-100 dark:border-gray-700">
        <div className="container-custom">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link href="/" className="flex items-center space-x-2">
                <span className="text-2xl font-bold text-red-800 dark:text-red-500">Nexus Mind</span>
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <ThemeToggle />
              <Link 
                href="/login"
                className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 px-4 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Login
              </Link>
              <Link 
                href="/register"
                className="btn-primary text-sm font-medium"
              >
                Register
              </Link>
            </div>
          </div>
        </div>
      </nav>
      <main className="container-custom py-8">
        {children}
      </main>
    </div>
  )
}