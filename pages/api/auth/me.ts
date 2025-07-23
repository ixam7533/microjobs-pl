// pages/api/auth/me.ts
import type { NextApiRequest, NextApiResponse } from 'next'
import { getToken } from 'next-auth/jwt'
import { PrismaClient } from '@prisma/client'
import { getUserFromRequest } from '../../../lib/auth'

const prisma = new PrismaClient()

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  console.log('🔍 /api/auth/me called')
  console.log('🍪 Cookies:', Object.keys(req.cookies))
  
  let userInfo = null

  // Sprawdź NextAuth token (logowanie społecznościowe)
  const nextAuthToken = await getToken({ 
    req,
    secret: process.env.NEXTAUTH_SECRET 
  })
  console.log('🔑 NextAuth token:', !!nextAuthToken)
  if (nextAuthToken && nextAuthToken.email) {
    userInfo = { email: nextAuthToken.email }
    console.log('✅ NextAuth user:', nextAuthToken.email)
  }

  // Jeśli nie ma NextAuth token, sprawdź własny JWT token (logowanie email/hasło)
  if (!userInfo) {
    const jwtUser = await getUserFromRequest(req)
    console.log('🔑 JWT user:', !!jwtUser)
    if (jwtUser) {
      userInfo = jwtUser
      console.log('✅ JWT user:', jwtUser.email)
    }
  }

  if (!userInfo) {
    console.log('❌ No user found')
    return res.status(401).json({ user: null })
  }

  // Znajdź użytkownika w bazie danych
  let user = await prisma.user.findUnique({
    where: { email: userInfo.email },
    select: {
        id: true,
        email: true,
        name: true,
        confirmed: true,
        subscriptionType: true,
        subscriptionStart: true,
        subscriptionEnd: true,
        promotionsUsed: true,
        emailReminder: true
      }
  })

  // Jeśli użytkownik NextAuth nie istnieje w bazie, utwórz go
  if (!user && nextAuthToken) {
    console.log('🔧 Creating NextAuth user in database:', nextAuthToken.email)
    try {
      user = await prisma.user.create({
        data: {
          email: nextAuthToken.email!,
          name: nextAuthToken.name || null,
          image: nextAuthToken.picture || null,
          confirmed: true, // NextAuth użytkownicy są automatycznie potwierdzeni
          subscriptionType: null,
          subscriptionStart: null,
          subscriptionEnd: null,
          promotionsUsed: 0,
          emailReminder: true
        },
        select: { 
          id: true,
          email: true, 
          confirmed: true,
          name: true,
          image: true,
          subscriptionType: true,
          subscriptionStart: true,
          subscriptionEnd: true,
          promotionsUsed: true,
          emailReminder: true
        }
      })
      console.log('✅ NextAuth user created:', user.email)
    } catch (error) {
      console.error('❌ Failed to create NextAuth user:', error)
      return res.status(500).json({ error: 'Failed to create user' })
    }
  }

  if (!user) {
    console.log('❌ User still not found after creation attempt')
    return res.status(404).json({ user: null })
  }

  // Sprawdź czy użytkownik ma aktywną subskrypcję
  const now = new Date()
  const hasActiveSubscription = user.subscriptionEnd && user.subscriptionEnd > now
  
  // Oblicz limit promocji na podstawie typu subskrypcji
  let promotionsLimit = 0
  if (hasActiveSubscription && user.subscriptionType) {
    switch (user.subscriptionType) {
      case 'PRO':
        promotionsLimit = 1 // 1 darmowe promowanie miesięcznie dla PRO
        break
      case 'PRO_PLUS':
        promotionsLimit = 3 // 3 darmowe promowania miesięcznie dla PRO+
        break
      default:
        promotionsLimit = 0
    }
  }
  
  const userWithSubscription = {
    ...user,
    hasPro: hasActiveSubscription,
    proType: hasActiveSubscription ? user.subscriptionType : null,
    promotionsRemaining: hasActiveSubscription ? (promotionsLimit - user.promotionsUsed) : 0
  }

  return res.status(200).json({ user: userWithSubscription })
}
