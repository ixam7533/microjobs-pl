// lib/subscription.ts
import prisma from './prisma'

export async function checkUserSubscription(userId: number) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        subscriptionType: true,
        subscriptionStart: true,
        subscriptionEnd: true,
        promotionsUsed: true,
        promotionsLimit: true,
      }
    })

    if (!user) {
      return {
        hasActiveSubscription: false,
        subscriptionType: null,
        promotionsRemaining: 0
      }
    }

    const now = new Date()
    const hasActiveSubscription = user.subscriptionEnd && user.subscriptionEnd > now

    return {
      hasActiveSubscription,
      subscriptionType: user.subscriptionType,
      promotionsRemaining: user.promotionsLimit - user.promotionsUsed,
      subscriptionEnd: user.subscriptionEnd
    }
  } catch (error) {
    console.error('Error checking subscription:', error)
    return {
      hasActiveSubscription: false,
      subscriptionType: null,
      promotionsRemaining: 0
    }
  }
}

export async function getUserFromToken(token: string) {
  try {
    const { verifyToken } = await import('./jwt')
    const decoded = verifyToken(token) as any
    
    if (!decoded || !decoded.userId) {
      return null
    }

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        email: true,
        subscriptionType: true,
        subscriptionEnd: true,
        promotionsUsed: true,
        promotionsLimit: true,
      }
    })

    return user
  } catch (error) {
    console.error('Error getting user from token:', error)
    return null
  }
}
