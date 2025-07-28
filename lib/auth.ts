// lib/auth.ts
import type { NextApiRequest } from 'next'
import { parse } from 'cookie'
import { verifyToken } from './jwt'   // your existing JWT helper
import { getToken } from 'next-auth/jwt'
import prisma from './prisma'

export async function getUserFromRequest(req: NextApiRequest) {
  // Sprawdź NextAuth token (logowanie społecznościowe)
  try {
    const nextAuthToken = await getToken({ 
      req,
      secret: process.env.NEXTAUTH_SECRET 
    })
    if (nextAuthToken && nextAuthToken.email) {
      console.log('✅ auth.ts - NextAuth token znaleziony:', nextAuthToken.email)
      
      // Pobierz ID użytkownika z bazy danych
      let user = await prisma.user.findUnique({
        where: { email: nextAuthToken.email },
        select: { id: true, email: true }
      })
      
      // Jeśli użytkownik NextAuth nie istnieje w bazie, utwórz go
      if (!user) {
        console.log('🔧 auth.ts - Creating NextAuth user in database:', nextAuthToken.email)
        try {
          user = await prisma.user.create({
            data: {
              email: nextAuthToken.email!,
              name: nextAuthToken.name || null,
              image: nextAuthToken.picture || null,
              confirmed: true, // NextAuth użytkownicy są automatycznie potwierdzeni
              subscriptionType: null,
              subscriptionStart: null,
              subscriptionEnd: null,
              promotionsUsed: 0,
              promotionsLimit: 0
            },
            select: { id: true, email: true }
          })
          console.log('✅ auth.ts - NextAuth user created:', user.email)
        } catch (error) {
          console.error('❌ auth.ts - Failed to create NextAuth user:', error)
          return null
        }
      }
      
      return {
        id: user.id,
        email: user.email
      }
    }
  } catch (error) {
    console.log('⚠️ auth.ts - błąd NextAuth token:', (error as Error).message)
  }

  // Jeśli nie ma NextAuth token, sprawdź własny JWT token
  const cookies = parse(req.headers.cookie || '')
  console.log('🔍 auth.ts - dostępne cookies:', Object.keys(cookies))
  console.log('🔍 auth.ts - token cookie:', !!cookies.token)
  
  if (!cookies.token) {
    console.log('❌ auth.ts - brak tokenów')
    return null
  }

  try {
    const decoded = verifyToken(cookies.token) as { id: number; email: string }
    console.log('✅ auth.ts - JWT token zweryfikowany:', decoded.email)
    return decoded
  } catch (error) {
    console.log('❌ auth.ts - błąd weryfikacji JWT tokenu:', (error as Error).message)
    return null
  }
}
