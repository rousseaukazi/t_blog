import React from 'react'
import Link from 'next/link'

interface RauchLayoutProps {
  children: React.ReactNode
  title?: string
  description?: string
}

export function RauchLayout({ children, title, description }: RauchLayoutProps) {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="rauch-header">
        <div className="rauch-container">
          <nav className="rauch-nav">
            <div>
              <Link href="/" className="text-xl font-bold text-gray-900">
                AI Tools Blog
              </Link>
              {description && (
                <p className="text-gray-600 text-sm mt-1">{description}</p>
              )}
            </div>
            <div className="rauch-nav-links">
              <Link href="/" className="rauch-nav-link active">
                Home
              </Link>
              <Link href="/about" className="rauch-nav-link">
                About
              </Link>
            </div>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="rauch-main">
        <div className="rauch-container">
          {title && (
            <div className="mb-12">
              <h1 className="rauch-article-title">{title}</h1>
            </div>
          )}
          {children}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 py-12">
        <div className="rauch-container">
          {/* Clean minimal footer - no text needed */}
        </div>
      </footer>
    </div>
  )
} 