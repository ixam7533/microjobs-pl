import type { NextApiRequest, NextApiResponse } from 'next'
import { verifyToken } from '../../lib/jwt'
import prisma from '../../lib/prisma'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
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

    // Simple test - just return user info
    const user = await prisma.user.findUnique({
      where: { id: userId }
    })

    if (!user) {
      return res.status(404).json({ error: 'User not found' })
    }

    return res.status(200).json({ 
      message: 'Chat test OK',
      userId: userId,
      userEmail: user.email
    })

  } catch (error) {
    console.error('Chat test API error:', error)
    return res.status(500).json({ error: 'Internal server error', details: String(error) })
  }
}
