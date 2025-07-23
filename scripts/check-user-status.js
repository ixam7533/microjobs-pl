// scripts/check-user-status.js
const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function checkUserStatus() {
  try {
    // Sprawdź użytkownika bibleversememory7@gmail.com
    const user = await prisma.user.findUnique({
      where: { email: 'bibleversememory7@gmail.com' },
      include: {
        subscriptions: true
      }
    })

    if (user) {
      console.log('✅ Znaleziono użytkownika:', user.email)
      console.log('🔹 ID:', user.id)
      console.log('🔹 Subskrypcja:', user.subscriptionType || 'BRAK')
      console.log('🔹 Koniec subskrypcji:', user.subscriptionEnd?.toLocaleString('pl-PL') || 'BRAK')
      console.log('🔹 Wykorzystane promowania:', user.promotionsUsed)
      console.log('🔹 Limit promowań:', user.promotionsLimit)
      
      if (user.subscriptions.length > 0) {
        console.log('\n📋 Historia subskrypcji:')
        user.subscriptions.forEach((sub, index) => {
          console.log(`  ${index + 1}. ${sub.type} - ${sub.status} (${sub.startDate.toLocaleDateString('pl-PL')} - ${sub.endDate.toLocaleDateString('pl-PL')})`)
        })
      }
    } else {
      console.log('❌ Nie znaleziono użytkownika bibleversememory7@gmail.com')
    }

    // Sprawdź wszystkich użytkowników z subskrypcjami
    const usersWithSubs = await prisma.user.findMany({
      where: {
        OR: [
          { subscriptionType: { not: null } },
          { subscriptionEnd: { not: null } }
        ]
      }
    })

    console.log(`\n📊 Użytkownicy z subskrypcjami (${usersWithSubs.length}):`)
    usersWithSubs.forEach(user => {
      console.log(`  • ${user.email} - ${user.subscriptionType} (do: ${user.subscriptionEnd?.toLocaleDateString('pl-PL') || 'brak daty'})`)
    })

  } catch (error) {
    console.error('❌ Błąd:', error)
  } finally {
    await prisma.$disconnect()
  }
}

checkUserStatus()
