// scripts/create-test-offer-with-stats.js
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  try {
    console.log('🏗️ Tworzę testowe ogłoszenie z statystykami...');

    // Znajdź pierwszego użytkownika
    let user = await prisma.user.findFirst();

    if (!user) {
      // Stwórz testowego użytkownika jeśli nie ma żadnego
      user = await prisma.user.create({
        data: {
          email: 'test@example.com',
          hash: '$2b$10$dummy.hash.for.testing.purposes',
          confirmed: true,
          name: 'Test User'
        }
      });
      console.log('👤 Utworzono testowego użytkownika');
    }

    // Stwórz testowe ogłoszenie
    const offer = await prisma.offer.create({
      data: {
        title: 'Potrzebuję pracownika do izolacji',
        description: 'Szukam doświadczonego pracownika do wykonania izolacji w budynku mieszkalnym. Praca na terenie Gdyni.',
        category: 'budowlane',
        price: 150.00,
        offerType: 'szukam_pracownika',
        location: 'Gdynia, pomorskie',
        contactName: 'Jan Kowalski',
        contactEmail: 'cos@example.com',
        contactPhone: '+48 123 456 789',
        ownerId: user.id,
        views: 47,
        likes: 12
      }
    });

    console.log(`✅ Utworzono ogłoszenie: "${offer.title}"`);
    console.log(`📊 Statystyki: ${offer.views} wyświetleń, ${offer.likes} polubień`);

    // Dodaj jeszcze jedno
    const offer2 = await prisma.offer.create({
      data: {
        title: 'Koszenie trawy w ogrodzie',
        description: 'Potrzebuję kogoś do wykoszenia dużego ogrodu. Teren około 500m². Praca jednorazowa.',
        category: 'ogrodnictwo',
        price: 80.00,
        offerType: 'szukam_pracownika',
        location: 'Sopot, pomorskie',
        contactName: 'Anna Nowak',
        contactEmail: 'anna@example.com',
        ownerId: user.id,
        views: 123,
        likes: 8
      }
    });

    console.log(`✅ Utworzono ogłoszenie: "${offer2.title}"`);
    console.log(`📊 Statystyki: ${offer2.views} wyświetleń, ${offer2.likes} polubień`);

    console.log('🎉 Testowe ogłoszenia zostały utworzone!');

  } catch (error) {
    console.error('❌ Błąd podczas tworzenia ogłoszeń:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
