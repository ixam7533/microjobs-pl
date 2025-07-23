// pages/api/offers/promote.ts
import { NextApiRequest, NextApiResponse } from 'next'
import { verifyToken } from '../../../lib/jwt'
import prisma from '../../../lib/prisma'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    // Pobierz token z cookies zamiast nagłówka Authorization
    const token = req.cookies.token
    
    console.log('🚀 Promote API called:', { hasToken: !!token })
    
    if (!token) {
      return res.status(401).json({ error: 'Token required' })
    }

    const decoded = verifyToken(token) as any
    
    if (!decoded || !decoded.id) {
      return res.status(401).json({ error: 'Invalid token' })
    }

    console.log('👤 User decoded:', decoded.email)

    const { offerId } = req.body

    if (!offerId) {
      return res.status(400).json({ error: 'Offer ID is required' })
    }

    console.log('📋 Promoting offer:', offerId)

    const user = await prisma.user.findUnique({
      where: { id: decoded.id }
    })

    if (!user) {
      return res.status(404).json({ error: 'User not found' })
    }

    console.log('👤 User found:', { 
      id: user.id,
      email: user.email, 
      subscriptionType: user.subscriptionType,
      subscriptionEnd: user.subscriptionEnd,
      promotionsUsed: user.promotionsUsed
    })

    // Check if user has active subscription and promotion limits
    const now = new Date()
    const hasActiveSubscription = user.subscriptionEnd && user.subscriptionEnd > now
    
    if (hasActiveSubscription) {
      // Sprawdź limit promocji dla użytkowników PRO/PRO+
      if (user.subscriptionType === 'PRO_PLUS') {
        // PRO+ ma limit 3 promocji miesięcznie
        if (user.promotionsUsed >= 3) {
          return res.status(403).json({ error: 'Wykorzystałeś już wszystkie promocje PRO+ w tym miesiącu (3/3)' })
        }
      } else if (user.subscriptionType === 'PRO') {
        // PRO ma limit 1 darmowe promowanie miesięcznie
        if (user.promotionsUsed >= 1) {
          return res.status(403).json({ error: 'Wykorzystałeś już swoją darmową promocję PRO w tym miesiącu (1/1). Możesz promować za opłatą.' })
        }
      }
    }
    // Użytkownicy bez PRO mogą promować za opłatą - nie sprawdzamy limitów

    // Check if offer exists and belongs to user
    const offer = await prisma.offer.findUnique({
      where: { id: parseInt(offerId) }
    })

    if (!offer) {
      return res.status(404).json({ error: 'Offer not found' })
    }

    if (offer.ownerId !== decoded.id) {
      return res.status(403).json({ error: 'You can only promote your own offers' })
    }

    // Check if offer is already promoted
    if (offer.promoted && offer.promotedUntil && offer.promotedUntil > now) {
      return res.status(400).json({ error: 'Offer is already promoted' })
    }

    // Automatyczne czyszczenie wygasłych promocji
    if (offer.promoted && offer.promotedUntil && offer.promotedUntil <= now) {
      await prisma.offer.update({
        where: { id: parseInt(offerId) },
        data: {
          promoted: false,
          promotedUntil: null
        }
      })
    }

    // Promote offer for 7 days
    const promotedUntil = new Date()
    promotedUntil.setDate(promotedUntil.getDate() + 7)

    await prisma.offer.update({
      where: { id: parseInt(offerId) },
      data: {
        promoted: true,
        promotedUntil
      }
    })

    // Update user's promotions used for both PRO and PRO+ users
    if (hasActiveSubscription) {
      console.log('🔄 Updating promotions counter for:', user.subscriptionType)
      if (user.subscriptionType === 'PRO') {
        // PRO użytkownicy mają limit promocji, aktualizuj licznik
        console.log('📊 PRO: Incrementing from', user.promotionsUsed, 'to', user.promotionsUsed + 1)
        await prisma.user.update({
          where: { id: decoded.id },
          data: {
            promotionsUsed: user.promotionsUsed + 1
          }
        })
      } else if (user.subscriptionType === 'PRO_PLUS') {
        // PRO+ ma limit 3 promocji miesięcznie, aktualizuj licznik
        console.log('⭐ PRO_PLUS: Incrementing from', user.promotionsUsed, 'to', user.promotionsUsed + 1)
        const updatedUser = await prisma.user.update({
          where: { id: decoded.id },
          data: {
            promotionsUsed: user.promotionsUsed + 1
          }
        })
        console.log('✅ PRO_PLUS: Updated successfully, new value:', updatedUser.promotionsUsed)
      }
    } else {
      console.log('❌ No active subscription, skipping promotions counter update')
    }

    // Create promotion usage record
    await prisma.promotionUsage.create({
      data: {
        userId: decoded.id,
        offerId: parseInt(offerId)
      }
    })

    // Calculate remaining promotions for response
    let promotionsRemaining = 0
    if (hasActiveSubscription) {
      if (user.subscriptionType === 'PRO_PLUS') {
        // PRO+ ma limit 3 promocji miesięcznie
        promotionsRemaining = Math.max(0, 3 - (user.promotionsUsed + 1))
      } else if (user.subscriptionType === 'PRO') {
        // PRO ma limit 1 darmowe promowanie miesięcznie
        promotionsRemaining = Math.max(0, 1 - (user.promotionsUsed + 1))
      }
    }

    res.status(200).json({ 
      success: true, 
      message: 'Offer promoted successfully',
      promotedUntil,
      promotionsRemaining,
      paymentProcessed: !hasActiveSubscription || user.subscriptionType === 'PRO' // Info czy była płatność
    })

  } catch (error) {
    console.error('Promote offer error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}
