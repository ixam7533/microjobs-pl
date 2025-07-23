// pages/api/subscriptions/create.ts
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

    const { type } = req.body

    if (!['PRO', 'PRO_PLUS'].includes(type)) {
      return res.status(400).json({ error: 'Invalid subscription type' })
    }

    const user = await prisma.user.findUnique({
      where: { email: userInfo.email }
    })

    if (!user) {
      return res.status(404).json({ error: 'User not found' })
    }

    // Sprawdź czy użytkownik już ma aktywną subskrypcję
    const now = new Date()
    if (user.subscriptionEnd && user.subscriptionEnd > now) {
      return res.status(400).json({ error: 'User already has active subscription' })
    }

    // Ustaw nową subskrypcję
    const subscriptionStart = new Date()
    const subscriptionEnd = new Date()
    subscriptionEnd.setMonth(subscriptionEnd.getMonth() + 1) // 30 dni

    // Utwórz nową subskrypcję w tabeli Subscription
    await prisma.subscription.create({
      data: {
        userId: user.id,
        type,
        status: 'ACTIVE',
        startDate: subscriptionStart,
        endDate: subscriptionEnd,
        autoRenew: true
      }
    })

    // Zaktualizuj także pola w User dla kompatybilności
    await prisma.user.update({
      where: { email: userInfo.email },
      data: {
        subscriptionType: type,
        subscriptionStart,
        subscriptionEnd,
        promotionsUsed: 0,
        promotionsLimit: type === 'PRO_PLUS' ? -1 : 0 // -1 dla nielimitowanych
      }
    })

    res.status(200).json({
      success: true,
      message: `Subskrypcja ${type} została aktywowana`
    })

  } catch (error) {
    console.error('Create subscription error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}
