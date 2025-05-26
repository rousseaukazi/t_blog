import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ jobRole: string }> }
) {
  try {
    const { jobRole } = await params
    const decodedJobRole = decodeURIComponent(jobRole)
    
    const blogPost = await prisma.blogPost.findUnique({
      where: { jobRole: decodedJobRole }
    })
    
    if (!blogPost) {
      return NextResponse.json({ error: 'Blog post not found' }, { status: 404 })
    }
    
    return NextResponse.json(blogPost)
  } catch (error) {
    console.error('Error fetching blog post:', error)
    return NextResponse.json({ error: 'Failed to fetch blog post' }, { status: 500 })
  }
} 