import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET
if (!JWT_SECRET) throw new Error('JWT_SECRET is missing in environment variables')

export function signToken(payload: Record<string, any>, expiresIn: string | number = '7d') {
  const options: any = { expiresIn: String(expiresIn) }
  return jwt.sign(payload, JWT_SECRET as string, options)
}

export function verifyToken(token: string) {
  return jwt.verify(token, JWT_SECRET as string)
}