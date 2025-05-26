"use client"

import React from 'react'
import Link from 'next/link'

interface RauchLayoutProps {
  children: React.ReactNode
  title?: string
  description?: string
  onBrandClick?: () => void
}

export function RauchLayout({ children, title, description, onBrandClick }: RauchLayoutProps) {
  const handleBrandClick = () => {
    if (onBrandClick) onBrandClick()
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Bottom-right brand */}
      <div className="fixed bottom-6 right-6 z-50 text-right">
        {/* Top separator line */}
        <div className="w-full border-t border-gray-300 mb-1" />
        <Link href="/" onClick={handleBrandClick} className="flex items-center justify-end space-x-2 group">
          <img
            src="/favicon.png"
            alt="WhichTools.ai logo"
            className="w-10 h-10"
          />
          <span className="text-xl font-bold text-gray-900 group-hover:underline">
            WhichTools.ai
          </span>
        </Link>
        {description && (
          <p className="text-gray-600 text-sm mt-1 max-w-xs ml-auto">{description}</p>
        )}
      </div>

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
      <footer className="py-12">
        <div className="rauch-container">
          {/* Clean minimal footer - no text needed */}
        </div>
      </footer>
    </div>
  )
} 