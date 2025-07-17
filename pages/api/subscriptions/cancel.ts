// pages/api/subscriptions/cancel.ts
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

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId }
    })

    if (!user) {
      return res.status(404).json({ error: 'User not found' })
    }

    // Check if user has active subscription
    const now = new Date()
    if (!user.subscriptionEnd || user.subscriptionEnd <= now) {
      return res.status(400).json({ error: 'No active subscription found' })
    }

    // Update subscription to cancelled (but keep active until end date)
    await prisma.subscription.updateMany({
      where: { 
        userId: decoded.userId, 
        status: 'ACTIVE' 
      },
      data: { 
        status: 'CANCELLED',
        autoRenew: false 
      }
    })

    // Update user's auto-renewal setting
    await prisma.user.update({
      where: { id: decoded.userId },
      data: { emailReminder: false }
    })

    res.status(200).json({ 
      success: true, 
      message: 'Subscription cancelled successfully. You will keep your benefits until the end of the current billing period.',
      endsAt: user.subscriptionEnd
    })

  } catch (error) {
    console.error('Cancel subscription error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}
