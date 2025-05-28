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
      {/* Fixed footer brand block */}
      <footer className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 py-4 px-4">
        <div className="w-full flex flex-col items-end text-right pr-4">
          <Link href="/" onClick={handleBrandClick} className="flex items-center justify-end space-x-2 group">
            <img src="/favicon.png" alt="WhichTools.ai logo" className="w-8 h-8 md:w-10 md:h-10" />
            <span className="text-lg md:text-xl font-bold text-gray-900 group-hover:underline">WhichTools.ai</span>
          </Link>
          {description && (
            <p className="text-gray-600 text-xs md:text-sm mt-1 max-w-xs">{description}</p>
          )}
        </div>
      </footer>

      {/* Main Content */}
      <main className="rauch-main pb-40">
        <div className="rauch-container">
          {title && (
            <div className="mb-12">
              <h1 className="rauch-article-title">{title}</h1>
            </div>
          )}
          {children}
        </div>
      </main>
    </div>
  )
} 