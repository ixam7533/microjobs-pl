// pages/api/offers/promote.ts
import { NextApiRequest, NextApiResponse } from 'next'
import { verifyToken } from '../../../lib/jwt'
import prisma from '../../../lib/prisma'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
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

    const { offerId } = req.body

    if (!offerId) {
      return res.status(400).json({ error: 'Offer ID is required' })
    }

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId }
    })

    if (!user) {
      return res.status(404).json({ error: 'User not found' })
    }

    // Check if user has active subscription
    const now = new Date()
    const hasActiveSubscription = user.subscriptionEnd && user.subscriptionEnd > now
    
    if (!hasActiveSubscription) {
      return res.status(403).json({ error: 'Active subscription required' })
    }

    // Check if user has promotions available
    if (user.promotionsUsed >= user.promotionsLimit) {
      return res.status(403).json({ error: 'No promotions available' })
    }

    // Check if offer exists and belongs to user
    const offer = await prisma.offer.findUnique({
      where: { id: parseInt(offerId) }
    })

    if (!offer) {
      return res.status(404).json({ error: 'Offer not found' })
    }

    if (offer.ownerId !== decoded.userId) {
      return res.status(403).json({ error: 'You can only promote your own offers' })
    }

    // Check if offer is already promoted
    if (offer.promoted && offer.promotedUntil && offer.promotedUntil > now) {
      return res.status(400).json({ error: 'Offer is already promoted' })
    }

    // Automatyczne czyszczenie wygasłych promocji
    if (offer.promoted && offer.promotedUntil && offer.promotedUntil <= now) {
      await prisma.offer.update({
        where: { id: parseInt(offerId) },
        data: {
          promoted: false,
          promotedUntil: null
        }
      })
    }

    // Promote offer for 30 days
    const promotedUntil = new Date()
    promotedUntil.setDate(promotedUntil.getDate() + 30)

    await prisma.offer.update({
      where: { id: parseInt(offerId) },
      data: {
        promoted: true,
        promotedUntil
      }
    })

    // Update user's promotions used
    await prisma.user.update({
      where: { id: decoded.userId },
      data: {
        promotionsUsed: user.promotionsUsed + 1
      }
    })

    // Create promotion usage record
    await prisma.promotionUsage.create({
      data: {
        userId: decoded.userId,
        offerId: parseInt(offerId)
      }
    })

    res.status(200).json({ 
      success: true, 
      message: 'Offer promoted successfully',
      promotedUntil,
      promotionsRemaining: user.promotionsLimit - user.promotionsUsed - 1
    })

  } catch (error) {
    console.error('Promote offer error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}
