// pages/api/auth/chats/index.ts
import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../../../lib/prisma'
import { getUserFromRequest } from '../../../../lib/auth'

export type ChatSummary = {
  chatId: number
  withUser: string
  lastMessage: string | null
  lastAt: Date | null
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ChatSummary[] | { error: string }>
) {
  const userAuth = getUserFromRequest(req)
  if (!userAuth) return res.status(401).json({ error: 'Unauthorized' })

  const user = await prisma.user.findUnique({
    where: { email: userAuth.email },
    include: {
      chatParticipants: {
        include: {
          chat: {
            include: {
              participants: { include: { user: true } },
              messages: { orderBy: { createdAt: 'desc' }, take: 1 }
            }
          }
        }
      }
    }
  })
  if (!user) return res.status(404).json({ error: 'User not found' })

  type CP = typeof user.chatParticipants[number]
  type P  = CP['chat']['participants'][number]

  const chats: ChatSummary[] = user.chatParticipants.map((cp: CP) => {
    const other = cp.chat.participants.find((p: P) => p.user.email !== userAuth.email)!
    const last  = cp.chat.messages[0]
    return {
      chatId: cp.chat.id,
      withUser: other.user.email,
      lastMessage: last?.content ?? null,
      lastAt:      last?.createdAt ?? null
    }
  })

  res.status(200).json(chats)
}
