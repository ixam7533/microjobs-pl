// pages/api/auth/offers/index.ts
import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from 'lib/prisma'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'GET') {
    const offers = await prisma.offer.findMany({ 
      orderBy: { createdAt: 'desc' },
      include: {
        images: {
          orderBy: { id: 'asc' } // pierwsze dodane zdjęcie jako pierwsze
        }
      }
    })
    
    // Mapuj oferety z obrazami
    const offersWithImages = offers.map(offer => ({
      ...offer,
      image: offer.images.length > 0 ? offer.images[0].url : '/house4k.jpg',
      images: offer.images.map(img => img.url)
    }))
    
    return res.status(200).json({ offers: offersWithImages })
  }

  if (req.method === 'POST') {
    const data = req.body
    const off  = await prisma.offer.create({ data })
    return res.status(201).json(off)
  }

  res.setHeader('Allow', ['GET','POST'])
  return res.status(405).end()
}
