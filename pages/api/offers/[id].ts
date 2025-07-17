// pages/api/offers/[id].ts
import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from 'lib/prisma'

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

  res.setHeader('Allow', ['GET'])
  return res.status(405).end()
}
