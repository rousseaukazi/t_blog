'use client'

import { useState, useEffect } from 'react'
import { SearchableDropdown } from '@/components/SearchableDropdown'
import { MarkdownRenderer } from '@/components/MarkdownRenderer'
import { jobRoles } from '@/lib/data'
import { Loader2, Sparkles, ExternalLink } from 'lucide-react'

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

  const generateBlogPost = async () => {
    setGenerating(true)
    setError(null)
    try {
      const response = await fetch('/api/blog/generate', {
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">AI Tools for Every Job</h1>
              <p className="mt-2 text-gray-600">Discover how AI can transform your work</p>
            </div>
            <Sparkles className="h-8 w-8 text-blue-600" />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Search Section */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <div className="max-w-2xl mx-auto">
            <label htmlFor="job-role" className="block text-lg font-medium text-gray-700 mb-3">
              Select your job role
            </label>
            <SearchableDropdown
              options={jobRoles}
              value={selectedRole}
              onChange={setSelectedRole}
              placeholder="Choose a job role to explore AI tools..."
            />
            <p className="mt-3 text-sm text-gray-500">
              Pick from {jobRoles.length} of the most common jobs in the US
            </p>
          </div>
        </div>

        {/* Blog Content Section */}
        {selectedRole && (
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-20">
                <Loader2 className="h-8 w-8 animate-spin text-blue-600 mb-4" />
                <p className="text-gray-600">Loading blog post...</p>
              </div>
            ) : blogPost ? (
              <article className="p-8 lg:p-12">
                <div className="max-w-4xl mx-auto">
                  {/* Blog Title */}
                  <div className="mb-8 pb-6 border-b border-gray-200">
                    <h1 className="text-4xl font-bold text-gray-900 mb-3">
                      {blogPost.title}
                    </h1>
                    <div className="flex items-center text-sm text-gray-500">
                      <span>Generated for {selectedRole}</span>
                      <span className="mx-2">•</span>
                      <span>{new Date(blogPost.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                  
                  {/* Blog Content */}
                  <div className="blog-content">
                    <MarkdownRenderer content={blogPost.content} />
                  </div>
                  
                  {/* Call to Action */}
                  <div className="mt-12 pt-8 border-t border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6">
                    <div className="text-center">
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">
                        Ready to Transform Your Work?
                      </h3>
                      <p className="text-gray-600 mb-4">
                        Start using these AI tools today and experience the difference they can make in your daily workflow.
                      </p>
                      <div className="flex justify-center space-x-4">
                        <button
                          onClick={() => setSelectedRole('')}
                          className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                          Explore Other Roles
                        </button>
                        <button
                          onClick={() => generateBlogPost()}
                          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                          Generate New Guide
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </article>
            ) : (
              <div className="p-8 lg:p-12">
                <div className="max-w-2xl mx-auto text-center">
                  <div className="mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
                      <Sparkles className="h-8 w-8 text-blue-600" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">
                      No blog post yet for {selectedRole}
                    </h2>
                    <p className="text-gray-600 mb-8">
                      Click the button below to generate a personalized AI tools guide for this role.
                    </p>
                  </div>
                  
                  {error && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                      <p className="text-red-700 text-sm">{error}</p>
                    </div>
                  )}
                  
                  <button
                    onClick={generateBlogPost}
                    disabled={generating}
                    className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {generating ? (
                      <>
                        <Loader2 className="h-5 w-5 animate-spin mr-2" />
                        Generating blog post...
                      </>
                    ) : (
                      <>
                        <Sparkles className="h-5 w-5 mr-2" />
                        Generate AI Tools Guide
                      </>
                    )}
                  </button>
                  
                  <p className="mt-4 text-sm text-gray-500">
                    This will create a custom blog post featuring 3 AI tools perfect for {selectedRole}
                  </p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Empty State */}
        {!selectedRole && (
          <div className="bg-white rounded-lg shadow-lg p-12">
            <div className="max-w-2xl mx-auto text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
                <ExternalLink className="h-8 w-8 text-gray-400" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Select a job role to get started
              </h2>
              <p className="text-gray-600">
                Choose from our list of common job roles to discover AI tools that can help you work smarter, not harder.
              </p>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="mt-20 bg-white border-t">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <p className="text-center text-gray-500 text-sm">
            Powered by Claude Sonnet 3.5 • Discover AI tools that transform your work
          </p>
        </div>
      </footer>
    </div>
  )
}
