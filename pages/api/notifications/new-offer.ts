// pages/api/notifications/new-offer.ts
import { NextApiRequest, NextApiResponse } from 'next'
import { sendEmail } from '../../../lib/mailer'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  try {
    const { title, category, contactEmail, price } = req.body

    const emailContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #3b82f6;">Nowe ogłoszenie na MicroJobs</h2>
        
        <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="margin-top: 0; color: #1f2937;">Szczegóły ogłoszenia:</h3>
          <p><strong>Tytuł:</strong> ${title}</p>
          <p><strong>Kategoria:</strong> ${category}</p>
          <p><strong>Cena:</strong> ${price} zł</p>
          <p><strong>Email kontaktowy:</strong> ${contactEmail}</p>
        </div>
        
        <div style="background: #fef3c7; padding: 15px; border-radius: 8px; border-left: 4px solid #f59e0b;">
          <p style="margin: 0; color: #92400e;">
            <strong>Wymagane działanie:</strong> Sprawdź ogłoszenie pod kątem zgodności z regulaminem i potwierdź publikację.
          </p>
        </div>
        
        <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
          <p style="color: #6b7280; font-size: 14px;">
            To powiadomienie zostało wysłane automatycznie z systemu MicroJobs.
          </p>
        </div>
      </div>
    `

    await sendEmail(
      'unlimitedcontentg@gmail.com',
      'Nowe ogłoszenie wymaga weryfikacji - MicroJobs',
      emailContent
    )

    res.status(200).json({ message: 'Powiadomienie wysłane pomyślnie' })
  } catch (error) {
    console.error('Błąd wysyłania powiadomienia:', error)
    res.status(500).json({ message: 'Błąd serwera' })
  }
}
