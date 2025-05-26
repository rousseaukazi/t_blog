const { PrismaClient } = require('@prisma/client')

async function setupDatabase() {
  const prisma = new PrismaClient()
  
  try {
    // Test the connection
    await prisma.$connect()
    console.log('Database connected successfully')
    
    // The database tables should be created automatically with Prisma
    console.log('Database setup complete')
  } catch (error) {
    console.error('Database setup failed:', error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

setupDatabase() 