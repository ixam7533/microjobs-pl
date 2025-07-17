// pages/api/ratings/check.ts
import { NextApiRequest, NextApiResponse } from 'next'
import { PrismaClient } from '@prisma/client'
import jwt from 'jsonwebtoken'

const prisma = new PrismaClient()

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { reviewedEmail, offerId } = req.query

    if (!reviewedEmail) {
      return res.status(400).json({ error: 'Missing reviewedEmail' })
    }

    // Sprawdź token
    const token = req.headers.authorization?.replace('Bearer ', '')
    if (!token) {
      return res.status(401).json({ error: 'No token provided' })
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { email: string }
    const reviewerEmail = decoded.email

    // Znajdź użytkowników
    const reviewer = await prisma.user.findUnique({
      where: { email: reviewerEmail }
    })

    const reviewed = await prisma.user.findUnique({
      where: { email: reviewedEmail as string }
    })

    if (!reviewer || !reviewed) {
      return res.status(200).json({ hasRated: false })
    }

    // Sprawdź czy ocena już istnieje
    const existingRating = await (prisma as any).rating.findFirst({
      where: {
        reviewerId: reviewer.id,
        reviewedId: reviewed.id,
        offerId: offerId ? parseInt(offerId as string) : null
      }
    })

    res.status(200).json({ 
      hasRated: !!existingRating 
    })

  } catch (error) {
    console.error('Error checking rating:', error)
    res.status(200).json({ hasRated: false })
  }
}
