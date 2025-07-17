// scripts/expire-offers.ts
/*import prisma from 'lib/prisma'

async function expireOld() {
  await prisma.offer.updateMany({
    where: { expiresAt: { lt: new Date() }, active: true },
    data: { active: false },
  })
  console.log('Wyłączono stare ogłoszenia')
  process.exit(0)
}

expireOld()
*/