// List all offers and find "DO CHATU"
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function listAndCleanOffers() {
  try {
    console.log('=== Wszystkie ogłoszenia ===')
    
    const offers = await prisma.offer.findMany({
      select: {
        id: true,
        title: true,
        contactEmail: true
      },
      orderBy: { createdAt: 'desc' }
    })
    
    offers.forEach(offer => {
      console.log(`ID: ${offer.id} | Tytuł: ${offer.title} | Email: ${offer.contactEmail}`)
    })
    
    console.log(`\nLiczba ogłoszeń: ${offers.length}`)
    
    // Znajdź ogłoszenie "DO CHATU"
    const chatOffer = offers.find(offer => 
      offer.title.toUpperCase().includes('DO CHATU') || 
      offer.title.toUpperCase().includes('CHAT')
    )
    
    if (chatOffer) {
      console.log(`\n✅ Znalezione ogłoszenie DO CHATU: ID ${chatOffer.id}`)
      
      // Usuń wszystkie inne ogłoszenia
      const offersToDelete = offers.filter(offer => offer.id !== chatOffer.id)
      
      console.log(`\n🗑️ Usuwam ${offersToDelete.length} ogłoszeń...`)
      
      for (const offer of offersToDelete) {
        console.log(`Usuwam: ${offer.title} (ID: ${offer.id})`)
        await prisma.offer.delete({ where: { id: offer.id } })
      }
      
      console.log(`\n✅ Zostało tylko ogłoszenie: ${chatOffer.title}`)
    } else {
      console.log('\n❌ Nie znaleziono ogłoszenia z tytułem zawierającym "DO CHATU" lub "CHAT"')
      console.log('Dostępne tytuły:')
      offers.forEach(offer => console.log(`- ${offer.title}`))
    }
    
  } catch (error) {
    console.error('Error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

listAndCleanOffers()
