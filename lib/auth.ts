// lib/auth.ts
import type { NextApiRequest } from 'next'
import { parse } from 'cookie'
import { verifyToken } from './jwt'   // your existing JWT helper

export function getUserFromRequest(req: NextApiRequest) {
  const cookies = parse(req.headers.cookie || '')
  if (!cookies.token) return null

  try {
    return verifyToken(cookies.token) as { id: number; email: string }
  } catch {
    return null
  }
}
