// lib/mailer.ts

import nodemailer from 'nodemailer'
// Define Offer type locally if not exported by @prisma/client
type Offer = {
  title: string
  description: string
  price: number
  ownerEmail: string
}

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
})

export async function sendEmail(to: string, subject: string, html: string) {
  try {
    await transporter.sendMail({
      from: '"MicroJobs" <no-reply@microjobs.pl>',
      to,
      subject,
      html,
    })
  } catch (error) {
    console.error('Błąd wysyłania emaila:', error)
    throw error
  }
}

export async function sendNewOfferNotification(offer: Offer) {
  const html = `
    <h2>Nowe ogłoszenie dodane</h2>
    <p><strong>Tytuł:</strong> ${offer.title}</p>
    <p><strong>Opis:</strong> ${offer.description}</p>
    <p><strong>Cena:</strong> ${offer.price} zł</p>
    <p><strong>Użytkownik:</strong> ${offer.ownerEmail}</p>
    <p><a href="https://your-domain.com/profile">Zobacz w panelu</a></p>
  `

  await transporter.sendMail({
    from: '"MicroJobs" <no-reply@microjobs.pl>',
    to: process.env.MOD_EMAIL, // np. moderator@microjobs.pl
    subject: 'Nowe ogłoszenie do moderacji',
    html,
  })
}
