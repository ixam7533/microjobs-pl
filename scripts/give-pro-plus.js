// scripts/give-pro-plus.js
const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function giveProPlus() {
  try {
    const email = 'bibleversememory7@gmail.com'
    
    // Oblicz daty
    const now = new Date()
    const endDate = new Date(now)
    endDate.setMonth(endDate.getMonth() + 1) // Dodaj miesiąc
    
    console.log('🚀 Nadawanie subskrypcji PRO+ użytkownikowi:', email)
    console.log('📅 Data rozpoczęcia:', now.toLocaleString('pl-PL'))
    console.log('📅 Data zakończenia:', endDate.toLocaleString('pl-PL'))
    
    // Znajdź użytkownika
    const user = await prisma.user.findUnique({
      where: { email }
    })
    
    if (!user) {
      console.log('❌ Nie znaleziono użytkownika:', email)
      return
    }
    
    // Aktualizuj użytkownika
    const updatedUser = await prisma.user.update({
      where: { email },
      data: {
        subscriptionType: 'PRO_PLUS',
        subscriptionEnd: endDate,
        promotionsLimit: 3,
        promotionsUsed: 0 // Resetuj wykorzystane promowania
      }
    })
    
    // Utwórz rekord subskrypcji
    const subscription = await prisma.subscription.create({
      data: {
        userId: user.id,
        type: 'PRO_PLUS',
        status: 'ACTIVE',
        startDate: now,
        endDate: endDate,
        autoRenew: false, // Wyłącz automatyczne odnawianie dla testowej subskrypcji
        paymentId: 'ADMIN_GRANT_TEST' // Oznacz jako nadane przez admina
      }
    })
    
    console.log('✅ Pomyślnie nadano subskrypcję PRO+!')
    console.log('🔹 Typ subskrypcji:', updatedUser.subscriptionType)
    console.log('🔹 Koniec subskrypcji:', updatedUser.subscriptionEnd?.toLocaleString('pl-PL'))
    console.log('🔹 Limit promowań:', updatedUser.promotionsLimit)
    console.log('🔹 Wykorzystane promowania:', updatedUser.promotionsUsed)
    console.log('🔹 ID subskrypcji:', subscription.id)
    
  } catch (error) {
    console.error('❌ Błąd podczas nadawania subskrypcji:', error)
  } finally {
    await prisma.$disconnect()
  }
}

giveProPlus()
