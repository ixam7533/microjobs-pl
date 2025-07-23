import { NextApiRequest, NextApiResponse } from 'next'
import { getToken } from 'next-auth/jwt'
import prisma from '../../../lib/prisma'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
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

    if (!user.subscriptions.length || user.subscriptionType !== 'PRO') {
      return res.status(400).json({ error: 'Brak aktywnej subskrypcji PRO' })
    }

    const currentSubscription = user.subscriptions[0]

    // Uaktualnij subskrypcję użytkownika do PRO+
    await prisma.user.update({
      where: { id: user.id },
      data: {
        subscriptionType: 'PRO_PLUS'
      }
    })

    // Uaktualnij rekord subskrypcji
    const updatedSubscription = await prisma.subscription.update({
      where: { id: currentSubscription.id },
      data: {
        type: 'PRO_PLUS'
      }
    })

    return res.status(200).json({ 
      message: 'Subskrypcja została zaktualizowana do PRO+',
      subscription: {
        type: 'PRO_PLUS',
        start: updatedSubscription.startDate,
        end: updatedSubscription.endDate,
        autoRenew: updatedSubscription.autoRenew
      }
    })

  } catch (error) {
    console.error('Błąd podczas aktualizacji subskrypcji:', error)
    return res.status(500).json({ error: 'Błąd serwera' })
  }
}
