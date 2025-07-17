import type { NextApiRequest, NextApiResponse } from 'next'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { token } = req.query
  if (typeof token !== 'string') {
    return res.status(400).end()
  }

  await prisma.user.updateMany({
    where: { confirmToken: token },
    data: { confirmed: true, confirmToken: null },
  })

  // przekieruj na login z potwierdzeniem
  res.writeHead(302, { Location: '/login?confirmed=1' })
  res.end()
}
