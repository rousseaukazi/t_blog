'use client'

import { useState, useEffect } from 'react'
import { SearchableDropdown } from '@/components/SearchableDropdown'
import { MarkdownRenderer } from '@/components/MarkdownRenderer'
import { RauchLayout } from '@/components/RauchLayout'
import { jobRoles } from '@/lib/data'
import { Loader2, Sparkles } from 'lucide-react'

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
  const [blogPost, setBlogPost] = useState<BlogPost | null>(null)
  const [loading, setLoading] = useState(false)
  const [generating, setGenerating] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (selectedRole) {
      fetchBlogPost(selectedRole)
    } else {
      setBlogPost(null)
      setError(null)
    }
  }, [selectedRole])

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

  const generateBlogPost = async (forceNew: boolean = false) => {
    setGenerating(true)
    setError(null)
    try {
      const response = await fetch(`/api/blog/generate${forceNew ? '?forceNew=1' : ''}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ jobRole: selectedRole }),
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
    setBlogPost(null)
    setError(null)
  }

  return (
    <RauchLayout 
      description="Discover how AI can transform your work"
      onBrandClick={handleBrandClick}
    >
      {/* Job Role Selection */}
      <div className="mb-12">
        <div className="mb-6">
          <label htmlFor="job-role" className="block text-lg font-medium text-gray-900 mb-3">
            Select your job role
          </label>
          <SearchableDropdown
            options={jobRoles}
            value={selectedRole}
            onChange={setSelectedRole}
            placeholder="Choose a job role to explore AI tools..."
          />
          <p className="mt-2 text-sm text-gray-600">
            Pick from {jobRoles.length} of the most common jobs in the US
          </p>
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
                  <span>Generated for {selectedRole}</span>
                  <span className="mx-2">•</span>
                  <span>{new Date(blogPost.createdAt).toLocaleDateString()}</span>
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
                    onClick={() => generateBlogPost(true)}
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
            <div className="text-center py-20">
              <div className="mb-8">
                <Sparkles className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                  No guide yet for {selectedRole}
                </h2>
                <p className="text-gray-600 mb-8 max-w-md mx-auto">
                  Generate a personalized AI tools guide for this role.
                </p>
              </div>
              
              {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg max-w-md mx-auto">
                  <p className="text-red-700 text-sm">{error}</p>
                </div>
              )}
              
              <button
                onClick={() => generateBlogPost()}
                disabled={generating}
                className="rauch-button rauch-button-primary rauch-button-large disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {generating ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4 mr-2" />
                    Generate Guide
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      )}

      {/* Empty State */}
      {!selectedRole && (
        <div className="text-center py-20">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            Select a job role to get started
          </h2>
          <p className="text-gray-600 max-w-md mx-auto">
            Choose from our list of common job roles to DISCOVER AI tools that can help you work smarter.
          </p>
        </div>
      )}
    </RauchLayout>
  )
}
