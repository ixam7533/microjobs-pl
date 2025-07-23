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

    const { autoRenew } = req.body

    if (typeof autoRenew !== 'boolean') {
      return res.status(400).json({ error: 'Nieprawidłowa wartość autoRenew' })
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

    if (!user.subscriptions.length) {
      return res.status(400).json({ error: 'Brak aktywnej subskrypcji' })
    }

    const currentSubscription = user.subscriptions[0]

    // Uaktualnij ustawienie auto-odnowienia
    const updatedSubscription = await prisma.subscription.update({
      where: { id: currentSubscription.id },
      data: { autoRenew }
    })

    return res.status(200).json({ 
      message: `Auto-odnowienie zostało ${autoRenew ? 'włączone' : 'wyłączone'}`,
      autoRenew: updatedSubscription.autoRenew
    })

  } catch (error) {
    console.error('Błąd podczas zmiany auto-odnowienia:', error)
    return res.status(500).json({ error: 'Błąd serwera' })
  }
}
