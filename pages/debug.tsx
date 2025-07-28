import { useEffect, useState } from 'react'

export default function Debug() {
  const [user, setUser] = useState<any>(null)
  const [offers, setOffers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Pobierz dane użytkownika
        const userResponse = await fetch('/api/auth/me')
        const userData = await userResponse.json()
        setUser(userData.user)
        console.log('User data:', userData.user)

        if (userData.user) {
          // Pobierz ogłoszenia
          const offersResponse = await fetch('/api/auth/my-offers')
          const offersData = await offersResponse.json()
          setOffers(offersData.offers)
          console.log('Offers data:', offersData.offers)
        }
      } catch (error) {
        console.error('Error:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (loading) return <div>Ładowanie...</div>

  return (
    <div style={{ padding: '2rem', fontFamily: 'monospace' }}>
      <h1>Debug Dashboard</h1>
      
      <h2>User Data:</h2>
      <pre style={{ background: '#f5f5f5', padding: '1rem', overflow: 'auto' }}>
        {JSON.stringify(user, null, 2)}
      </pre>

      <h2>Offers Count:</h2>
      <p>{offers ? offers.length : 'Brak danych'}</p>

      <h2>isFirstOffer Logic:</h2>
      <p>{offers && offers.length === 0 ? 'TRUE - Pierwsze ogłoszenie' : 'FALSE - Nie pierwsze ogłoszenie'}</p>

      <h2>User PRO Status:</h2>
      <p>hasPro: {user?.hasPro ? 'true' : 'false'}</p>
      <p>proType: {user?.proType || 'null'}</p>
      
      <h2>Expected Form Behavior:</h2>
      <p>
        {user?.hasPro || (offers && offers.length === 0) 
          ? '✅ Powinien pokazać opcję darmową' 
          : '❌ Powinien pokazać alert o płatności'
        }
      </p>
    </div>
  )
}
