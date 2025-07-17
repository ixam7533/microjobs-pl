// scripts/cleanup-expired-subscriptions.ts
import prisma from '../lib/prisma'

export async function cleanupExpiredSubscriptions() {
  const now = new Date()
  
  try {
    // Find expired subscriptions
    const expiredUsers = await prisma.user.findMany({
      where: {
        subscriptionEnd: {
          lt: now
        },
        subscriptionType: {
          not: null
        }
      },
      select: {
        id: true,
        email: true,
        subscriptionType: true,
        subscriptionEnd: true
      }
    })

    console.log(`Found ${expiredUsers.length} expired subscriptions`)

    // Update expired subscriptions
    const updatePromises = expiredUsers.map(user => 
      prisma.user.update({
        where: { id: user.id },
        data: {
          subscriptionType: null,
          subscriptionStart: null,
          subscriptionEnd: null,
          promotionsUsed: 0,
          promotionsLimit: 0,
          subscriptionId: null
        }
      })
    )

    await Promise.all(updatePromises)

    // Update subscription records
    await prisma.subscription.updateMany({
      where: {
        endDate: {
          lt: now
        },
        status: 'ACTIVE'
      },
      data: {
        status: 'EXPIRED'
      }
    })

    console.log('Expired subscriptions cleaned up successfully')
  } catch (error) {
    console.error('Error cleaning up expired subscriptions:', error)
  }
}

// Run if called directly
if (require.main === module) {
  cleanupExpiredSubscriptions()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error)
      process.exit(1)
    })
}
