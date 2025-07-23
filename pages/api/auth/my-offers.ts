import type { NextApiRequest, NextApiResponse } from 'next'
import { verifyToken } from '../../../lib/jwt'
import { getToken } from 'next-auth/jwt'
import prisma from '../../../lib/prisma'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET'])
    return res.status(405).end()
  }

  try {
    let userId: number | null = null

    // Sprawdź NextAuth token (logowanie społecznościowe)
    const nextAuthToken = await getToken({ 
      req,
      secret: process.env.NEXTAUTH_SECRET 
    })
    if (nextAuthToken && nextAuthToken.email) {
      const user = await prisma.user.findUnique({
        where: { email: nextAuthToken.email },
        select: { id: true }
      })
      if (user) {
        userId = user.id
      }
    }

    // Jeśli nie ma NextAuth token, sprawdź własny JWT token
    if (!userId) {
      const authToken = req.cookies.token
      if (!authToken) {
        return res.status(401).json({ error: 'Not authenticated' })
      }

      const payload = verifyToken(authToken)
      if (!payload || typeof payload === 'string' || !payload.id) {
        return res.status(401).json({ error: 'Invalid token' })
      }

      userId = payload.id
    }

    if (!userId) {
      return res.status(401).json({ error: 'User not found' })
    }

    // Automatycznie wyczyść wygasłe promocje
    const now = new Date()
    await prisma.offer.updateMany({
      where: {
        promoted: true,
        promotedUntil: {
          lt: now
        }
      },
      data: {
        promoted: false,
        promotedUntil: null
      }
    })

    // Pobierz ogłoszenia użytkownika
    const offers = await prisma.offer.findMany({
      where: {
        ownerId: userId
      },
      orderBy: [
        { promoted: 'desc' },
        { createdAt: 'desc' }
      ],
      include: {
        images: {
          orderBy: { id: 'asc' }
        },
        owner: {
          select: {
            id: true,
            email: true,
            name: true
          }
        }
      }
    })

    // Mapuj oferety z obrazami i statusem promocji
    const offersWithImages = offers.map(offer => ({
      ...offer,
      ownerEmail: offer.owner.email,
      ownerName: offer.owner.name,
      image: offer.images.length > 0 ? offer.images[0].url : '/house4k.jpg',
      images: offer.images.map(img => img.url),
      isPromoted: offer.promoted && offer.promotedUntil && offer.promotedUntil > now
    }))

    return res.status(200).json({ offers: offersWithImages })

  } catch (error) {
    console.error('My offers API error:', error)
    return res.status(500).json({ error: 'Internal server error' })
  }
}
