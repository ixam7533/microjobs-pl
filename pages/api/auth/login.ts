// pages/api/auth/login.ts

import type { NextApiRequest, NextApiResponse } from 'next'
import { serialize } from 'cookie'
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'
import { signToken } from '../../../lib/jwt'

const prisma = new PrismaClient()

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') return res.status(405).end()

  const { email, password, remember } = req.body as {
    email: string
    password: string
    remember?: boolean
  }
  if (!email || !password) {
    return res.status(400).json({ error: 'Wypełnij wszystkie pola.' })
  }

  const user = await prisma.user.findUnique({ where: { email } })
  if (!user || !user.hash) {
    return res.status(401).json({ error: 'Nieprawidłowe dane.' })
  }
  if (!user.confirmed) {
    return res.status(403).json({ error: 'Potwierdź e-mail.' })
  }

  const valid = await bcrypt.compare(password, user.hash)
  if (!valid) {
    return res.status(401).json({ error: 'Nieprawidłowe dane.' })
  }

  // czas życia cookie
  const maxAge = remember ? 60 * 60 * 24 * 30 : 60 * 60 * 8
  const token = signToken({ id: user.id, email }, `${maxAge}s`)

  // ustaw ciasteczko z JWT
  res.setHeader(
    'Set-Cookie',
    serialize('token', token, {
      httpOnly: true,
      path: '/',
      maxAge,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
    })
  )

  return res.status(200).json({ email: user.email })
}
