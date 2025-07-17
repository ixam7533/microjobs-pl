import { getProviders } from 'next-auth/react'
import { useEffect, useState } from 'react'

export default function TestOAuth() {
  const [providers, setProviders] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProviders = async () => {
      try {
        const providers = await getProviders()
        console.log('Providers:', providers)
        setProviders(providers)
      } catch (error) {
        console.error('Error fetching providers:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchProviders()
  }, [])

  return (
    <div style={{ padding: '2rem', fontFamily: 'monospace' }}>
      <h1>OAuth Test</h1>
      
      <h2>Loading: {loading ? 'true' : 'false'}</h2>
      
      <h2>Providers:</h2>
      <pre>{JSON.stringify(providers, null, 2)}</pre>
      
      <h2>Environment Check:</h2>
      <p>NEXTAUTH_URL: {process.env.NEXTAUTH_URL || 'not set'}</p>
      <p>NEXTAUTH_SECRET: {process.env.NEXTAUTH_SECRET ? 'set' : 'not set'}</p>
      
      <h2>OAuth Keys:</h2>
      <p>Google Client ID: {process.env.GOOGLE_CLIENT_ID || 'not set'}</p>
      <p>Facebook Client ID: {process.env.FACEBOOK_CLIENT_ID || 'not set'}</p>
      
      <a href="/login">← Wróć do logowania</a>
    </div>
  )
}

export async function getServerSideProps() {
  return {
    props: {
      nextauth_url: process.env.NEXTAUTH_URL || 'not set',
      nextauth_secret: process.env.NEXTAUTH_SECRET ? 'set' : 'not set',
      google_client_id: process.env.GOOGLE_CLIENT_ID || 'not set',
      facebook_client_id: process.env.FACEBOOK_CLIENT_ID || 'not set'
    }
  }
}
