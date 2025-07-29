// pages/debug-oauth.tsx
import { useState, useEffect } from 'react'
import Link from 'next/link'

interface OAuthStatus {
  NODE_ENV: string
  NEXTAUTH_URL: string
  NEXTAUTH_SECRET: string
  DATABASE_URL: string
  GOOGLE_CLIENT_ID: string
  GOOGLE_CLIENT_SECRET: string
  FACEBOOK_CLIENT_ID: string
  FACEBOOK_CLIENT_SECRET: string
  JWT_SECRET: string
  hasGoogleKeys: boolean
  hasFacebookKeys: boolean
}

export default function DebugOAuth() {
  const [status, setStatus] = useState<OAuthStatus | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetch('/api/debug/oauth-status')
      .then(res => res.json())
      .then(data => {
        setStatus(data)
        setLoading(false)
      })
      .catch(err => {
        setError('Failed to load OAuth status')
        setLoading(false)
      })
  }, [])

  if (loading) return <div className="p-8">Loading OAuth status...</div>
  if (error) return <div className="p-8 text-red-500">Error: {error}</div>
  if (!status) return <div className="p-8">No status data</div>

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h1 className="text-2xl font-bold mb-6">OAuth Configuration Status</h1>
          
          <div className="grid gap-4">
            <div className="border rounded p-4">
              <h2 className="font-semibold text-lg mb-3">Environment</h2>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <span>NODE_ENV:</span>
                <span className={status.NODE_ENV === 'production' ? 'text-green-600' : 'text-yellow-600'}>
                  {status.NODE_ENV}
                </span>
              </div>
            </div>

            <div className="border rounded p-4">
              <h2 className="font-semibold text-lg mb-3">Core Configuration</h2>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <span>NEXTAUTH_URL:</span>
                <span className={status.NEXTAUTH_URL !== 'NOT_SET' ? 'text-green-600' : 'text-red-600'}>
                  {status.NEXTAUTH_URL}
                </span>
                
                <span>NEXTAUTH_SECRET:</span>
                <span className={status.NEXTAUTH_SECRET === 'SET' ? 'text-green-600' : 'text-red-600'}>
                  {status.NEXTAUTH_SECRET}
                </span>
                
                <span>JWT_SECRET:</span>
                <span className={status.JWT_SECRET === 'SET' ? 'text-green-600' : 'text-red-600'}>
                  {status.JWT_SECRET}
                </span>
                
                <span>DATABASE_URL:</span>
                <span className={status.DATABASE_URL === 'SET' ? 'text-green-600' : 'text-red-600'}>
                  {status.DATABASE_URL}
                </span>
              </div>
            </div>

            <div className="border rounded p-4">
              <h2 className="font-semibold text-lg mb-3">OAuth Providers</h2>
              
              <div className="mb-4">
                <h3 className="font-medium mb-2">Google OAuth</h3>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <span>GOOGLE_CLIENT_ID:</span>
                  <span className={status.GOOGLE_CLIENT_ID === 'SET' ? 'text-green-600' : 'text-red-600'}>
                    {status.GOOGLE_CLIENT_ID}
                  </span>
                  
                  <span>GOOGLE_CLIENT_SECRET:</span>
                  <span className={status.GOOGLE_CLIENT_SECRET === 'SET' ? 'text-green-600' : 'text-red-600'}>
                    {status.GOOGLE_CLIENT_SECRET}
                  </span>
                  
                  <span>Google OAuth Status:</span>
                  <span className={status.hasGoogleKeys ? 'text-green-600' : 'text-red-600'}>
                    {status.hasGoogleKeys ? '✅ CONFIGURED' : '❌ NOT CONFIGURED'}
                  </span>
                </div>
              </div>

              <div>
                <h3 className="font-medium mb-2">Facebook OAuth</h3>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <span>FACEBOOK_CLIENT_ID:</span>
                  <span className={status.FACEBOOK_CLIENT_ID === 'SET' ? 'text-green-600' : 'text-red-600'}>
                    {status.FACEBOOK_CLIENT_ID}
                  </span>
                  
                  <span>FACEBOOK_CLIENT_SECRET:</span>
                  <span className={status.FACEBOOK_CLIENT_SECRET === 'SET' ? 'text-green-600' : 'text-red-600'}>
                    {status.FACEBOOK_CLIENT_SECRET}
                  </span>
                  
                  <span>Facebook OAuth Status:</span>
                  <span className={status.hasFacebookKeys ? 'text-green-600' : 'text-red-600'}>
                    {status.hasFacebookKeys ? '✅ CONFIGURED' : '❌ NOT CONFIGURED'}
                  </span>
                </div>
              </div>
            </div>

            <div className="border rounded p-4 bg-blue-50">
              <h2 className="font-semibold text-lg mb-3">Quick Fix Instructions</h2>
              <div className="text-sm space-y-2">
                <p>1. <strong>Core Issue:</strong> If any core configuration shows "NOT_SET", set those environment variables first.</p>
                <p>2. <strong>OAuth Issue:</strong> If OAuth providers show "NOT CONFIGURED", you can either:</p>
                <ul className="ml-4 list-disc">
                  <li>Configure Google/Facebook OAuth (see OAUTH_FIX_GUIDE.md)</li>
                  <li>Or just use email/password login (works without OAuth)</li>
                </ul>
                <p>3. <strong>Most Important:</strong> Make sure NEXTAUTH_URL matches your exact domain!</p>
              </div>
            </div>
          </div>

          <div className="mt-6 flex gap-4">
            <Link href="/login" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
              Test Login Page
            </Link>
            <Link href="/" className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600">
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
