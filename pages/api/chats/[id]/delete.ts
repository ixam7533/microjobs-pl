// pages/api/chats/[id]/delete.ts
import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../../../lib/prisma'
import { getUserFromRequest } from '../../../../lib/auth'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'DELETE') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const userAuth = await getUserFromRequest(req)
  if (!userAuth) {
    return res.status(401).json({ error: 'Unauthorized' })
  }

  const { id } = req.query
  const chatId = parseInt(id as string)

  if (isNaN(chatId)) {
    return res.status(400).json({ error: 'Invalid chat ID' })
  }

  try {
    // Sprawdź czy użytkownik jest uczestnikiem chatu
    const chatParticipant = await prisma.chatParticipant.findFirst({
      where: {
        chatId: chatId,
        user: {
          email: userAuth.email
        }
      },
      include: {
        chat: {
          include: {
            participants: true,
            messages: true
          }
        }
      }
    })

    if (!chatParticipant) {
      return res.status(404).json({ error: 'Chat not found or you are not a participant' })
    }

    // Usuń wszystkie wiadomości z chatu
    await prisma.message.deleteMany({
      where: {
        chatId: chatId
      }
    })

    // Usuń uczestników chatu
    await prisma.chatParticipant.deleteMany({
      where: {
        chatId: chatId
      }
    })

    // Usuń chat
    await prisma.chat.delete({
      where: {
        id: chatId
      }
    })

    console.log(`✅ Chat ${chatId} został usunięty przez użytkownika ${userAuth.email}`)

    res.status(200).json({ success: true, message: 'Chat deleted successfully' })

  } catch (error) {
    console.error('💥 Error deleting chat:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}
