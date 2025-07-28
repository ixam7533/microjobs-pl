// pages/api/subscriptions/purchase.ts
import { NextApiRequest, NextApiResponse } from 'next'
import { verifyToken } from '../../../lib/jwt'
import prisma from '../../../lib/prisma'
import { PRO_VERSIONS } from '../../../lib/pricing'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    // Pobierz token z cookies zamiast nagłówka Authorization
    const token = req.cookies.token
    
    if (!token) {
      return res.status(401).json({ error: 'Token required' })
    }

    const decoded = verifyToken(token) as { id: string; email: string }
    
    if (!decoded || !parseInt(decoded.id)) {
      return res.status(401).json({ error: 'Invalid token' })
    }

    const { subscriptionType } = req.body
    
    if (!subscriptionType || !['PRO', 'PRO_PLUS'].includes(subscriptionType)) {
      return res.status(400).json({ error: 'Invalid subscription type' })
    }

    const user = await prisma.user.findUnique({
      where: { id: parseInt(decoded.id) },
      include: {
        subscriptions: {
          where: { 
            OR: [
              { status: 'ACTIVE' },
              { status: 'CANCELLED' }
            ]
          },
          orderBy: { createdAt: 'desc' },
          take: 1
        }
      }
    })

    if (!user) {
      return res.status(404).json({ error: 'User not found' })
    }

    // Sprawdź czy ma aktywną nie-anulowaną subskrypcję
    const now = new Date()
    const hasActiveSubscription = user.subscriptionEnd && user.subscriptionEnd > now
    const latestSubscription = user.subscriptions[0]
    const hasActivePaidSubscription = hasActiveSubscription && latestSubscription?.status === 'ACTIVE'
    
    if (hasActivePaidSubscription) {
      return res.status(400).json({ error: 'You already have an active subscription. Cancel it first or wait for it to expire.' })
    }

    const subscriptionData = PRO_VERSIONS[subscriptionType as keyof typeof PRO_VERSIONS]
    const startDate = new Date()
    const endDate = new Date(startDate)
    endDate.setMonth(endDate.getMonth() + 1) // 1 month subscription

    // Jeśli była anulowana subskrypcja, zakończ ją natychmiast
    if (latestSubscription && latestSubscription.status === 'CANCELLED') {
      await prisma.subscription.update({
        where: { id: latestSubscription.id },
        data: { 
          status: 'EXPIRED',
          endDate: startDate // Zakończ natychmiast
        }
      })
    }

    // Ustaw prawidłowy limit promocji
    let promotionsLimit = 0
    if (subscriptionType === 'PRO') {
      promotionsLimit = 1 // PRO ma 1 promocję miesięcznie za opłatą
    } else if (subscriptionType === 'PRO_PLUS') {
      promotionsLimit = 3 // PRO+ ma 3 darmowe promocje miesięcznie
    }

    // Update user with subscription
    await prisma.user.update({
      where: { id: parseInt(decoded.id) },
      data: {
        subscriptionType,
        subscriptionStart: startDate,
        subscriptionEnd: endDate,
        promotionsUsed: 0,
        promotionsLimit: promotionsLimit,
        subscriptionId: `sub_${Date.now()}_${parseInt(decoded.id)}` // Mock payment ID
      }
    })

    // Create subscription record
    await prisma.subscription.create({
      data: {
        userId: parseInt(decoded.id),
        type: subscriptionType,
        status: 'ACTIVE',
        startDate,
        endDate,
        autoRenew: true,
        paymentId: `pay_${Date.now()}_${parseInt(decoded.id)}`
      }
    })

    res.status(200).json({ 
      success: true, 
      message: 'Subscription purchased successfully',
      subscription: {
        type: subscriptionType,
        startDate,
        endDate,
        promotionsLimit: promotionsLimit
      }
    })

  } catch (error) {
    console.error('Purchase subscription error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}
