// scripts/reset-password.js
const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcrypt')

const prisma = new PrismaClient()

async function resetPassword() {
  try {
    const email = 'bibleversememory7@gmail.com'
    const newPassword = 'testpassword123'
    
    console.log('🔐 Resetowanie hasła dla:', email)
    
    // Zahashuj nowe hasło
    const hashedPassword = await bcrypt.hash(newPassword, 12)
    
    // Aktualizuj użytkownika
    const user = await prisma.user.update({
      where: { email },
      data: {
        hash: hashedPassword,
        confirmed: true // Upewnij się, że konto jest potwierdzone
      }
    })
    
    console.log('✅ Hasło zostało zresetowane!')
    console.log('📧 Email:', email)
    console.log('🔑 Nowe hasło:', newPassword)
    console.log('✅ Konto potwierdzone:', user.confirmed)
    
  } catch (error) {
    console.error('❌ Błąd podczas resetowania hasła:', error)
  } finally {
    await prisma.$disconnect()
  }
}

resetPassword()
