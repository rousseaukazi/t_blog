# AI Tools Blog Aggregator

An intelligent blog platform that generates personalized AI tool recommendations for different job roles using Claude Sonnet 3.5.

## Features

- 🔍 **Searchable Job Role Dropdown**: Browse and search through 50 of the most common jobs in the US
- 🤖 **AI-Generated Content**: Automatically generates engaging blog posts featuring 3 AI tools perfect for each role
- 💾 **Persistent Storage**: Stores generated blogs in a SQLite database for instant retrieval
- 🎨 **Beautiful UI**: Modern, responsive design with Tailwind CSS
- ⚡ **Fast Performance**: Built with Next.js 14 App Router for optimal performance

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database**: SQLite with Prisma ORM
- **AI**: Anthropic Claude Sonnet 3.5
- **UI Components**: Custom components with Lucide icons

## Prerequisites

- Node.js 18+ installed
- An Anthropic API key (get one at [console.anthropic.com](https://console.anthropic.com))

## Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd blog
```

2. Install dependencies:
```bash
npm install
```

3. Set up your environment variables:
   - Copy `.env.example` to `.env.local` (or create `.env.local` if it doesn't exist)
   - Add your Anthropic API key:
```env
ANTHROPIC_API_KEY=your-anthropic-api-key-here
```

4. Set up the database:
```bash
npx prisma db push
```

5. Run the development server:
```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser

## Usage

1. **Select a Job Role**: Use the searchable dropdown to choose from 50 common job roles
2. **View or Generate**: 
   - If a blog already exists for that role, it will display immediately
   - If not, click "Generate AI Tools Guide" to create a personalized blog post
3. **Read and Apply**: Each blog features:
   - 3 carefully selected AI tools
   - Practical use cases specific to the role
   - Copy-paste ready prompts
   - Tips for getting the best results

## Project Structure

```
blog/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   └── blog/
│   │   │       ├── [jobRole]/route.ts  # GET blog by role
│   │   │       └── generate/route.ts   # POST generate new blog
│   │   ├── page.tsx                    # Main page component
│   │   └── layout.tsx                  # Root layout
│   ├── components/
│   │   ├── SearchableDropdown.tsx      # Job role selector
│   │   └── MarkdownRenderer.tsx        # Blog content renderer
│   ├── lib/
│   │   ├── data.ts                     # Job roles and AI tools data
│   │   ├── prisma.ts                   # Prisma client instance
│   │   └── utils.ts                    # Utility functions
│   └── generated/
│       └── prisma/                     # Generated Prisma client
├── prisma/
│   ├── schema.prisma                   # Database schema
│   └── dev.db                          # SQLite database
└── package.json
```

## API Routes

### GET /api/blog/[jobRole]
Fetches an existing blog post for a specific job role.

### POST /api/blog/generate
Generates a new blog post for a job role using Claude Sonnet 3.5.

Request body:
```json
{
  "jobRole": "Software Developer"
}
```

## Database Schema

```prisma
model BlogPost {
  id        String   @id @default(cuid())
  jobRole   String   @unique
  title     String
  content   String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

## Customization

### Adding New Job Roles
Edit `src/lib/data.ts` and add to the `jobRoles` array.

### Adding New AI Tools
Edit `src/lib/data.ts` and add to the `aiTools` array with the required structure:
```typescript
{
  name: "Tool Name",
  category: "Category",
  description: "Description",
  bestFor: ["use case 1", "use case 2"]
}
```

### Modifying Blog Generation
Update the prompt in `src/app/api/blog/generate/route.ts` to change the blog structure or style.

## Deployment

This app can be deployed to any platform that supports Next.js:

### Vercel (Recommended)
1. Push your code to GitHub
2. Import the project in Vercel
3. Add your `ANTHROPIC_API_KEY` environment variable
4. Deploy

### Other Platforms
Follow the platform-specific instructions for deploying Next.js apps, ensuring you:
- Set the `ANTHROPIC_API_KEY` environment variable
- Run `npx prisma generate` before building
- Use a persistent storage solution for the SQLite database

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
