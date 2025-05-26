'use client'

import React from 'react'

interface MarkdownRendererProps {
  content: string
}

export function MarkdownRenderer({ content }: MarkdownRendererProps) {
  // Simple markdown to HTML converter
  const renderMarkdown = (markdown: string) => {
    let html = markdown
    
    // Headers
    html = html.replace(/^### (.*$)/gim, '<h3 className="text-xl font-semibold mt-6 mb-3">$1</h3>')
    html = html.replace(/^## (.*$)/gim, '<h2 className="text-2xl font-bold mt-8 mb-4">$1</h2>')
    html = html.replace(/^# (.*$)/gim, '<h1 className="text-3xl font-bold mb-6">$1</h1>')
    
    // Bold and italic
    html = html.replace(/\*\*\*(.*)\*\*\*/g, '<strong><em>$1</em></strong>')
    html = html.replace(/\*\*(.*)\*\*/g, '<strong className="font-semibold">$1</strong>')
    html = html.replace(/\*(.*)\*/g, '<em className="italic">$1</em>')
    
    // Lists
    html = html.replace(/^\* (.+)$/gim, '<li className="ml-4 mb-1 list-disc">$1</li>')
    html = html.replace(/^- (.+)$/gim, '<li className="ml-4 mb-1 list-disc">$1</li>')
    html = html.replace(/^\d+\. (.+)$/gim, '<li className="ml-4 mb-1 list-decimal">$1</li>')
    
    // Wrap consecutive list items in ul/ol tags
    html = html.replace(/(<li className="ml-4 mb-1 list-disc">.*<\/li>\n?)+/g, (match) => {
      return `<ul className="my-4 ml-4">${match}</ul>`
    })
    html = html.replace(/(<li className="ml-4 mb-1 list-decimal">.*<\/li>\n?)+/g, (match) => {
      return `<ol className="my-4 ml-4">${match}</ol>`
    })
    
    // Code blocks
    html = html.replace(/```(.*?)```/gs, '<pre className="bg-gray-100 p-4 rounded-lg my-4 overflow-x-auto"><code>$1</code></pre>')
    
    // Inline code
    html = html.replace(/`([^`]+)`/g, '<code className="bg-gray-100 px-1.5 py-0.5 rounded text-sm">$1</code>')
    
    // Blockquotes
    html = html.replace(/^> (.+)$/gim, '<blockquote className="border-l-4 border-gray-300 pl-4 my-4 italic">$1</blockquote>')
    
    // Paragraphs
    html = html.split('\n\n').map(paragraph => {
      if (paragraph.trim() && 
          !paragraph.includes('<h1') && 
          !paragraph.includes('<h2') && 
          !paragraph.includes('<h3') && 
          !paragraph.includes('<ul') && 
          !paragraph.includes('<ol') && 
          !paragraph.includes('<pre') &&
          !paragraph.includes('<blockquote')) {
        return `<p className="mb-4">${paragraph}</p>`
      }
      return paragraph
    }).join('\n')
    
    return html
  }
  
  return (
    <div 
      className="prose prose-gray max-w-none"
      dangerouslySetInnerHTML={{ __html: renderMarkdown(content) }}
    />
  )
} 