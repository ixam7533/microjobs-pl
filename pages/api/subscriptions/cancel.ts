// pages/api/subscriptions/cancel.ts
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

    // Update subscription to cancelled (but keep active until end date)
    await prisma.subscription.update({
      where: { id: activeSubscription.id },
      data: { 
        status: 'CANCELLED',
        autoRenew: false 
      }
    })

    res.status(200).json({ 
      success: true, 
      message: 'Subskrypcja została anulowana. Zachowasz dostęp do funkcji PRO do końca obecnego okresu rozliczeniowego.',
      endsAt: activeSubscription.endDate
    })

  } catch (error) {
    console.error('Cancel subscription error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}
