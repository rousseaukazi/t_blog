import { NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { prisma } from '@/lib/prisma'
import { aiTools } from '@/lib/data'

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
})

function selectToolsForRole(jobRole: string): typeof aiTools {
  // Simple logic to select diverse tools - in production, this could be more sophisticated
  const shuffled = [...aiTools].sort(() => 0.5 - Math.random())
  const selected: typeof aiTools = []
  const categories = new Set<string>()
  
  for (const tool of shuffled) {
    if (selected.length >= 3) break
    if (!categories.has(tool.category)) {
      selected.push(tool)
      categories.add(tool.category)
    }
  }
  
  // If we don't have 3 tools yet, fill with remaining
  while (selected.length < 3 && shuffled.length > selected.length) {
    const tool = shuffled.find(t => !selected.includes(t))
    if (tool) selected.push(tool)
  }
  
  return selected
}

export async function POST(request: Request) {
  try {
    const { jobRole } = await request.json()
    
    if (!jobRole) {
      return NextResponse.json({ error: 'Job role is required' }, { status: 400 })
    }
    
    // Check if blog already exists
    const existingBlog = await prisma.blogPost.findUnique({
      where: { jobRole }
    })
    
    if (existingBlog) {
      return NextResponse.json(existingBlog)
    }
    
    // Select 3 tools for this role
    const selectedTools = selectToolsForRole(jobRole)
    
    // Generate blog content using Claude
    const prompt = `You are an expert content writer creating highly engaging blog posts about AI tools for specific job roles. 

Write a blog post for "${jobRole}" featuring these 3 AI tools:

${selectedTools.map((tool, index) => `
${index + 1}. ${tool.name}
Category: ${tool.category}
Description: ${tool.description}
Best for: ${tool.bestFor.join(', ')}
`).join('\n')}

Guidelines:
- Create a highly entertaining and engaging blog post
- Focus on practical AI applications for ${jobRole}
- Include specific, actionable prompts they can use right away for each tool
- Focus more on the outcome and artifact, less on the model/company name
- Have the model/company name be a byline/attribution
- Make it conversational and relatable
- Include real-world scenarios specific to ${jobRole}
- Each tool section should have at least 2 specific prompt examples
- Make the reader excited to try these tools immediately

Structure:
1. Catchy title that speaks directly to ${jobRole} pain points
2. Hook introduction that resonates with their daily challenges
3. For each tool:
   - What amazing outcome they can achieve
   - Specific scenario where they'd use it
   - 2-3 exact prompts they can copy and use
   - Quick tip for best results
4. Inspiring conclusion that motivates action

Write in Markdown format. Be creative, practical, and conversion-focused.`

    const message = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 4000,
      temperature: 0.7,
      messages: [
        {
          role: 'user',
          content: prompt
        }
      ]
    })
    
    const content = message.content[0].type === 'text' ? message.content[0].text : ''
    
    // Extract title from content (assuming first # heading is the title)
    const titleMatch = content.match(/^#\s+(.+)$/m)
    const title = titleMatch ? titleMatch[1] : `AI Tools for ${jobRole}`
    
    // Save to database
    const blogPost = await prisma.blogPost.create({
      data: {
        jobRole,
        title,
        content
      }
    })
    
    return NextResponse.json(blogPost)
  } catch (error) {
    console.error('Error generating blog post:', error)
    return NextResponse.json({ error: 'Failed to generate blog post' }, { status: 500 })
  }
} 