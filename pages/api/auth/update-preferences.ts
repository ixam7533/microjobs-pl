import { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../../lib/prisma'
import { verifyToken } from '../../../lib/jwt'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  try {
    const token = req.headers.authorization?.replace('Bearer ', '') || req.cookies.token
    
    if (!token) {
      return res.status(401).json({ message: 'Nie jesteś zalogowany' })
    }

    const decoded = verifyToken(token) as any
    if (!decoded) {
      return res.status(401).json({ message: 'Nieprawidłowy token' })
    }

    const { emailNotifications, theme, language } = req.body

    // Tutaj możesz dodać logikę aktualizacji preferencji
    // Na razie zapisujemy to w localStorage po stronie frontendu
    
    res.status(200).json({ 
      message: 'Ustawienia zostały zapisane pomyślnie',
      preferences: {
        emailNotifications,
        theme,
        language
      }
    })
  } catch (error) {
    console.error('Błąd zapisywania ustawień:', error)
    res.status(500).json({ message: 'Wewnętrzny błąd serwera' })
  }
}
