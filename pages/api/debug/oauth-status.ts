// pages/api/debug/oauth-status.ts
import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') return res.status(405).end()

  // Debug info without exposing secrets
  const debugInfo = {
    NODE_ENV: process.env.NODE_ENV,
    NEXTAUTH_URL: process.env.NEXTAUTH_URL || 'NOT_SET',
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET ? 'SET' : 'NOT_SET',
    DATABASE_URL: process.env.DATABASE_URL ? 'SET' : 'NOT_SET',
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID ? 'SET' : 'NOT_SET',
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET ? 'SET' : 'NOT_SET',
    FACEBOOK_CLIENT_ID: process.env.FACEBOOK_CLIENT_ID ? 'SET' : 'NOT_SET',
    FACEBOOK_CLIENT_SECRET: process.env.FACEBOOK_CLIENT_SECRET ? 'SET' : 'NOT_SET',
    JWT_SECRET: process.env.JWT_SECRET ? 'SET' : 'NOT_SET',
    hasGoogleKeys: !!(process.env.GOOGLE_CLIENT_ID && 
                     process.env.GOOGLE_CLIENT_SECRET && 
                     process.env.GOOGLE_CLIENT_ID !== 'twoj_google_client_id' &&
                     process.env.GOOGLE_CLIENT_SECRET !== 'twoj_google_client_secret'),
    hasFacebookKeys: !!(process.env.FACEBOOK_CLIENT_ID && 
                        process.env.FACEBOOK_CLIENT_SECRET && 
                        process.env.FACEBOOK_CLIENT_ID !== 'twoj_facebook_client_id' &&
                        process.env.FACEBOOK_CLIENT_SECRET !== 'twoj_facebook_client_secret')
  }

  res.status(200).json(debugInfo)
}
