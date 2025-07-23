// pages/api/subscriptions/auto-renew.ts
import { NextApiRequest, NextApiResponse } from 'next'
import { getToken } from 'next-auth/jwt'
import { getUserFromRequest } from '../../../lib/auth'
import prisma from '../../../lib/prisma'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
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

    const { autoRenew } = req.body

    if (typeof autoRenew !== 'boolean') {
      return res.status(400).json({ error: 'autoRenew must be a boolean' })
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

    const activeSubscription = user.subscriptions[0]
    if (!activeSubscription) {
      return res.status(400).json({ error: 'No active subscription found' })
    }

    // Zaktualizuj ustawienie auto-renew
    await prisma.subscription.update({
      where: { id: activeSubscription.id },
      data: {
        autoRenew
      }
    })

    res.status(200).json({
      success: true,
      message: autoRenew ? 'Automatyczne odnowienie zostało włączone' : 'Automatyczne odnowienie zostało wyłączone'
    })

  } catch (error) {
    console.error('Auto-renew update error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}
