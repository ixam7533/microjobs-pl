import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
})

export async function sendNotification(opts: {
  to: string
  subject: string
  text: string
}) {
  await transporter.sendMail({
    from: process.env.SMTP_USER,
    to: opts.to,
    subject: opts.subject,
    text: opts.text
  })
}

export async function sendReminderEmail(email: string, data: {
  subscriptionType: string
  expiryDate: Date
}) {
  const formattedDate = data.expiryDate.toLocaleDateString('pl-PL', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })

  const subject = `Twoja subskrypcja ${data.subscriptionType} wygasa za 4 dni`
  const text = `
Cześć!

Twoja subskrypcja ${data.subscriptionType} na platformie MicroJobs wygasa ${formattedDate}.

Aby nie stracić dostępu do swoich korzyści, odnów subskrypcję już teraz:
- Brak reklam
- Promowanie ogłoszeń
- Wsparcie techniczne
- I wiele więcej!

Odnów subskrypcję: ${process.env.NEXT_PUBLIC_BASE_URL}/profile?tab=subscription

Jeśli nie chcesz otrzymywać więcej przypomnień, możesz wyłączyć je w ustawieniach swojego konta.

Pozdrawiamy,
Zespół MicroJobs
  `

  await transporter.sendMail({
    from: process.env.SMTP_USER,
    to: email,
    subject,
    text
  })
}
