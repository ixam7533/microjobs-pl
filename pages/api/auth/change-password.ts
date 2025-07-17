import { NextApiRequest, NextApiResponse } from 'next'
import bcrypt from 'bcrypt'
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

    const { currentPassword, newPassword } = req.body

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: 'Wszystkie pola są wymagane' })
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ message: 'Nowe hasło musi mieć co najmniej 6 znaków' })
    }

    // Znajdź użytkownika
    const user = await prisma.user.findUnique({
      where: { email: decoded.email }
    })

    if (!user || !user.hash) {
      return res.status(404).json({ message: 'Użytkownik nie znaleziony lub brak hasła' })
    }

    // Sprawdź obecne hasło
    const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.hash)
    if (!isCurrentPasswordValid) {
      return res.status(400).json({ message: 'Obecne hasło jest nieprawidłowe' })
    }

    // Hashuj nowe hasło
    const hashedNewPassword = await bcrypt.hash(newPassword, 12)

    // Aktualizuj hasło
    await prisma.user.update({
      where: { email: decoded.email },
      data: { hash: hashedNewPassword }
    })

    res.status(200).json({ message: 'Hasło zostało zmienione pomyślnie' })
  } catch (error) {
    console.error('Błąd zmiany hasła:', error)
    res.status(500).json({ message: 'Wewnętrzny błąd serwera' })
  }
}
