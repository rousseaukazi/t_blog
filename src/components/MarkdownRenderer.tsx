'use client'

import React from 'react'

interface MarkdownRendererProps {
  content: string
}

export function MarkdownRenderer({ content }: MarkdownRendererProps) {
  const parseMarkdown = (markdown: string) => {
    const lines = markdown.split('\n')
    const elements: React.ReactNode[] = []
    let currentList: React.ReactNode[] = []
    let listType: 'ul' | 'ol' | null = null
    let inCodeBlock = false
    let codeBlockContent: string[] = []
    let currentParagraph: string[] = []

    const flushParagraph = () => {
      if (currentParagraph.length > 0) {
        const text = currentParagraph.join(' ').trim()
        if (text) {
          elements.push(
            <p key={elements.length} className="mb-4 text-gray-800 leading-relaxed">
              {parseInlineElements(text)}
            </p>
          )
        }
        currentParagraph = []
      }
    }

    const flushList = () => {
      if (currentList.length > 0 && listType) {
        const ListComponent = listType === 'ul' ? 'ul' : 'ol'
        elements.push(
          <ListComponent key={elements.length} className="my-4 ml-6 space-y-1">
            {currentList}
          </ListComponent>
        )
        currentList = []
        listType = null
      }
    }

    const flushCodeBlock = () => {
      if (codeBlockContent.length > 0) {
        elements.push(
          <pre 
            key={elements.length} 
            style={{
              backgroundColor: '#f3f4f6',
              color: '#991b1b',
              padding: '1rem',
              borderRadius: '0.5rem',
              margin: '1.5rem 0',
              overflowX: 'auto',
              border: '1px solid #d1d5db',
              fontFamily: 'ui-monospace, SFMono-Regular, "SF Mono", Consolas, "Liberation Mono", Menlo, monospace'
            }}
          >
            <code style={{ backgroundColor: 'transparent', color: '#991b1b', padding: '0' }}>
              {codeBlockContent.join('\n')}
            </code>
          </pre>
        )
        codeBlockContent = []
      }
    }

    lines.forEach((line, index) => {
      // Handle code blocks
      if (line.trim().startsWith('```')) {
        if (inCodeBlock) {
          flushCodeBlock()
          inCodeBlock = false
        } else {
          flushParagraph()
          flushList()
          inCodeBlock = true
        }
        return
      }

      if (inCodeBlock) {
        codeBlockContent.push(line)
        return
      }

      // Handle headers
      if (line.startsWith('# ')) {
        flushParagraph()
        flushList()
        elements.push(
          <h1 key={elements.length} className="text-4xl font-bold text-gray-900 mb-6 mt-8">
            {line.substring(2)}
          </h1>
        )
        return
      }

      if (line.startsWith('## ')) {
        flushParagraph()
        flushList()
        elements.push(
          <h2 key={elements.length} className="text-3xl font-bold text-gray-900 mb-4 mt-8">
            {line.substring(3)}
          </h2>
        )
        return
      }

      if (line.startsWith('### ')) {
        flushParagraph()
        flushList()
        elements.push(
          <h3 key={elements.length} className="text-2xl font-semibold text-gray-900 mb-3 mt-6">
            {line.substring(4)}
          </h3>
        )
        return
      }

      // Handle blockquotes
      if (line.startsWith('> ')) {
        flushParagraph()
        flushList()
        elements.push(
          <blockquote 
            key={elements.length} 
            style={{
              borderLeft: '4px solid #ef4444',
              paddingLeft: '1rem',
              margin: '1rem 0',
              color: '#991b1b',
              backgroundColor: '#f9fafb',
              padding: '0.75rem 1rem',
              borderRadius: '0 0.25rem 0.25rem 0',
              border: '1px solid #d1d5db'
            }}
          >
            {parseInlineElements(line.substring(2))}
          </blockquote>
        )
        return
      }

      // Handle lists
      const unorderedMatch = line.match(/^[\s]*[-*]\s+(.+)$/)
      const orderedMatch = line.match(/^[\s]*\d+\.\s+(.+)$/)

      if (unorderedMatch) {
        flushParagraph()
        if (listType !== 'ul') {
          flushList()
          listType = 'ul'
        }
        currentList.push(
          <li key={currentList.length} className="text-gray-800 leading-relaxed list-disc">
            {parseInlineElements(unorderedMatch[1])}
          </li>
        )
        return
      }

      if (orderedMatch) {
        flushParagraph()
        if (listType !== 'ol') {
          flushList()
          listType = 'ol'
        }
        currentList.push(
          <li key={currentList.length} className="text-gray-800 leading-relaxed list-decimal">
            {parseInlineElements(orderedMatch[1])}
          </li>
        )
        return
      }

      // Handle empty lines
      if (line.trim() === '') {
        flushParagraph()
        flushList()
        return
      }

      // Regular paragraph content
      flushList()
      currentParagraph.push(line)
    })

    // Flush any remaining content
    flushParagraph()
    flushList()
    flushCodeBlock()

    return elements
  }

  const parseInlineElements = (text: string): React.ReactNode => {
    // Handle inline code first
    const parts = text.split(/(`[^`]+`)/)
    
    return parts.map((part, index) => {
      if (part.startsWith('`') && part.endsWith('`')) {
        return (
          <code 
            key={index} 
            style={{
              backgroundColor: '#f3f4f6',
              color: '#991b1b',
              padding: '0.25rem 0.5rem',
              borderRadius: '0.25rem',
              fontSize: '0.875rem',
              fontFamily: 'ui-monospace, SFMono-Regular, "SF Mono", Consolas, "Liberation Mono", Menlo, monospace',
              fontWeight: '500'
            }}
          >
            {part.slice(1, -1)}
          </code>
        )
      }

      // Handle bold and italic
      let processed = part
      const elements: React.ReactNode[] = []
      let lastIndex = 0

      // Bold text
      const boldRegex = /\*\*(.*?)\*\*/g
      let match
      while ((match = boldRegex.exec(part)) !== null) {
        if (match.index > lastIndex) {
          elements.push(processed.slice(lastIndex, match.index))
        }
        elements.push(
          <strong key={`bold-${match.index}`} className="font-bold text-gray-900">
            {match[1]}
          </strong>
        )
        lastIndex = match.index + match[0].length
      }

      if (lastIndex < part.length) {
        elements.push(part.slice(lastIndex))
      }

      return elements.length > 0 ? elements : part
    })
  }

  return (
    <div className="prose prose-lg max-w-none">
      {parseMarkdown(content)}
    </div>
  )
} 