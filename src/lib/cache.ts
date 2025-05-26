// In-memory storage for generated blogs (will reset on deployment)
// In production, this should be replaced with a proper database
export const blogCache = new Map<string, any>()

export interface BlogPost {
  id: string
  jobRole: string
  title: string
  content: string
  createdAt: string
  updatedAt: string
} 