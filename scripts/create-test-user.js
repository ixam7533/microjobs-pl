const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcrypt')
const prisma = new PrismaClient()

async function createTestUser() {
  console.log('🧪 Tworzenie użytkownika testowego...')
  
  const email = 'test@example.com'
  const password = 'test123' // proste hasło do testów
  const hashedPassword = await bcrypt.hash(password, 10)
  
  try {
    // Sprawdź czy użytkownik już istnieje
    const existingUser = await prisma.user.findUnique({
      where: { email }
    })
    
    if (existingUser) {
      // Zaktualizuj hasło
      await prisma.user.update({
        where: { email },
        data: {
          hash: hashedPassword,
          confirmed: true,
          name: 'Test User'
        }
      })
      console.log(`✅ Zaktualizowano użytkownika testowego: ${email}`)
    } else {
      // Utwórz nowego użytkownika
      await prisma.user.create({
        data: {
          email,
          hash: hashedPassword,
          confirmed: true,
          name: 'Test User'
        }
      })
      console.log(`✅ Utworzono użytkownika testowego: ${email}`)
    }
    
    console.log(`📧 Email: ${email}`)
    console.log(`🔑 Hasło: ${password}`)
    console.log('\n🚀 Teraz możesz się zalogować i testować czat!')
    
  } catch (error) {
    console.error('❌ Błąd:', error)
  } finally {
    await prisma.$disconnect()
  }
}

createTestUser()
