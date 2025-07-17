// pages/api/auth/chats/new.ts
import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../../../lib/prisma'
import { getUserFromRequest } from '../../../../lib/auth'
import { verifyToken } from '../../../../lib/jwt'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  // Obsługa tokenu z cookie lub Authorization header
  let userAuth = getUserFromRequest(req)
  
  if (!userAuth) {
    const authHeader = req.headers.authorization
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7)
      try {
        userAuth = verifyToken(token) as { id: number; email: string }
      } catch {
        return res.status(401).json({ error: 'Invalid token' })
      }
    }
  }

  const { withEmail } = req.body as { withEmail?: string }

  if (!userAuth) {
    return res.status(401).json({ error: 'Unauthorized' })
  }
  if (!withEmail) {
    return res.status(400).json({ error: 'Missing withEmail' })
  }

  const you = await prisma.user.findUnique({ where: { email: userAuth.email } })
  const other = await prisma.user.findUnique({ where: { email: withEmail } })
  if (!you || !other) {
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
