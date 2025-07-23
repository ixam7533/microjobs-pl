// pages/api/auth/chats/[id].ts

import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../../../lib/prisma'
import { getUserFromRequest } from '../../../../lib/auth'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // 1) Authenticate
  const user = await getUserFromRequest(req)
  if (!user) return res.status(401).json({ error: 'Unauthorized' })

  // 2) Parse & validate chatId
  const chatId = parseInt(req.query.id as string, 10)
  if (isNaN(chatId)) {
    return res.status(400).json({ error: 'Invalid chat ID' })
  }

  // 3) Check membership
  const membership = await prisma.chatParticipant.findUnique({
    where: { chatId_userId: { chatId, userId: user.id } }
  })
  if (!membership) {
    return res.status(403).json({ error: 'Forbidden' })
  }

  // 4) GET messages
  if (req.method === 'GET') {
    const messages = await prisma.message.findMany({
      where: { chatId },
      orderBy: { createdAt: 'asc' }
    })
    return res.status(200).json(messages)
  }

  // 5) POST new message
  if (req.method === 'POST') {
    const { content } = req.body as { content?: string }
    if (!content || typeof content !== 'string') {
      return res.status(400).json({ error: 'Missing content' })
    }
    const msg = await prisma.message.create({
      data: {
        content: content.trim(),
        chatId,
        senderId: user.id
      }
    })
    return res.status(201).json(msg)
  }

  // 6) Method not allowed
  res.setHeader('Allow', ['GET', 'POST'])
  return res.status(405).json({ error: 'Method not allowed' })
}
