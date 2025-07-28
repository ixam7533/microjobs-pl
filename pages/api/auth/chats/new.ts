// pages/api/auth/chats/new.ts
import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../../../lib/prisma'
import { getUserFromRequest } from '../../../../lib/auth'
import { verifyToken } from '../../../../lib/jwt'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  console.log('🚀 Chat API called:', req.method)
  
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  // Obsługa tokenu z cookie lub Authorization header
  let userAuth = await getUserFromRequest(req)
  console.log('🔍 getUserFromRequest result:', !!userAuth)
  
  if (!userAuth) {
    const authHeader = req.headers.authorization
    console.log('🔍 Authorization header:', !!authHeader)
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7)
      console.log('🔍 Token from header:', !!token)
      try {
        userAuth = verifyToken(token) as { id: number; email: string }
        console.log('✅ Token verified:', userAuth?.email)
      } catch (error) {
        console.log('❌ Token verification failed:', error)
        return res.status(401).json({ error: 'Invalid token' })
      }
    }
  }

  const { withEmail, offerId } = req.body as { withEmail?: string; offerId?: string }
  console.log('📨 Chat request:', { userAuth: userAuth?.email, withEmail, offerId })

  if (!userAuth) {
    console.log('❌ No user auth - returning 401')
    return res.status(401).json({ error: 'Unauthorized' })
  }
  if (!withEmail) {
    console.log('❌ Missing withEmail - returning 400')
    return res.status(400).json({ error: 'Missing withEmail' })
  }

  let you = await prisma.user.findUnique({ where: { email: userAuth.email } })
  let other = await prisma.user.findUnique({ where: { email: withEmail } })
  
  console.log('🔍 Chat participants:')
  console.log('  - You (logged user):', userAuth.email, '-> found:', !!you)
  console.log('  - Other (offer owner):', withEmail, '-> found:', !!other)
  
  // Jeśli drugi użytkownik nie istnieje, spróbuj go stworzyć jako podstawowego użytkownika
  if (!other) {
    console.log('🔧 Creating basic user for chat participant:', withEmail)
    try {
      other = await prisma.user.create({
        data: {
          email: withEmail,
          name: withEmail.split('@')[0], // Użyj części przed @ jako nazwy
          confirmed: false, // Nie potwierdzony, bo to tylko email kontaktowy
          subscriptionType: null,
          subscriptionStart: null,
          subscriptionEnd: null,
          promotionsUsed: 0,
          promotionsLimit: 0
        }
      })
      console.log('✅ Basic user created for chat:', other.email)
    } catch (error) {
      console.error('❌ Failed to create basic user:', error)
      return res.status(500).json({ error: 'Failed to create chat participant' })
    }
  }
  
  if (!you || !other) {
    console.log('❌ User(s) not found - you:', !!you, 'other:', !!other)
    return res.status(404).json({ error: 'User(s) not found' })
  }

  // Jeśli już jest czat między tymi userami – zwracamy istniejący
  let chat = await prisma.chat.findFirst({
    where: {
      participants: { some: { userId: you.id } },
      AND: { participants: { some: { userId: other.id } } },
    },
  })

  if (!chat) {
    chat = await prisma.chat.create({
      data: {
        participants: {
          create: [
            { userId: you.id },
            { userId: other.id },
          ],
        },
      },
    })
  }

  return res.status(201).json({ chatId: chat.id })
}
