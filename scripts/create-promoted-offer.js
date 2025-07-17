// scripts/create-promoted-offer.js
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function createPromotedOffer() {
  try {
    // Sprawdź czy istnieje użytkownik
    let user = await prisma.user.findFirst({
      where: { email: { contains: '@' } }
    })

    // Jeśli nie ma użytkownika, utwórz przykładowego
    if (!user) {
      user = await prisma.user.create({
        data: {
          email: 'jan.kowalski@example.com',
          name: 'Jan Kowalski',
          confirmed: true,
          subscriptionType: 'PRO',
          subscriptionStart: new Date(),
          subscriptionEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 dni
          promotionsUsed: 0,
          promotionsLimit: 1
        }
      })
      console.log('✅ Utworzono użytkownika PRO:', user.email)
    }

    // Sprawdź czy użytkownik ma aktywną subskrypcję
    if (!user.subscriptionType || !user.subscriptionEnd || user.subscriptionEnd < new Date()) {
      await prisma.user.update({
        where: { id: user.id },
        data: {
          subscriptionType: 'PRO',
          subscriptionStart: new Date(),
          subscriptionEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
          promotionsUsed: 0,
          promotionsLimit: 1
        }
      })
      console.log('✅ Zaktualizowano subskrypcję PRO dla użytkownika')
    }

    // Utwórz promowane ogłoszenie
    const promotedOffer = await prisma.offer.create({
      data: {
        title: '🏆 Szukam grafika do projektu e-commerce - PILNE!',
        category: 'IT i technologia',
        description: `Witam! 

Szukam doświadczonego grafika do współpracy przy projekcie sklepu internetowego. 

📋 ZAKRES PRAC:
• Projekt logo i identyfikacji wizualnej
• Grafiki produktowe i banery
• Projekt layoutu strony głównej
• Materiały marketingowe (ulotki, plakaty)
• Optymalizacja grafik pod SEO

💰 OFERUJĘ:
• Konkurencyjne wynagrodzenie (100-150zł/godz)
• Elastyczne godziny pracy
• Możliwość pracy zdalnej
• Długoterminowa współpraca
• Szybka płatność (przelew w 24h)

🎯 WYMAGANIA:
• Min. 2 lata doświadczenia
• Znajomość Adobe Creative Suite
• Portfolio z podobnymi projektami
• Kreatywność i terminowość
• Komunikatywność

🚀 DLACZEGO WARTO:
• Praca z dynamicznym startupem
• Możliwość rozwoju kariery
• Przyjazna atmosfera
• Elastyczny grafik

Jeśli jesteś zainteresowany/a, skontaktuj się ze mną! Czekam na Twoje CV i portfolio.`,
        location: 'Warszawa, mazowieckie',
        contactName: 'Jan Kowalski',
        contactEmail: 'jan.kowalski@example.com',
        contactPhone: '+48 123 456 789',
        price: 125.00,
        offerType: 'szukam_pracownika',
        promoted: true,
        promotedUntil: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 dni
        ownerId: user.id
      }
    })

    // Dodaj użycie promocji
    await prisma.promotionUsage.create({
      data: {
        userId: user.id,
        offerId: promotedOffer.id
      }
    })

    // Zaktualizuj licznik promocji użytkownika
    await prisma.user.update({
      where: { id: user.id },
      data: {
        promotionsUsed: user.promotionsUsed + 1
      }
    })

    console.log('✅ Utworzono promowane ogłoszenie:', promotedOffer.title)
    console.log('🎯 ID ogłoszenia:', promotedOffer.id)
    console.log('⭐ Promocja aktywna do:', promotedOffer.promotedUntil)

    // Utwórz jeszcze kilka zwykłych ogłoszeń dla porównania
    const regularOffers = [
      {
        title: 'Sprzątanie domów i mieszkań',
        category: 'Dom i ogród',
        description: 'Oferuję profesjonalne sprzątanie domów i mieszkań. Doświadczenie 5 lat, własne środki czyszczące.',
        location: 'Kraków, małopolskie',
        contactName: 'Anna Nowak',
        contactEmail: 'anna.nowak@example.com',
        price: 25.00,
        offerType: 'szukam_pracy'
      },
      {
        title: 'Naprawa komputerów i laptopów',
        category: 'IT i technologia',
        description: 'Serwis komputerów, instalacja systemów, odzyskiwanie danych. Dojazd do klienta.',
        location: 'Wrocław, dolnośląskie',
        contactName: 'Piotr Wiśniewski',
        contactEmail: 'piotr.wisniewski@example.com',
        price: 80.00,
        offerType: 'szukam_pracy'
      },
      {
        title: 'Korepetycje matematyki - liceum',
        category: 'Edukacja',
        description: 'Korepetycje z matematyki dla uczniów liceum. Przygotowanie do matury.',
        location: 'Gdańsk, pomorskie',
        contactName: 'Magdalena Kowalczyk',
        contactEmail: 'magdalena.kowalczyk@example.com',
        price: 40.00,
        offerType: 'szukam_pracy'
      }
    ]

    // Utwórz zwykłe ogłoszenia
    let regularUser = await prisma.user.findFirst({
      where: { 
        email: { not: user.email }
      }
    })

    if (!regularUser) {
      regularUser = await prisma.user.create({
        data: {
          email: 'regular.user@example.com',
          name: 'Zwykły Użytkownik',
          confirmed: true
        }
      })
    }

    for (const offerData of regularOffers) {
      await prisma.offer.create({
        data: {
          ...offerData,
          ownerId: regularUser.id
        }
      })
    }

    console.log('✅ Utworzono 3 zwykłe ogłoszenia dla porównania')

    console.log('\n🎉 GOTOWE! Możesz teraz sprawdzić jak wyglądają promowane ogłoszenia na stronie głównej.')
    console.log('💡 Promowane ogłoszenie będzie wyświetlane na górze listy ze złotą ramką i gwiazdką.')

  } catch (error) {
    console.error('❌ Błąd:', error)
  } finally {
    await prisma.$disconnect()
  }
}

createPromotedOffer()
