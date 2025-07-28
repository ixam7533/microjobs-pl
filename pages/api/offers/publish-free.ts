// pages/api/offers/publish-free.ts - Darmowa publikacja dla PRO/PRO+
import { NextApiRequest, NextApiResponse } from 'next'
import { PrismaClient } from '@prisma/client'
import { verifyToken } from '../../../lib/jwt'
import { getToken } from 'next-auth/jwt'

const prisma = new PrismaClient()

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' })
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
        return res.status(401).json({ success: false, error: 'Not authenticated' })
      }

      const payload = verifyToken(authToken)
      if (!payload || typeof payload === 'string' || !payload.id) {
        return res.status(401).json({ success: false, error: 'Invalid token' })
      }

      userId = payload.id
    }

    if (!userId) {
      return res.status(401).json({ success: false, error: 'User not found' })
    }
  // Sprawdź czy użytkownik ma PRO/PRO+ albo czy to jego pierwsza oferta
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { 
      subscriptionType: true, 
      subscriptionEnd: true,
      offers: { select: { id: true } } // Pobierz istniejące oferty
    }
  })

  if (!user) {
    return res.status(404).json({ success: false, error: 'User not found' })
  }

  const hasActiveSubscription = user.subscriptionEnd && user.subscriptionEnd > new Date()
  const hasProSubscription = hasActiveSubscription && (user.subscriptionType === 'PRO' || user.subscriptionType === 'PRO_PLUS')
  const isFirstOffer = user.offers.length === 0

  console.log('🔍 Free publish check:', {
    hasProSubscription,
    isFirstOffer,
    offerCount: user.offers.length
  })

  // Sprawdź czy użytkownik kwalifikuje się do darmowej publikacji
  if (!hasProSubscription && !isFirstOffer) {
    return res.status(403).json({ 
      success: false, 
      error: 'Darmowa publikacja dostępna tylko dla użytkowników PRO/PRO+ lub jako pierwsza oferta' 
    })
  }

  const { 
    offerType, 
    title, 
    description, 
    price, 
    category, 
    location, 
    contactName, 
    contactEmail, 
    contactPhone 
  } = req.body

  const publishType = isFirstOffer ? 'pierwsza oferta' : 'PRO/PRO+'
  console.log(`Publikuję darmowe ogłoszenie (${publishType}):`, {
    title,
    category,
    location
  })

    // Tworzenie ogłoszenia w bazie danych
    const offer = await prisma.offer.create({
      data: {
        offerType,
        title,
        description,
        price: parseFloat(price) || 0,
        category,
        location,
        contactName,
        contactEmail,
        contactPhone: contactPhone || '',
        promoted: false, // Podstawowa publikacja bez promocji
        ownerId: userId, // Użyj rzeczywistego ID użytkownika
        createdAt: new Date(),
        updatedAt: new Date()
      }
    })

    console.log('Ogłoszenie PRO opublikowane:', offer.id)

    res.status(200).json({
      success: true,
      offerId: offer.id,
      message: `Ogłoszenie opublikowane za darmo (${publishType})`
    })

  } catch (error) {
    console.error('Błąd publikacji darmowej:', error)
    res.status(500).json({
      success: false,
      error: 'Błąd serwera podczas publikacji'
    })
  }
}
