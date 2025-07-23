import { NextApiRequest, NextApiResponse } from 'next'
import { getToken } from 'next-auth/jwt'
import prisma from '../../../lib/prisma'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Metoda niedozwolona' })
  }

  try {
    const token = await getToken({ req })
    if (!token?.email) {
      return res.status(401).json({ error: 'Musisz być zalogowany' })
    }

    // Znajdź użytkownika
    const user = await prisma.user.findUnique({
      where: { email: token.email },
      include: {
        subscriptions: {
          where: { status: 'ACTIVE' },
          orderBy: { createdAt: 'desc' },
          take: 1
        }
      }
    })

    if (!user) {
      return res.status(404).json({ error: 'Użytkownik nie znaleziony' })
    }

    // Sprawdź czy użytkownik ma aktywną subskrypcję
    const now = new Date()
    const hasActiveSubscription = user.subscriptionEnd && user.subscriptionEnd > now
    const currentSubscription = user.subscriptions.length > 0 ? user.subscriptions[0] : null

    return res.status(200).json({
      hasSubscription: hasActiveSubscription,
      subscriptionType: hasActiveSubscription ? user.subscriptionType : null,
      subscriptionStart: user.subscriptionStart,
      subscriptionEnd: user.subscriptionEnd,
      autoRenew: currentSubscription?.autoRenew || false,
      daysRemaining: hasActiveSubscription ? 
        Math.ceil((user.subscriptionEnd!.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)) : 0
    })

  } catch (error) {
    console.error('Błąd podczas pobierania statusu subskrypcji:', error)
    return res.status(500).json({ error: 'Błąd serwera' })
  }
}
