import type { NextApiRequest, NextApiResponse } from 'next'
import { verifyToken } from '../../../lib/jwt'
import prisma from '../../../lib/prisma'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query
  const chatId = parseInt(id as string)

  if (!chatId) {
    return res.status(400).json({ error: 'Invalid chat ID' })
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

    // Check if user has access to this chat
    const chat = await prisma.chat.findFirst({
      where: {
        id: chatId,
        participants: {
          some: { userId: userId }
        }
      }
    })

    if (!chat) {
      return res.status(404).json({ error: 'Chat not found or access denied' })
    }

    if (req.method === 'GET') {
      // Get messages for this chat
      const messages = await prisma.message.findMany({
        where: { chatId: chatId },
        orderBy: { createdAt: 'asc' },
        include: {
          sender: true
        }
      })

      const formattedMessages = messages.map(msg => ({
        id: msg.id,
        text: msg.content,
        fromMe: msg.senderId === userId,
      }))

      return res.status(200).json(formattedMessages)

    } else if (req.method === 'POST') {
      // Send a new message
      const { text } = req.body

      if (!text || text.trim() === '') {
        return res.status(400).json({ error: 'Message text is required' })
      }

      const message = await prisma.message.create({
        data: {
          content: text.trim(),
          senderId: userId,
          chatId: chatId,
        }
      })

      const newMsg = {
        id: message.id,
        text: message.content,
        fromMe: true,
      }

      return res.status(200).json(newMsg)

    } else {
      return res.status(405).json({ error: 'Method not allowed' })
    }

  } catch (error) {
    console.error('Chat API error:', error)
    return res.status(500).json({ error: 'Internal server error' })
  }
}
