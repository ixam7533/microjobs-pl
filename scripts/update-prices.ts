// scripts/update-prices.ts
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function updatePrices() {
  try {
    // Znajdź ogłoszenia bez ceny i wyciągnij cenę z opisu
    const offers = await prisma.offer.findMany({
      where: {
        OR: [
          { price: null },
          { price: 0 }
        ]
      }
    })

    console.log(`Znaleziono ${offers.length} ogłoszeń do aktualizacji`)

    for (const offer of offers) {
      let extractedPrice = 100 // domyślna cena
      
      // Próbuj wyciągnąć cenę z opisu
      const priceMatch = offer.description.match(/Cena:\s*(\d+)\s*zł/i)
      if (priceMatch) {
        extractedPrice = parseInt(priceMatch[1])
      }

      await prisma.offer.update({
        where: { id: offer.id },
        data: { price: extractedPrice }
      })

      console.log(`Zaktualizowano ogłoszenie #${offer.id}: ${offer.title} -> ${extractedPrice} zł`)
    }

    console.log('Aktualizacja cen zakończona!')
  } catch (error) {
    console.error('Błąd:', error)
  } finally {
    await prisma.$disconnect()
  }
}

updatePrices()
