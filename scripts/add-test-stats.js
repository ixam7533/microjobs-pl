// scripts/add-test-stats.js
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  try {
    console.log('📊 Dodaję testowe statystyki do ogłoszeń...');

    // Pobierz wszystkie ogłoszenia
    const offers = await prisma.offer.findMany();

    console.log(`🔍 Znaleziono ${offers.length} ogłoszeń`);

    for (const offer of offers) {
      // Generuj losowe statystyki
      const views = Math.floor(Math.random() * 150) + 5; // 5-155 wyświetleń
      const likes = Math.floor(Math.random() * 30) + 1; // 1-31 polubień

      await prisma.offer.update({
        where: { id: offer.id },
        data: {
          views: views,
          likes: likes
        }
      });

      console.log(`✅ Ogłoszenie "${offer.title}": ${views} wyświetleń, ${likes} polubień`);
    }

    console.log('🎉 Statystyki zostały dodane do wszystkich ogłoszeń!');

  } catch (error) {
    console.error('❌ Błąd podczas dodawania statystyk:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
