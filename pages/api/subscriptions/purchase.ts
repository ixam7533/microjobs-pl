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

    const decoded = verifyToken(token) as any
    
    if (!decoded || !decoded.id) {
      return res.status(401).json({ error: 'Invalid token' })
    }

    const { subscriptionType } = req.body
    
    if (!subscriptionType || !['PRO', 'PRO_PLUS'].includes(subscriptionType)) {
      return res.status(400).json({ error: 'Invalid subscription type' })
    }

    const user = await prisma.user.findUnique({
      where: { id: decoded.id }
    })

    if (!user) {
      return res.status(404).json({ error: 'User not found' })
    }

    // Check if user already has active subscription
    const now = new Date()
    if (user.subscriptionEnd && user.subscriptionEnd > now) {
      return res.status(400).json({ error: 'You already have an active subscription' })
    }

    const subscriptionData = PRO_VERSIONS[subscriptionType as keyof typeof PRO_VERSIONS]
    const startDate = new Date()
    const endDate = new Date(startDate)
    endDate.setMonth(endDate.getMonth() + 1) // 1 month subscription

    // Ustaw prawidłowy limit promocji
    let promotionsLimit = 0
    if (subscriptionType === 'PRO') {
      promotionsLimit = 1 // PRO ma 1 promocję miesięcznie za opłatą
    } else if (subscriptionType === 'PRO_PLUS') {
      promotionsLimit = 3 // PRO+ ma 3 darmowe promocje miesięcznie
    }

    // Update user with subscription
    await prisma.user.update({
      where: { id: decoded.id },
      data: {
        subscriptionType,
        subscriptionStart: startDate,
        subscriptionEnd: endDate,
        promotionsUsed: 0,
        promotionsLimit: promotionsLimit,
        subscriptionId: `sub_${Date.now()}_${decoded.id}` // Mock payment ID
      }
    })

    // Create subscription record
    await prisma.subscription.create({
      data: {
        userId: decoded.id,
        type: subscriptionType,
        status: 'ACTIVE',
        startDate,
        endDate,
        autoRenew: true,
        paymentId: `pay_${Date.now()}_${decoded.id}`
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
