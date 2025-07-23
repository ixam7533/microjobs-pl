// pages/api/subscriptions/upgrade.ts
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

    const { newType } = req.body

    if (!['PRO_PLUS'].includes(newType)) {
      return res.status(400).json({ error: 'Invalid upgrade type' })
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

    if (activeSubscription.type === 'PRO_PLUS') {
      return res.status(400).json({ error: 'User already has PRO+ subscription' })
    }

    // Zaktualizuj subskrypcję
    await prisma.subscription.update({
      where: { id: activeSubscription.id },
      data: {
        type: newType
      }
    })

    // Zaktualizuj także User model dla kompatybilności
    await prisma.user.update({
      where: { email: userInfo.email },
      data: {
        subscriptionType: newType,
        promotionsLimit: -1 // Nielimitowane dla PRO+
      }
    })

    res.status(200).json({
      success: true,
      message: `Subskrypcja została zmieniona na ${newType}`
    })

  } catch (error) {
    console.error('Upgrade subscription error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}
