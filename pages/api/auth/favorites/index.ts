import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../../../lib/prisma'
import { getUserFromRequest } from '../../../../lib/auth'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const user = getUserFromRequest(req)
  if (!user) return res.status(401).json({ error: 'Zaloguj się' })

  if (req.method === 'GET') {
    try {
      const favorites = await prisma.favorite.findMany({
        where: { userId: user.id },
        include: {
          offer: {
            include: {
              images: true,
              owner: true
            }
          }
        },
        orderBy: { createdAt: 'desc' }
      })

      res.json(favorites.map(fav => ({
        id: fav.offer.id,
        title: fav.offer.title,
        category: fav.offer.category,
        description: fav.offer.description,
        location: fav.offer.location,
        contactName: fav.offer.contactName,
        contactEmail: fav.offer.contactEmail,
        contactPhone: fav.offer.contactPhone,
        ownerEmail: fav.offer.owner.email,
        createdAt: fav.offer.createdAt,
        image: fav.offer.images[0]?.url || '/house4k.jpg',
        images: fav.offer.images.map(img => img.url),
        price: fav.offer.price || 0,
        favoriteId: fav.id
      })))
    } catch (error) {
      console.error('Błąd pobierania ulubionych:', error)
      res.status(500).json({ error: 'Błąd serwera' })
    }
  }

  if (req.method === 'POST') {
    try {
      const { offerId } = req.body
      
      if (!offerId) {
        return res.status(400).json({ error: 'Brak ID ogłoszenia' })
      }

      // Sprawdź czy już nie jest w ulubionych
      const existing = await prisma.favorite.findUnique({
        where: {
          userId_offerId: {
            userId: user.id,
            offerId: parseInt(offerId)
          }
        }
      })

      if (existing) {
        return res.status(400).json({ error: 'Już w ulubionych' })
      }

      const favorite = await prisma.favorite.create({
        data: {
          userId: user.id,
          offerId: parseInt(offerId)
        }
      })

      res.status(201).json({ success: true, favorite })
    } catch (error) {
      console.error('Błąd dodawania do ulubionych:', error)
      res.status(500).json({ error: 'Błąd serwera' })
    }
  }

  if (req.method === 'DELETE') {
    try {
      const { offerId } = req.body
      
      if (!offerId) {
        return res.status(400).json({ error: 'Brak ID ogłoszenia' })
      }

      await prisma.favorite.delete({
        where: {
          userId_offerId: {
            userId: user.id,
            offerId: parseInt(offerId)
          }
        }
      })

      res.json({ success: true })
    } catch (error) {
      console.error('Błąd usuwania z ulubionych:', error)
      res.status(500).json({ error: 'Błąd serwera' })
    }
  }

  res.status(405).json({ error: 'Metoda nie dozwolona' })
}
