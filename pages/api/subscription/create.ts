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

    const { subscriptionType } = req.body

    if (!subscriptionType || !['PRO', 'PRO_PLUS'].includes(subscriptionType)) {
      return res.status(400).json({ error: 'Nieprawidłowy typ subskrypcji' })
    }

    // Znajdź użytkownika
    const user = await prisma.user.findUnique({
      where: { email: token.email }
    })

    if (!user) {
      return res.status(404).json({ error: 'Użytkownik nie znaleziony' })
    }

    // Oblicz datę zakończenia subskrypcji (30 dni)
    const subscriptionEnd = new Date()
    subscriptionEnd.setDate(subscriptionEnd.getDate() + 30)

    // Uaktualnij pola subskrypcji użytkownika
    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: {
        subscriptionType,
        subscriptionStart: new Date(),
        subscriptionEnd
      }
    })

    // Utwórz rekord subskrypcji
    const subscription = await prisma.subscription.create({
      data: {
        userId: user.id,
        type: subscriptionType,
        status: 'ACTIVE',
        startDate: new Date(),
        endDate: subscriptionEnd,
        autoRenew: true
      }
    })

    return res.status(200).json({ 
      message: 'Subskrypcja została aktywowana',
      subscription: {
        type: subscriptionType,
        start: subscription.startDate,
        end: subscription.endDate,
        autoRenew: subscription.autoRenew
      }
    })

  } catch (error) {
    console.error('Błąd podczas tworzenia subskrypcji:', error)
    return res.status(500).json({ error: 'Błąd serwera' })
  }
}
