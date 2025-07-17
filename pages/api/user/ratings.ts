// pages/api/user/ratings.ts
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

    // Znajdź użytkownika
    const user = await prisma.user.findUnique({
      where: { email }
    })

    if (!user) {
      return res.status(404).json({ error: 'User not found' })
    }

    // Pobierz oceny użytkownika
    let formattedRatings: any[] = []
    
    try {
      const ratings = await (prisma as any).rating.findMany({
        where: { 
          reviewedId: user.id 
        },
        include: {
          reviewer: {
            select: {
              name: true,
              email: true
            }
          },
          offer: {
            select: {
              title: true
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        }
      })

      // Przekształć dane do formatu API
      formattedRatings = ratings.map((rating: any) => ({
        id: rating.id,
        rating: rating.rating,
        comment: rating.comment || '',
        createdAt: rating.createdAt,
        fromUser: rating.reviewer.name || rating.reviewer.email,
        offerTitle: rating.offer?.title || 'Brak tytułu'
      }))
    } catch (error) {
      console.log('Rating model not available, returning empty array')
    }

    res.status(200).json(formattedRatings)

  } catch (error) {
    console.error('Error fetching user ratings:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}
