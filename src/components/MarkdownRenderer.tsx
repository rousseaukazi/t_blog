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
          // Check if this paragraph is a section header
          const sectionHeaderMatch = text.match(/^\*{1,2}\s*([^*]+?)\s*\*{1,2}$/)
          if (sectionHeaderMatch) {
            const content = sectionHeaderMatch[1].trim()
            if (content.toLowerCase().includes('perfect for') || 
                content.toLowerCase().includes('try these prompts') ||
                content.toLowerCase().includes('how to use') ||
                content.toLowerCase().includes('best practices') ||
                content.toLowerCase().includes('pro tip')) {
              elements.push(
                <p key={elements.length} className="mb-3 mt-6">
                  <strong className="text-lg font-semibold text-gray-900">
                    {content}
                  </strong>
                </p>
              )
              currentParagraph = []
              return
            }
          }
          
          elements.push(
            <p key={elements.length} className="mb-5 text-gray-900 leading-relaxed text-lg">
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
          <ListComponent key={elements.length} className="my-5 space-y-2" style={{ paddingLeft: '1.5rem' }}>
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
          <div key={elements.length} className="my-6">
            <pre
              style={{
                backgroundColor: '#f5f5f5',
                color: '#171717',
                padding: '1.5rem',
                borderRadius: '0.5rem',
                overflowX: 'auto',
                fontSize: '0.875rem',
                lineHeight: '1.7',
                fontFamily: 'SF Mono, Monaco, Inconsolata, Roboto Mono, monospace',
              }}
            >
              <code style={{ backgroundColor: 'transparent', color: '#171717', padding: '0' }}>
                {codeBlockContent.join('\n')}
              </code>
            </pre>
            <div className="flex justify-end mt-2">
              <button
                onClick={() => alert('Not implemented yet')}
                className="text-sm text-white bg-gray-900 hover:bg-gray-700 px-3 py-1.5 rounded"
              >
                Generate
              </button>
            </div>
          </div>
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

      // Check for section headers on their own line
      const lineHeaderMatch = line.trim().match(/^\*{1,2}\s*([^*]+?)\s*\*{1,2}$/)
      if (lineHeaderMatch) {
        const content = lineHeaderMatch[1].trim()
        if (content.toLowerCase().includes('perfect for') || 
            content.toLowerCase().includes('try these prompts') ||
            content.toLowerCase().includes('how to use') ||
            content.toLowerCase().includes('best practices') ||
            content.toLowerCase().includes('pro tip')) {
          flushParagraph()
          flushList()
          elements.push(
            <p key={elements.length} className="mb-3 mt-6">
              <strong className="text-lg font-semibold text-gray-900">
                {content}
              </strong>
            </p>
          )
          return
        }
      }

      // Skip H1 headers since title is already displayed
      if (line.startsWith('# ')) {
        flushParagraph()
        flushList()
        // Don't render H1 - title is already shown in article header
        return
      }

      if (line.startsWith('## ')) {
        flushParagraph()
        flushList()
        elements.push(
          <h2 key={elements.length} className="text-3xl font-semibold text-gray-900 mb-4 mt-12 leading-tight">
            {line.substring(3)}
          </h2>
        )
        return
      }

      if (line.startsWith('### ')) {
        flushParagraph()
        flushList()
        elements.push(
          <h3 key={elements.length} className="text-2xl font-medium text-gray-900 mb-3 mt-8 leading-tight">
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
              borderLeft: '4px solid #d4d4d4',
              paddingLeft: '1rem',
              margin: '2rem 0',
              color: '#525252',
              fontStyle: 'italic'
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
          <li key={currentList.length} className="text-gray-900 leading-relaxed text-lg list-disc" style={{ marginTop: '0.5rem', marginBottom: '0.5rem' }}>
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
          <li key={currentList.length} className="text-gray-900 leading-relaxed text-lg list-decimal" style={{ marginTop: '0.5rem', marginBottom: '0.5rem' }}>
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
    // Handle attribution text (single asterisks) not caught as section headers
    const attributionParts = text.split(/(\*[^*]+\*)/g)
    
    return attributionParts.map((part, index) => {
      if (part.startsWith('*') && part.endsWith('*') && part.length > 2) {
        const content = part.slice(1, -1).trim()
        
        // Handle inline Pro Tip section header
        if (/^pro tip/i.test(content)) {
          return (
            <strong key={index} className="text-lg font-semibold text-gray-900">
              {content}
            </strong>
          )
        }

        // Only handle attribution text like "Powered by ElevenLabs"
        return (
          <span key={index} className="text-sm text-gray-500 italic font-normal">
            {content}
          </span>
        )
      }

      // Handle inline code
      const codeParts = part.split(/(`[^`]+`)/)
      
      return codeParts.map((codePart, codeIndex) => {
        if (codePart.startsWith('`') && codePart.endsWith('`')) {
          return (
            <code 
              key={`${index}-${codeIndex}`} 
              style={{
                backgroundColor: '#f5f5f5',
                color: '#171717',
                padding: '0.25rem 0.375rem',
                borderRadius: '0.25rem',
                fontSize: '0.875rem',
                fontFamily: 'SF Mono, Monaco, Inconsolata, Roboto Mono, monospace',
                fontWeight: '500'
              }}
            >
              {codePart.slice(1, -1)}
            </code>
          )
        }

        // Handle bold text
        const boldParts = codePart.split(/(\*\*[^*]+\*\*)/g)
        
        return boldParts.map((boldPart, boldIndex) => {
          if (boldPart.startsWith('**') && boldPart.endsWith('**') && boldPart.length > 4) {
            const boldContent = boldPart.slice(2, -2).trim()
            
            // Special styling for Pro Tip header
            if (/^pro tip/i.test(boldContent)) {
              return (
                <strong key={`${index}-${codeIndex}-${boldIndex}`} className="text-lg font-semibold text-gray-900">
                  {boldContent}
                </strong>
              )
            }

            return (
              <strong key={`${index}-${codeIndex}-${boldIndex}`} className="font-semibold text-gray-900">
                {boldContent}
              </strong>
            )
          }
          
          return boldPart
        })
      })
    })
  }

  return (
    <div className="max-w-none">
      {parseMarkdown(content)}
    </div>
  )
} 