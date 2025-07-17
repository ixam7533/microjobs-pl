import { NextApiRequest, NextApiResponse } from 'next'

// Tymczasowy endpoint do konfiguracji OAuth
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  const { provider, clientId, clientSecret } = req.body

  if (!provider || !clientId || !clientSecret) {
    return res.status(400).json({ message: 'Missing required fields' })
  }

  // Walidacja podstawowa
  if (provider === 'google') {
    if (!clientId.includes('googleusercontent.com')) {
      return res.status(400).json({ message: 'Invalid Google Client ID format' })
    }
  }

  if (provider === 'facebook') {
    if (!/^\d+$/.test(clientId)) {
      return res.status(400).json({ message: 'Invalid Facebook App ID format' })
    }
  }

  // Symulacja zapisu do .env.local
  const fs = require('fs')
  const path = require('path')
  const envPath = path.join(process.cwd(), '.env.local')
  
  try {
    let envContent = fs.readFileSync(envPath, 'utf8')
    
    if (provider === 'google') {
      envContent = envContent.replace(
        /GOOGLE_CLIENT_ID=.*/,
        `GOOGLE_CLIENT_ID=${clientId}`
      )
      envContent = envContent.replace(
        /GOOGLE_CLIENT_SECRET=.*/,
        `GOOGLE_CLIENT_SECRET=${clientSecret}`
      )
    } else if (provider === 'facebook') {
      envContent = envContent.replace(
        /FACEBOOK_CLIENT_ID=.*/,
        `FACEBOOK_CLIENT_ID=${clientId}`
      )
      envContent = envContent.replace(
        /FACEBOOK_CLIENT_SECRET=.*/,
        `FACEBOOK_CLIENT_SECRET=${clientSecret}`
      )
    }
    
    fs.writeFileSync(envPath, envContent)
    
    res.status(200).json({ 
      message: `${provider} OAuth configured successfully`,
      restart: true 
    })
  } catch (error) {
    res.status(500).json({ message: 'Error updating environment file' })
  }
}
