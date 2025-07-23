import type { NextApiRequest, NextApiResponse } from 'next'
import { verifyToken } from '../../lib/jwt'
import prisma from '../../lib/prisma'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    // Verify user authentication
    const authToken = req.cookies.token
    if (!authToken) {
      return res.status(401).json({ error: 'Not authenticated' })
    }

    const payload = verifyToken(authToken)
    if (!payload || typeof payload === 'string' || !payload.id) {
      return res.status(401).json({ error: 'Invalid token' })
    }

    const userId = payload.id

    // Get all chats for this user
    const chats = await prisma.chat.findMany({
      where: {
        participants: {
          some: { userId: userId }
        }
      },
      include: {
        participants: {
          include: {
            user: true
          }
        },
        messages: {
          orderBy: { createdAt: 'desc' },
          take: 1,
          include: {
            sender: true
          }
        }
      }
    })

    const formattedChats = chats.map(chat => {
      // Find the other participant (not the current user)
      const otherParticipant = chat.participants.find(p => p.userId !== userId)
      const lastMessage = chat.messages[0]

      return {
        id: chat.id,
        withUser: otherParticipant?.user.name || otherParticipant?.user.email || 'Nieznany użytkownik',
        lastMessage: lastMessage ? lastMessage.content : 'Brak wiadomości'
      }
    })

    return res.status(200).json(formattedChats)

  } catch (error) {
    console.error('Chats list API error:', error)
    return res.status(500).json({ error: 'Internal server error' })
  }
}
