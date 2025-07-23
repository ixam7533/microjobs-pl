// scripts/update-user-limits.js
const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function updateUserLimits() {
  try {
    // Zaktualizuj użytkownika do nowego limitu 3 promowań
    const user = await prisma.user.update({
      where: { email: 'bibleversememory7@gmail.com' },
      data: {
        promotionsLimit: 3,
        promotionsUsed: 0 // zresetuj wykorzystane promowania
      }
    })

    console.log('✅ Zaktualizowano użytkownika:', user.email)
    console.log('🔄 Nowy limit promowań:', user.promotionsLimit)
    console.log('🔄 Zresetowano wykorzystane promowania:', user.promotionsUsed)

    // Sprawdź wszystkich użytkowników z subskrypcjami i zaktualizuj ich limity
    const allProUsers = await prisma.user.findMany({
      where: {
        subscriptionType: { in: ['PRO', 'PRO_PLUS'] }
      }
    })

    for (const user of allProUsers) {
      const newLimit = user.subscriptionType === 'PRO' ? 0 : 3 // PRO ma 0 (płatne), PRO+ ma 3 darmowe promowania
      
      await prisma.user.update({
        where: { id: user.id },
        data: {
          promotionsLimit: newLimit
        }
      })
      
      console.log(`✅ Zaktualizowano ${user.email} (${user.subscriptionType}) -> limit: ${newLimit}`)
    }

  } catch (error) {
    console.error('❌ Błąd:', error)
  } finally {
    await prisma.$disconnect()
  }
}

updateUserLimits()
