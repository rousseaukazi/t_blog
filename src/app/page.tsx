'use client'

import React, { useState, useEffect } from 'react'
import { MarkdownRenderer } from '@/components/MarkdownRenderer'
import { RauchLayout } from '@/components/RauchLayout'
import { Loader2 } from 'lucide-react'

interface BlogPost {
  id: string
  jobRole: string
  title: string
  content: string
  createdAt: string
  updatedAt: string
}

export default function Home() {
  const [selectedRole, setSelectedRole] = useState<string>('')
  const [inputValue, setInputValue] = useState<string>('')
  const [blogPost, setBlogPost] = useState<BlogPost | null>(null)
  const [loading, setLoading] = useState(false)
  const [generating, setGenerating] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Lock the page scroll when no role is selected (landing state)
  useEffect(() => {
    if (!selectedRole) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'auto'
    }

    // Cleanup on unmount
    return () => {
      document.body.style.overflow = 'auto'
    }
  }, [selectedRole])

  useEffect(() => {
    if (selectedRole) {
      fetchBlogPost(selectedRole)
    } else {
      setBlogPost(null)
      setError(null)
    }
  }, [selectedRole])

  // Auto-generate a guide if none exists after fetching
  useEffect(() => {
    if (selectedRole && !loading && !generating && !blogPost && !error) {
      generateBlogPost(selectedRole)
    }
  }, [selectedRole, loading, generating, blogPost, error])

  const fetchBlogPost = async (role: string) => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch(`/api/blog/${encodeURIComponent(role)}`)
      if (response.ok) {
        const data = await response.json()
        setBlogPost(data)
      } else if (response.status === 404) {
        setBlogPost(null)
      } else {
        throw new Error('Failed to fetch blog post')
      }
    } catch (err) {
      setError('Failed to load blog post')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const generateBlogPost = async (role: string, forceNew: boolean = false) => {
    setGenerating(true)
    setError(null)
    try {
      const response = await fetch(`/api/blog/generate${forceNew ? '?forceNew=1' : ''}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ jobRole: role }),
      })
      
      if (!response.ok) {
        throw new Error('Failed to generate blog post')
      }
      
      const data = await response.json()
      setBlogPost(data)
    } catch (err) {
      setError('Failed to generate blog post. Please make sure you have set up your Anthropic API key.')
      console.error(err)
    } finally {
      setGenerating(false)
    }
  }

  // Reset the page to its pristine state when the brand logo is clicked
  const handleBrandClick = () => {
    setSelectedRole('')
    setInputValue('')
    setBlogPost(null)
    setError(null)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!inputValue.trim()) return
    const role = inputValue.trim()
    setSelectedRole(role)
    generateBlogPost(role)
  }

  const formatDate = (isoDate: string) => {
    const date = new Date(isoDate)
    const day = date.getDate()
    const suffix = (day % 10 === 1 && day !== 11) ? 'st'
      : (day % 10 === 2 && day !== 12) ? 'nd'
      : (day % 10 === 3 && day !== 13) ? 'rd'
      : 'th'
    const month = date.toLocaleString('default', { month: 'long' })
    const year = date.getFullYear()
    return `${month} ${day}${suffix}, ${year}`
  }

  return (
    <RauchLayout 
      description="Discover how AI can transform your work"
      onBrandClick={handleBrandClick}
    >
      {/* Job Role Selection */}
      <div
        className={
          // When no role is selected, center the dropdown prominently on the page
          !selectedRole
            ? "flex flex-col items-center justify-center min-h-[calc(100vh-120px)]"
            : "mb-12"
        }
      >
        <div className="mb-6 w-full mx-auto max-w-xl">
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Describe your job role and hit Enter..."
              disabled={!!selectedRole}
              className="w-full border-b-4 border-gray-900 bg-transparent text-3xl md:text-4xl leading-tight placeholder:text-gray-500 placeholder:text-xl md:placeholder:text-2xl focus:outline-none focus:ring-0 pb-2 disabled:cursor-not-allowed disabled:opacity-50"
            />
          </form>
        </div>
      </div>

      {/* Content Area */}
      {selectedRole && (
        <div className="border-t border-gray-200 pt-12">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <Loader2 className="h-6 w-6 animate-spin text-gray-600 mb-4" />
              <p className="text-gray-600">Loading...</p>
            </div>
          ) : blogPost ? (
            <article className="rauch-article">
              {/* Article Header */}
              <div className="mb-8">
                <h1 className="rauch-article-title">
                  {blogPost.title}
                </h1>
                <div className="rauch-article-meta">
                  <span>{formatDate(blogPost.createdAt)}</span>
                </div>
              </div>
              
              {/* Article Content */}
              <div className="rauch-content">
                <MarkdownRenderer content={blogPost.content} />
              </div>
              
              {/* Actions */}
              <div className="mt-12 pt-8 border-t border-gray-200">
                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={() => setSelectedRole('')}
                    className="rauch-button"
                  >
                    Explore Other Roles
                  </button>
                  <button
                    onClick={() => generateBlogPost(selectedRole, true)}
                    disabled={generating}
                    className="rauch-button rauch-button-primary disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {generating ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        Generating...
                      </>
                    ) : (
                      'Generate New Guide'
                    )}
                  </button>
                </div>
              </div>
            </article>
          ) : (
            <div className="flex flex-col items-center justify-center min-h-[50vh]">
              {generating ? (
                <>
                  {/* Animated infinity-loop loader */}
                  <svg width="280" height="120" viewBox="0 0 140 60" fill="none" xmlns="http://www.w3.org/2000/svg" className="mb-8">
                    <defs>
                      <linearGradient id="grad" x1="0" y1="0" x2="1" y2="1">
                        <stop offset="0%" stopColor="#0F172A" />
                        <stop offset="100%" stopColor="#475569" />
                      </linearGradient>
                    </defs>
                    <path id="infinity" d="M20 30c10-20 30-20 40 0s30 20 40 0" stroke="url(#grad)" strokeWidth="6" strokeLinecap="round" fill="none" />
                    <style>{`
                      #infinity {
                        stroke-dasharray: 180 60;
                        stroke-dashoffset: 0;
                        animation: dash 2s ease-in-out infinite;
                      }
                      @keyframes dash {
                        0%   { stroke-dashoffset: 0; }
                        50%  { stroke-dashoffset: -240; }
                        100% { stroke-dashoffset: -480; }
                      }
                    `}</style>
                  </svg>
                  <p className="text-gray-600 text-lg">Crafting your personalized guide...</p>
                </>
              ) : error ? (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg max-w-md mx-auto">
                  <p className="text-red-700 text-sm">{error}</p>
                </div>
              ) : null}
            </div>
          )}
        </div>
      )}
    </RauchLayout>
  )
}
