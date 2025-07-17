// pages/api/auth/logout.ts
import type { NextApiRequest, NextApiResponse } from 'next'
import { serialize } from 'cookie'

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  // nadpisujemy cookie token pustym i natychmiast wygasłym
  res.setHeader(
    'Set-Cookie',
    serialize('token', '', {
      path: '/',
      httpOnly: true,
      maxAge: 0,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
    })
  )
  res.status(200).json({ ok: true })
}
