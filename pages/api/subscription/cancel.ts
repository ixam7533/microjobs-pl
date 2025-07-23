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

    if (!user.subscriptions.length) {
      return res.status(400).json({ error: 'Brak aktywnej subskrypcji' })
    }

    const currentSubscription = user.subscriptions[0]

    // Anuluj subskrypcję (ustaw status na CANCELLED, ale zostaw aktywną do końca okresu)
    await prisma.subscription.update({
      where: { id: currentSubscription.id },
      data: { 
        status: 'CANCELLED',
        autoRenew: false
      }
    })

    // Nie usuwaj pól subskrypcji z użytkownika - subskrypcja pozostaje aktywna do końca okresu
    // Użytkownik będzie miał dostęp do funkcji PRO do daty subscriptionEnd

    return res.status(200).json({ 
      message: 'Subskrypcja została anulowana. Zachowasz dostęp do funkcji PRO do końca bieżącego okresu.',
      subscriptionEnd: user.subscriptionEnd
    })

  } catch (error) {
    console.error('Błąd podczas anulowania subskrypcji:', error)
    return res.status(500).json({ error: 'Błąd serwera' })
  }
}
