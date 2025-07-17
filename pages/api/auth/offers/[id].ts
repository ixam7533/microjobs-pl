// pages/api/auth/offers/[id].ts
import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from 'lib/prisma'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const id = parseInt(req.query.id as string, 10)
  if (isNaN(id)) return res.status(400).json({ error: 'Invalid ID' })

  if (req.method === 'GET') {
    const off = await prisma.offer.findUnique({ where: { id } })
    return off ? res.status(200).json(off) : res.status(404).end()
  }

  if (req.method === 'PUT') {
    const updated = await prisma.offer.update({ where: { id }, data: req.body })
    return res.status(200).json(updated)
  }

  if (req.method === 'DELETE') {
    await prisma.offer.delete({ where: { id } })
    return res.status(204).end()
  }

  res.setHeader('Allow', ['GET','PUT','DELETE'])
  return res.status(405).end()
}
