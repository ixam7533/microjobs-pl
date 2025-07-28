// pages/api/admin/manage-subscription.ts
import { NextApiRequest, NextApiResponse } from 'next'
import { verifyToken } from '../../../lib/jwt'
import { parse } from 'cookie'
import prisma from '../../../lib/prisma'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
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

    const { userEmail, subscriptionType, duration } = req.body

    if (!userEmail || !subscriptionType) {
      return res.status(400).json({ error: 'User email and subscription type are required' })
    }

    if (!['FREE', 'PRO', 'PRO_PLUS'].includes(subscriptionType)) {
      return res.status(400).json({ error: 'Invalid subscription type' })
    }

    // Znajdź użytkownika do modyfikacji
    const targetUser = await prisma.user.findUnique({
      where: { email: userEmail }
    })

    if (!targetUser) {
      return res.status(404).json({ error: 'User not found' })
    }

    // Ustaw daty subskrypcji
    let subscriptionStart = new Date()
    let subscriptionEnd = null
    
    if (subscriptionType !== 'FREE') {
      const durationDays = duration || 30 // domyślnie 30 dni
      subscriptionEnd = new Date()
      subscriptionEnd.setDate(subscriptionEnd.getDate() + durationDays)
    }

    // Resetuj liczniki promocji
    const resetData: any = {
      subscriptionType,
      subscriptionStart,
      subscriptionEnd,
      promotionsUsed: 0
    }

    // Aktualizuj użytkownika
    const updatedUser = await prisma.user.update({
      where: { id: targetUser.id },
      data: resetData
    })

    console.log(`👑 Admin ${decoded.email} granted ${subscriptionType} to ${userEmail} for ${duration || 30} days`)

    res.status(200).json({ 
      success: true, 
      message: `Successfully granted ${subscriptionType} subscription to ${userEmail}`,
      user: {
        email: updatedUser.email,
        subscriptionType: updatedUser.subscriptionType,
        subscriptionEnd: updatedUser.subscriptionEnd
      }
    })

  } catch (error) {
    console.error('Admin manage subscription error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}
