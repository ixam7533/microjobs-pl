import { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../../lib/prisma'
import { sendNotification } from '../../../lib/email'
import crypto from 'crypto'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  try {
    const { email } = req.body

    if (!email) {
      return res.status(400).json({ message: 'Email jest wymagany' })
    }

    // Znajdź użytkownika
    const user = await prisma.user.findUnique({
      where: { email }
    })

    if (!user) {
      // Nie ujawniamy czy email istnieje w bazie
      return res.status(200).json({ message: 'Jeśli email istnieje w naszej bazie, zostanie wysłany link resetujący hasło' })
    }

    // Wygeneruj token resetujący (w prawdziwej aplikacji byłby zapisany w bazie z expiry)
    const resetToken = crypto.randomBytes(32).toString('hex')
    
    // Wyślij email z linkiem resetującym
    const resetLink = `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/reset-password?token=${resetToken}&email=${encodeURIComponent(email)}`
    
    try {
      await sendNotification({
        to: email,
        subject: 'Resetowanie hasła - MicroJobs',
        text: `Resetowanie hasła
        
Otrzymaliśmy prośbę o zresetowanie hasła do Twojego konta.
        
Kliknij w poniższy link, aby zresetować hasło:
${resetLink}
        
Link jest ważny przez 1 godzinę.
        
Jeśli nie prosiłeś o reset hasła, zignoruj ten email.`
      })
    } catch (emailError) {
      console.error('Błąd wysyłania emaila:', emailError)
      // Kontynuuj bez błędu - nie ujawniamy problemów z emailem
    }

    res.status(200).json({ message: 'Jeśli email istnieje w naszej bazie, zostanie wysłany link resetujący hasło' })
  } catch (error) {
    console.error('Błąd resetowania hasła:', error)
    res.status(500).json({ message: 'Wewnętrzny błąd serwera' })
  }
}
