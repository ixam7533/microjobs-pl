// pages/api/subscriptions/status.ts
import { NextApiRequest, NextApiResponse } from 'next'
import { verifyToken } from '../../../lib/jwt'
import prisma from '../../../lib/prisma'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const authHeader = req.headers.authorization
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Token required' })
    }

    const token = authHeader.split(' ')[1]
    const decoded = verifyToken(token) as any
    
    if (!decoded || !decoded.userId) {
      return res.status(401).json({ error: 'Invalid token' })
    }

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
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
    
    res.status(200).json({
      success: true,
      subscription: {
        isActive: hasActiveSubscription,
        type: user.subscriptionType,
        startDate: user.subscriptionStart,
        endDate: user.subscriptionEnd,
        promotionsUsed: user.promotionsUsed,
        promotionsLimit: user.promotionsLimit,
        emailReminder: user.emailReminder,
        daysRemaining: hasActiveSubscription ? Math.ceil((user.subscriptionEnd!.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)) : 0
      }
    })

  } catch (error) {
    console.error('Get subscription status error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}
