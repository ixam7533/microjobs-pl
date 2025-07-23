// pages/api/offers/view.ts
import { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../../lib/prisma'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { offerId } = req.body

    if (!offerId) {
      return res.status(400).json({ error: 'Offer ID is required' })
    }

    // Zwiększ licznik wyświetleń
    await prisma.$executeRaw`
      UPDATE Offer 
      SET views = views + 1 
      WHERE id = ${parseInt(offerId)}
    `

    res.status(200).json({ success: true })

  } catch (error) {
    console.error('View offer error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}
