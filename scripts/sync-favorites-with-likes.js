// scripts/sync-favorites-with-likes.js
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  try {
    console.log('🔄 Synchronizuję polubienia z tabelą Favorite...');

    // Pobierz wszystkie ogłoszenia
    const offers = await prisma.offer.findMany({
      include: {
        favorites: true
      }
    });

    console.log(`🔍 Znaleziono ${offers.length} ogłoszeń`);

    for (const offer of offers) {
      const actualLikes = offer.favorites.length;
      
      if (offer.likes !== actualLikes) {
        await prisma.offer.update({
          where: { id: offer.id },
          data: {
            likes: actualLikes
          }
        });
        
        console.log(`✅ Ogłoszenie "${offer.title}": zaktualizowano z ${offer.likes} na ${actualLikes} polubień`);
      } else {
        console.log(`👍 Ogłoszenie "${offer.title}": już zsynchronizowane (${actualLikes} polubień)`);
      }
    }

    console.log('🎉 Synchronizacja polubień zakończona!');

  } catch (error) {
    console.error('❌ Błąd podczas synchronizacji:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
