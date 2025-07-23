// pages/api/offers/[id].ts
import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from 'lib/prisma'
import { verifyToken } from '../../../lib/jwt'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const id = parseInt(req.query.id as string, 10)
  if (isNaN(id)) return res.status(400).json({ error: 'Invalid ID' })

  if (req.method === 'GET') {
    const offer = await prisma.offer.findUnique({ 
      where: { id },
      include: {
        images: {
          orderBy: { id: 'asc' } // pierwsze dodane zdjęcie jako pierwsze
        }
      }
    })
    
    if (!offer) return res.status(404).end()
    
    // Dodaj images jako tablicę i image jako pierwsze zdjęcie dla kompatybilności
    const offerWithImages = {
      ...offer,
      image: offer.images.length > 0 ? offer.images[0].url : '/house4k.jpg',
      images: offer.images.map(img => img.url)
    }
    
    return res.status(200).json(offerWithImages)
  }

  if (req.method === 'PUT') {
    try {
      // Sprawdź autoryzację
      const token = req.cookies.token
      console.log('PUT /api/offers/[id] - Token from cookies:', token ? `Present (length: ${token.length})` : 'Missing')
      console.log('PUT /api/offers/[id] - All cookies:', req.cookies)
      
      if (!token) {
        return res.status(401).json({ error: 'Token required' })
      }

      let decoded
      try {
        decoded = verifyToken(token) as any
        console.log('PUT /api/offers/[id] - Token verification successful:', { userId: decoded?.id, email: decoded?.email })
      } catch (tokenError: any) {
        console.error('PUT /api/offers/[id] - Token verification failed:', tokenError)
        return res.status(401).json({ error: 'Invalid token', details: tokenError?.message || 'Token verification failed' })
      }
      
      if (!decoded || !decoded.id) {
        return res.status(401).json({ error: 'Invalid token - missing user id' })
      }

      // Sprawdź czy ogłoszenie istnieje i należy do użytkownika
      const existingOffer = await prisma.offer.findUnique({
        where: { id }
      })

      if (!existingOffer) {
        return res.status(404).json({ error: 'Offer not found' })
      }

      if (existingOffer.ownerId !== decoded.id) {
        return res.status(403).json({ error: 'You can only edit your own offers' })
      }

      // Aktualizuj ogłoszenie (bez kategorii - nie można jej zmieniać)
      const {
        title,
        description,
        price,
        locationProvince,
        locationCity,
        locationDetails,
        location,
        contactName,
        contactEmail,
        contactPhone
      } = req.body

      const updatedOffer = await prisma.offer.update({
        where: { id },
        data: {
          title,
          description,
          price: parseFloat(price) || 0,
          // category jest celowo pominięta - nie można jej zmieniać
          location,
          contactName,
          contactEmail,
          contactPhone: contactPhone || null,
          updatedAt: new Date()
        },
        include: {
          images: {
            orderBy: { id: 'asc' }
          }
        }
      })

      return res.status(200).json({
        ...updatedOffer,
        image: updatedOffer.images.length > 0 ? updatedOffer.images[0].url : '/house4k.jpg',
        images: updatedOffer.images.map(img => img.url)
      })

    } catch (error) {
      console.error('Error updating offer:', error)
      return res.status(500).json({ error: 'Failed to update offer' })
    }
  }

  if (req.method === 'DELETE') {
    try {
      // Sprawdź autoryzację
      const token = req.cookies.token
      if (!token) {
        return res.status(401).json({ error: 'Token required' })
      }

      const decoded = verifyToken(token) as any
      if (!decoded || !decoded.id) {
        return res.status(401).json({ error: 'Invalid token' })
      }

      // Sprawdź czy ogłoszenie istnieje i należy do użytkownika
      const existingOffer = await prisma.offer.findUnique({
        where: { id }
      })

      if (!existingOffer) {
        return res.status(404).json({ error: 'Offer not found' })
      }

      if (existingOffer.ownerId !== decoded.id) {
        return res.status(403).json({ error: 'You can only delete your own offers' })
      }

      // Usuń ogłoszenie (cascade usunie powiązane tabele)
      await prisma.offer.delete({
        where: { id }
      })

      return res.status(200).json({ success: true })

    } catch (error) {
      console.error('Error deleting offer:', error)
      return res.status(500).json({ error: 'Failed to delete offer' })
    }
  }

  res.setHeader('Allow', ['GET', 'PUT', 'DELETE'])
  return res.status(405).end()
}
