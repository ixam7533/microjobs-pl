// pages/api/auth/me.ts
import type { NextApiRequest, NextApiResponse } from 'next'
import { getUserFromRequest } from '../../../lib/auth'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = getUserFromRequest(req) as { id: number; email: string }
  if (!session) return res.status(401).json({ user: null })

  // możesz dodać też confirmed albo inne flagi
  const user = await prisma.user.findUnique({
    where: { id: session.id },
    select: { email: true, confirmed: true }
  })

  return res.status(200).json({ user })
}
