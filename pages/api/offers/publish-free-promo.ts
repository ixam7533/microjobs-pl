// pages/api/offers/publish-free-promo.ts - Darmowa publikacja + promocja dla PRO+
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

    // Sprawdź czy użytkownik ma PRO+ i może używać darmowych promocji
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        subscriptionType: true,
        subscriptionEnd: true,
        promotionsUsed: true
      }
    })

    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' })
    }

    // Sprawdź czy użytkownik ma aktywną subskrypcję PRO+
    const now = new Date()
    const hasActiveSubscription = user.subscriptionEnd && user.subscriptionEnd > now
    
    if (!hasActiveSubscription || user.subscriptionType !== 'PRO_PLUS') {
      return res.status(403).json({ 
        success: false, 
        error: 'Tylko użytkownicy PRO+ mogą korzystać z darmowych promocji' 
      })
    }

    // Sprawdź limit promocji dla PRO+ (3 miesięcznie)
    if (user.promotionsUsed >= 3) {
      return res.status(403).json({
        success: false,
        error: 'Wykorzystałeś już wszystkie promocje PRO+ w tym miesiącu (3/3)'
      })
    }

    console.log('Publikuję darmowe ogłoszenie + promocja PRO+ (limit 3/miesiąc):', {
      title,
      category,
      location,
      userEmail: user.email,
      currentPromotionsUsed: user.promotionsUsed
    })

    // Tworzenie ogłoszenia w bazie danych z promocją
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
        promoted: true,
        promotedUntil: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 dni promocji dla PRO+
        ownerId: userId, // Użyj rzeczywistego ID użytkownika
        createdAt: new Date(),
        updatedAt: new Date()
      }
    })

    // Aktualizuj licznik promocji dla PRO+ (limit 3/miesiąc)
    await prisma.user.update({
      where: { id: userId },
      data: {
        promotionsUsed: user.promotionsUsed + 1
      }
    })

    console.log('Ogłoszenie + promocja PRO+ opublikowane:', {
      offerId: offer.id,
      newPromotionsUsed: user.promotionsUsed + 1,
      promotionsRemaining: Math.max(0, 3 - (user.promotionsUsed + 1))
    })

    const promotionsRemaining = Math.max(0, 3 - (user.promotionsUsed + 1))

    res.status(200).json({
      success: true,
      offerId: offer.id,
      promotionsRemaining,
      message: `Ogłoszenie z promocją opublikowane. Pozostało promocji PRO+: ${promotionsRemaining}/3`
    })

  } catch (error) {
    console.error('Błąd publikacji darmowej promocji:', error)
    res.status(500).json({
      success: false,
      error: 'Błąd serwera podczas publikacji'
    })
  }
}
