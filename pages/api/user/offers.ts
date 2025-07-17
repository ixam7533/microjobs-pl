// pages/api/user/offers.ts
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

    // Pobierz oferty użytkownika
    const offers = await prisma.offer.findMany({
      where: { contactEmail: email },
      include: {
        images: true,
        _count: {
          select: {
            favorites: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    // Przekształć dane do formatu API
    const formattedOffers = offers.map((offer: any) => ({
      id: offer.id,
      title: offer.title,
      description: offer.description,
      price: offer.price || 0,
      location: offer.location,
      category: offer.category,
      image: offer.images[0]?.url || '/house4k.jpg',
      createdAt: offer.createdAt,
      isActive: offer.promotedUntil ? offer.promotedUntil > new Date() : true,
      promoted: offer.promoted || false,
      favoritesCount: offer._count?.favorites || 0
    }))

    res.status(200).json(formattedOffers)

  } catch (error) {
    console.error('Error fetching user offers:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}
