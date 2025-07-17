// pages/api/user/stats.ts
import { NextApiRequest, NextApiResponse } from 'next'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { email } = req.query

    if (!email || typeof email !== 'string') {
      return res.status(400).json({ error: 'Email is required' })
    }

    // Sprawdź czy użytkownik istnieje
    const user = await prisma.user.findUnique({
      where: { email }
    })

    if (!user) {
      return res.status(404).json({ error: 'User not found' })
    }

    // Pobierz statystyki ofert
    const totalOffers = await prisma.offer.count({
      where: { contactEmail: email }
    })

    const activeOffers = await prisma.offer.count({
      where: { 
        contactEmail: email,
        promoted: true
      }
    })

    // Pobierz statystyki ocen - sprawdź czy model Rating istnieje
    let totalRatings = 0
    let averageRating = 0
    
    try {
      const ratings = await (prisma as any).rating.findMany({
        where: { 
          reviewed: { email }
        },
        select: { rating: true }
      })

      totalRatings = ratings.length
      averageRating = totalRatings > 0 
        ? ratings.reduce((sum: number, r: any) => sum + r.rating, 0) / totalRatings 
        : 0
    } catch (error) {
      console.log('Rating model not available, skipping ratings')
    }

    const userName = user.name || user.email.split('@')[0]

    res.status(200).json({
      userName,
      totalOffers,
      activeOffers,
      averageRating,
      totalRatings,
      memberSince: user.createdAt
    })

  } catch (error) {
    console.error('Error fetching user stats:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}
