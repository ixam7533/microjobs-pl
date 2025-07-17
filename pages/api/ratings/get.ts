import { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../../lib/prisma'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  try {
    const { userEmail } = req.query

    if (!userEmail) {
      return res.status(400).json({ message: 'Email użytkownika jest wymagany' })
    }

    // Znajdź użytkownika
    const user = await prisma.user.findUnique({
      where: { email: userEmail as string }
    })

    if (!user) {
      return res.status(404).json({ message: 'Użytkownik nie znaleziony' })
    }

    // Pobierz oceny użytkownika
    const ratings = await prisma.rating.findMany({
      where: {
        reviewedId: user.id
      },
      include: {
        reviewer: {
          select: {
            email: true,
            name: true
          }
        },
        offer: {
          select: {
            id: true,
            title: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    // Oblicz średnią ocenę
    const averageRating = ratings.length > 0 
      ? ratings.reduce((sum: number, rating: any) => sum + rating.rating, 0) / ratings.length
      : 0

    res.status(200).json({
      ratings,
      averageRating: Math.round(averageRating * 10) / 10, // Zaokrąglone do 1 miejsca po przecinku
      totalRatings: ratings.length
    })
  } catch (error) {
    console.error('Błąd pobierania ocen:', error)
    res.status(500).json({ message: 'Wewnętrzny błąd serwera' })
  }
}
