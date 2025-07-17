// scripts/simple-promoted-offer.js
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  console.log('🚀 Rozpoczynam tworzenie promowanego ogłoszenia...')
  
  try {
    // Sprawdź połączenie z bazą danych
    await prisma.$connect()
    console.log('✅ Połączono z bazą danych')

    // Znajdź lub utwórz użytkownika z subskrypcją PRO
    let user = await prisma.user.upsert({
      where: { email: 'jan.kowalski@promojobs.pl' },
      update: {
        subscriptionType: 'PRO',
        subscriptionStart: new Date(),
        subscriptionEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        promotionsUsed: 0,
        promotionsLimit: 1
      },
      create: {
        email: 'jan.kowalski@promojobs.pl',
        name: 'Jan Kowalski',
        confirmed: true,
        subscriptionType: 'PRO',
        subscriptionStart: new Date(),
        subscriptionEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        promotionsUsed: 0,
        promotionsLimit: 1
      }
    })

    console.log('✅ Użytkownik PRO:', user.email)

    // Utwórz promowane ogłoszenie
    const offer = await prisma.offer.create({
      data: {
        title: '⭐ PILNE! Szukam grafika - atrakcyjne warunki!',
        category: 'IT i technologia',
        description: `🎨 SZUKAM GRAFIKA DO DŁUGOTERMINOWEJ WSPÓŁPRACY

💼 PROJEKT: E-commerce + branding
💰 STAWKA: 120-150 zł/godz
📍 LOKALIZACJA: Warszawa (możliwa praca zdalna)
⏰ START: Natychmiast

🔥 CO OFERUJEMY:
• Konkurencyjne wynagrodzenie
• Płatność w 24h
• Elastyczne godziny
• Nowoczesne narzędzia
• Przyjazny zespół

📋 TWOJE ZADANIA:
• Projekt logo i CI
• Grafiki produktowe
• Banery reklamowe
• Materiały print
• Optymalizacja web

✅ SZUKAMY KOGOŚ KTO:
• Ma min. 2 lata doświadczenia
• Zna Adobe Creative Suite
• Jest kreatywny i terminowy
• Posiada portfolio

💡 DLACZEGO MY:
• Startup o dużym potencjale
• Możliwość rozwoju
• Ciekawe wyzwania
• Stabilna współpraca

📞 Wyślij CV + portfolio już dziś!`,
        location: 'Warszawa, mazowieckie',
        contactName: 'Jan Kowalski',
        contactEmail: 'jan.kowalski@promojobs.pl',
        contactPhone: '+48 123 456 789',
        price: 135.00,
        offerType: 'szukam_pracownika',
        promoted: true,
        promotedUntil: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        ownerId: user.id
      }
    })

    console.log('✅ Promowane ogłoszenie utworzone:', offer.title)
    console.log('🆔 ID:', offer.id)
    console.log('⭐ Promocja do:', offer.promotedUntil.toLocaleString('pl-PL'))

    // Dodaj kilka zwykłych ogłoszeń
    await prisma.offer.createMany({
      data: [
        {
          title: 'Sprzątanie biur i domów',
          category: 'Dom i ogród',
          description: 'Oferuję profesjonalne sprzątanie. Własne środki.',
          location: 'Kraków, małopolskie',
          contactName: 'Anna Sprzątacz',
          contactEmail: 'anna@sprzatanie.pl',
          price: 25.00,
          offerType: 'szukam_pracy',
          ownerId: user.id
        },
        {
          title: 'Naprawa komputerów',
          category: 'IT i technologia',
          description: 'Serwis PC, instalacja, odzyskiwanie danych.',
          location: 'Wrocław, dolnośląskie',
          contactName: 'Piotr Serwis',
          contactEmail: 'piotr@serwis.pl',
          price: 80.00,
          offerType: 'szukam_pracy',
          ownerId: user.id
        }
      ]
    })

    console.log('✅ Dodano zwykłe ogłoszenia dla porównania')
    console.log('\n🎉 GOTOWE!')
    console.log('🌐 Zobacz rezultat na: http://localhost:3000')
    console.log('💎 Promowane ogłoszenie ma złotą ramkę i gwiazdkę!')

  } catch (error) {
    console.error('❌ Błąd:', error)
  } finally {
    await prisma.$disconnect()
  }
}

main()
