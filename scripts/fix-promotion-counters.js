// scripts/fix-promotion-counters.js
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  try {
    console.log('🔧 Naprawiam liczniki promocji...');

    // Znajdź wszystkich użytkowników z aktywnymi subskrypcjami
    const now = new Date();
    const users = await prisma.user.findMany({
      where: {
        subscriptionEnd: {
          gt: now
        }
      }
    });

    console.log(`📊 Znaleziono ${users.length} użytkowników z aktywną subskrypcją`);

    for (const user of users) {
      // Policz rzeczywiste użycie promocji z tabeli PromotionUsage
      const actualPromotionsUsed = await prisma.promotionUsage.count({
        where: {
          userId: user.id,
          usedAt: {
            gte: user.subscriptionStart || new Date('2024-01-01') // Od początku subskrypcji
          }
        }
      });

      // Ustaw prawidłowy limit na podstawie typu subskrypcji
      let correctLimit = 0;
      if (user.subscriptionType === 'PRO') {
        correctLimit = 0; // PRO ma płatne promocje
      } else if (user.subscriptionType === 'PRO_PLUS') {
        correctLimit = 3; // PRO+ ma 3 darmowe promocje miesięcznie
      }

      // Aktualizuj dane użytkownika
      await prisma.user.update({
        where: { id: user.id },
        data: {
          promotionsUsed: actualPromotionsUsed,
          promotionsLimit: correctLimit
        }
      });

      console.log(`✅ Użytkownik ${user.email}: ${actualPromotionsUsed}/${correctLimit} promocji`);
    }

    console.log('🎉 Liczniki promocji zostały naprawione!');

  } catch (error) {
    console.error('❌ Błąd podczas naprawy:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
