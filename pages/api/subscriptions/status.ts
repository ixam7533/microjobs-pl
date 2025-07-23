// pages/api/subscriptions/status.ts
import { NextApiRequest, NextApiResponse } from 'next'
import { getToken } from 'next-auth/jwt'
import { getUserFromRequest } from '../../../lib/auth'
import prisma from '../../../lib/prisma'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    let userInfo = null

    // Sprawdź NextAuth token (logowanie społecznościowe)
    const nextAuthToken = await getToken({ 
      req,
      secret: process.env.NEXTAUTH_SECRET 
    })
    if (nextAuthToken && nextAuthToken.email) {
      userInfo = { email: nextAuthToken.email }
    }

    // Jeśli nie ma NextAuth token, sprawdź własny JWT token (logowanie email/hasło)
    if (!userInfo) {
      const jwtUser = await getUserFromRequest(req)
      if (jwtUser) {
        userInfo = jwtUser
      }
    }

    if (!userInfo) {
      return res.status(401).json({ error: 'Not authenticated' })
    }

    const user = await prisma.user.findUnique({
      where: { email: userInfo.email },
      include: {
        subscriptions: {
          where: { status: 'ACTIVE' },
          orderBy: { createdAt: 'desc' },
          take: 1
        }
      }
    })

    if (!user) {
      return res.status(404).json({ error: 'User not found' })
    }

    const now = new Date()
    const hasActiveSubscription = user.subscriptionEnd && user.subscriptionEnd > now
    const activeSubscription = user.subscriptions[0] // Najpewniej najnowsza aktywna subskrypcja
    
    // Oblicz limit promocji na podstawie typu subskrypcji
    let promotionsLimit = 0
    if (hasActiveSubscription && user.subscriptionType) {
      switch (user.subscriptionType) {
        case 'PRO':
          promotionsLimit = 1 // 1 darmowe promowanie miesięcznie dla PRO
          break
        case 'PRO_PLUS':
          promotionsLimit = 3 // 3 darmowe promowania miesięcznie dla PRO+
          break
        default:
          promotionsLimit = 0
      }
    }
    
    // Debug logging
    console.log('🔍 Subscription status check:', {
      userId: user.id,
      email: user.email,
      subscriptionType: user.subscriptionType,
      promotionsUsed: user.promotionsUsed,
      promotionsLimit: promotionsLimit,
      hasActiveSubscription,
      subscriptionEnd: user.subscriptionEnd
    })
    
    res.status(200).json({
      success: true,
      subscription: {
        isActive: hasActiveSubscription,
        type: user.subscriptionType,
        startDate: user.subscriptionStart,
        endDate: user.subscriptionEnd,
        promotionsUsed: user.promotionsUsed,
        promotionsLimit: promotionsLimit,
        emailReminder: user.emailReminder,
        autoRenew: activeSubscription ? activeSubscription.autoRenew : false,
        daysRemaining: hasActiveSubscription ? Math.ceil((user.subscriptionEnd!.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)) : 0
      }
    })

  } catch (error) {
    console.error('Get subscription status error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}
