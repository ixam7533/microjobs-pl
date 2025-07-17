import { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../../lib/prisma'
import { verifyToken } from '../../../lib/jwt'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  try {
    console.log('Rating API called with body:', req.body)
    
    const token = req.headers.authorization?.replace('Bearer ', '') || req.cookies.token
    console.log('Token found:', !!token)
    
    if (!token) {
      return res.status(401).json({ message: 'Nie jesteś zalogowany' })
    }

    const decoded = verifyToken(token) as any
    console.log('Token decoded successfully:', !!decoded)
    
    if (!decoded) {
      return res.status(401).json({ message: 'Nieprawidłowy token' })
    }

    const { reviewedEmail, rating, comment, offerId } = req.body
    console.log('Request data:', { reviewedEmail, rating, comment, offerId })

    if (!reviewedEmail || !rating || rating < 1 || rating > 5) {
      return res.status(400).json({ message: 'Nieprawidłowe dane' })
    }

    // Znajdź użytkowników
    const reviewer = await prisma.user.findUnique({
      where: { email: decoded.email }
    })

    const reviewed = await prisma.user.findUnique({
      where: { email: reviewedEmail }
    })

    if (!reviewer || !reviewed) {
      return res.status(404).json({ message: 'Użytkownik nie znaleziony' })
    }

    if (reviewer.id === reviewed.id) {
      return res.status(400).json({ message: 'Nie możesz ocenić samego siebie' })
    }

    // Sprawdź czy już ocenił dla tej oferty
    const existingRating = await prisma.rating.findUnique({
      where: {
        reviewerId_reviewedId_offerId: {
          reviewerId: reviewer.id,
          reviewedId: reviewed.id,
          offerId: offerId || null
        }
      }
    })

    if (existingRating) {
      return res.status(400).json({ message: 'Już oceniłeś tego użytkownika dla tej oferty' })
    }

    // Dodaj ocenę
    console.log('Creating rating with data:', {
      rating: parseInt(rating),
      comment: comment || null,
      reviewerId: reviewer.id,
      reviewedId: reviewed.id,
      offerId: offerId || null
    })
    
    const newRating = await prisma.rating.create({
      data: {
        rating: parseInt(rating),
        comment: comment || null,
        reviewerId: reviewer.id,
        reviewedId: reviewed.id,
        offerId: offerId || null
      },
      include: {
        reviewer: {
          select: {
            email: true
          }
        }
      }
    })
    
    console.log('Rating created successfully:', newRating)

    res.status(201).json({
      message: 'Ocena została dodana',
      rating: newRating
    })
  } catch (error) {
    console.error('Błąd dodawania oceny:', error)
    console.error('Stack trace:', (error as Error).stack)
    res.status(500).json({ 
      message: 'Wewnętrzny błąd serwera',
      error: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined
    })
  }
}
