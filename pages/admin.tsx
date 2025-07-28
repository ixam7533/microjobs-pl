// pages/admin.tsx
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import AdminSubscriptionPanel from '../components/AdminSubscriptionPanel'

interface User {
  email: string
  confirmed: boolean
  isAdmin?: boolean
}

export default function AdminPage() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // Sprawdź uprawnienia administratora
    fetch('/api/auth/me')
      .then(async (res) => {
        if (!res.ok) return null
        try {
          return await res.json()
        } catch {
          console.error('Invalid JSON from /api/auth/me')
          return null
        }
      })
      .then((data) => {
        if (data?.user) {
          const userData = data.user
          setUser(userData)
          
          // Sprawdź czy użytkownik ma uprawnienia administratora
          const isAdmin = userData.isAdmin || userData.email === 'microjobsj7@gmail.com'
          
          if (!isAdmin) {
            router.replace('/')
            return
          }
        } else {
          router.replace('/login')
          return
        }
        setLoading(false)
      })
      .catch((err) => {
        console.error('Network error on /api/auth/me:', err)
        router.replace('/login')
      })
  }, [router])

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        flexDirection: 'column',
        gap: '20px'
      }}>
        <div style={{ fontSize: '2rem' }}>👑</div>
        <div>Sprawdzam uprawnienia administratora...</div>
      </div>
    )
  }

  if (!user || (!user.isAdmin && user.email !== 'microjobsj7@gmail.com')) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        flexDirection: 'column',
        gap: '20px'
      }}>
        <div style={{ fontSize: '2rem' }}>🚫</div>
        <div>Brak uprawnień administratora</div>
      </div>
    )
  }

  return (
    <div style={{ padding: '20px' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '30px' }}>
        👑 Panel Administracyjny MicroJobs
      </h1>
      
      <div style={{ 
        background: '#f8f9fa', 
        padding: '20px', 
        borderRadius: '10px',
        marginBottom: '20px',
        border: '2px solid #e9ecef'
      }}>
        <h2>Witaj, Administrator!</h2>
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>Status:</strong> {user.isAdmin ? 'Administrator' : 'Admin (specjalny dostęp)'}</p>
        <p>Z tego panelu możesz zarządzać subskrypcjami użytkowników, nadawać uprawnienia PRO i PRO+, oraz monitorować aktywność w systemie.</p>
      </div>

      <AdminSubscriptionPanel 
        isVisible={true}
        onClose={() => router.push('/')}
      />
    </div>
  )
}
