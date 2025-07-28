// pages/api/admin/users.ts
import { NextApiRequest, NextApiResponse } from 'next'
import { verifyToken } from '../../../lib/jwt'
import { parse } from 'cookie'
import prisma from '../../../lib/prisma'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const cookies = parse(req.headers.cookie || '')
    const token = cookies.token

    if (!token) {
      return res.status(401).json({ error: 'Token required' })
    }

    const decoded = verifyToken(token) as { id: string; email: string }
    
    if (!decoded || !decoded.id) {
      return res.status(401).json({ error: 'Invalid token' })
    }

    // Sprawdź czy użytkownik to admin
    const adminUser = await prisma.user.findUnique({
      where: { id: parseInt(decoded.id) }
    })

    const isAdmin = adminUser?.isAdmin || adminUser?.email === 'microjobsj7@gmail.com'

    if (!isAdmin) {
      return res.status(403).json({ error: 'Admin access required' })
    }

    // Pobierz wszystkich użytkowników z podstawowymi informacjami
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        subscriptionType: true,
        subscriptionStart: true,
        subscriptionEnd: true,
        promotionsUsed: true,
        createdAt: true,
        isAdmin: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    // Dodaj informację o statusie subskrypcji
    const usersWithStatus = users.map((user: any) => ({
      ...user,
      isSubscriptionActive: user.subscriptionType !== 'FREE' && 
        (!user.subscriptionEnd || user.subscriptionEnd > new Date()),
      daysRemaining: user.subscriptionEnd ? 
        Math.max(0, Math.ceil((user.subscriptionEnd.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))) : 
        null
    }))

    res.status(200).json({ users: usersWithStatus })

  } catch (error) {
    console.error('Admin users list error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}
