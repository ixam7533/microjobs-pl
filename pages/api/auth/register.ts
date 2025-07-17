import type { NextApiRequest, NextApiResponse } from 'next'
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'
import { v4 as uuid } from 'uuid'

const prisma = new PrismaClient()

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') return res.status(405).end()

  const { email, password } = req.body as {
    email: string
    password: string
  }
  if (!email || !password) {
    return res
      .status(400)
      .json({ error: 'Wypełnij pola e-mail i hasło.' })
  }

  const hash = await bcrypt.hash(password, 10)
  const confirmToken = uuid()

  // dynamiczny origin (localhost lub produkcja)
  const proto = req.headers['x-forwarded-proto'] || 'http'
  const host = req.headers.host
  const origin = `${proto}://${host}`

  // link potwierdzający
  const confirmLink = `${origin}/api/auth/confirm?token=${confirmToken}`

  try {
    await prisma.user.create({
      data: { email, hash, confirmed: false, confirmToken },
    })

    // zwróć link zamiast wysyłki maila
    return res.status(201).json({
      message: 'Zarejestrowano. Kliknij link, aby potwierdzić e-mail:',
      confirmLink,
    })
  } catch (e) {
    return res
      .status(400)
      .json({ error: 'Ten e-mail jest już zarejestrowany.' })
  }
}
