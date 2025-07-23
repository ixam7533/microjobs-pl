import { PrismaClient } from '@prisma/client'
// TODO: Ensure the following import path is correct and the file exists.
// If the file does not exist, create '../../../lib/auth.ts' and export getUserFromRequest from it.
 import { getUserFromRequest } from '../../../../lib/auth'

const prisma = new PrismaClient()

import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const user = await getUserFromRequest(req)
  if (!user) return res.status(401).end()

  if (req.method === 'GET') {
    const inbox = await prisma.message.findMany({
      where: { receiverId: user.id },
      include: { sender: true }
    })
    res.json(inbox)
  }

  if (req.method === 'POST') {
    const { receiverId, content, chatId } = req.body
    const msg = await prisma.message.create({
      data: {
        content,
        senderId: user.id,
        receiverId,
        chatId: chatId || 1 // Temporary fallback
      }
    })
    res.status(201).json(msg)
  }
}
