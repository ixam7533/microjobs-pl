// scripts/set-admin.js
const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function setAdmin() {
  try {
    const adminEmail = 'microjobsj7@gmail.com'
    
    console.log(`Setting admin privileges for: ${adminEmail}`)
    
    const user = await prisma.user.upsert({
      where: { email: adminEmail },
      update: { isAdmin: true },
      create: {
        email: adminEmail,
        name: 'Admin',
        confirmed: true,
        isAdmin: true,
        promotionsUsed: 0,
        emailReminder: true
      }
    })
    
    console.log('✅ Admin privileges set successfully!')
    console.log(`User ID: ${user.id}`)
    console.log(`Email: ${user.email}`)
    console.log(`Admin: ${user.isAdmin}`)
    
  } catch (error) {
    console.error('❌ Error setting admin privileges:', error)
  } finally {
    await prisma.$disconnect()
  }
}

setAdmin()
