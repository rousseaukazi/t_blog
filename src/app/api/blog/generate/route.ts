import { NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { aiTools } from '@/lib/data'
import { blogCache, BlogPost } from '@/lib/cache'

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

    // Check if API key exists
    const apiKey = process.env.ANTHROPIC_API_KEY
    if (!apiKey) {
      console.error('ANTHROPIC_API_KEY is not set')
      return NextResponse.json({ 
        error: 'Anthropic API key is not configured. Please set the ANTHROPIC_API_KEY environment variable.' 
      }, { status: 500 })
    }

    if (!apiKey.startsWith('sk-ant-')) {
      console.error('Invalid API key format')
      return NextResponse.json({ 
        error: 'Invalid Anthropic API key format.' 
      }, { status: 500 })
    }
    
    // Determine if caller wants a fresh blog (skip cache)
    const url = new URL(request.url)
    const forceNew = url.searchParams.get('forceNew') === '1'

    // Return cached blog unless forceNew has been requested
    if (!forceNew) {
      const existingBlog = blogCache.get(jobRole)
      if (existingBlog) {
        return NextResponse.json(existingBlog)
      }
    }
    
    // Check if caller wants streaming response
    const streamWanted = url.searchParams.get('stream') === '1'

    // Select 3 tools for this role
    const selectedTools = selectToolsForRole(jobRole)

    // Initialize Anthropic client
    const anthropic = new Anthropic({
      apiKey: apiKey,
    })
    
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

    if (streamWanted) {
      const stream = new ReadableStream({
        async start(controller) {
          try {
            const msgStream = await anthropic.messages.create({
              model: 'claude-3-5-sonnet-20241022',
              max_tokens: 4000,
              temperature: 0.7,
              stream: true,
              messages: [
                {
                  role: 'user',
                  content: prompt,
                },
              ],
            })

            for await (const chunk of msgStream) {
              // We only care about text deltas
              if ((chunk as any).type === 'content_block_delta' && (chunk as any).delta?.text) {
                controller.enqueue((chunk as any).delta.text)
              }
            }
            controller.close()
          } catch (err) {
            controller.error(err)
          }
        },
      })

      return new Response(stream, {
        headers: {
          'Content-Type': 'text/plain; charset=utf-8',
          'Cache-Control': 'no-cache',
          'Transfer-Encoding': 'chunked',
        },
      })
    }

    // Non-streaming path
    const message = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 4000,
      temperature: 0.7,
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
    })
    
    const content = message.content[0].type === 'text' ? message.content[0].text : ''
    
    // Extract title from content (assuming first # heading is the title)
    const titleMatch = content.match(/^#\s+(.+)$/m)
    const title = titleMatch ? titleMatch[1] : `AI Tools for ${jobRole}`
    
    // Create blog post object
    const blogPost: BlogPost = {
      id: Date.now().toString(),
      jobRole,
      title,
      content,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    
    // Store in cache
    blogCache.set(jobRole, blogPost)
    
    return NextResponse.json(blogPost)
  } catch (error) {
    console.error('Error generating blog post:', error)
    
    // More specific error handling
    if (error instanceof Error) {
      if (error.message.includes('authentication')) {
        return NextResponse.json({ 
          error: 'Authentication failed. Please check your Anthropic API key.' 
        }, { status: 401 })
      }
      if (error.message.includes('rate limit')) {
        return NextResponse.json({ 
          error: 'Rate limit exceeded. Please try again later.' 
        }, { status: 429 })
      }
    }
    
    return NextResponse.json({ 
      error: 'Failed to generate blog post. Please try again.' 
    }, { status: 500 })
  }
} 