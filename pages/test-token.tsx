import { useEffect } from 'react'
import { useRouter } from 'next/router'

export default function TestToken() {
  const router = useRouter()

  useEffect(() => {
    // Ustawiamy token dla testowego użytkownika
    const testToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTQsImVtYWlsIjoidGVzdG5ld3VzZXJAZXhhbXBsZS5jb20iLCJpYXQiOjE3NTM2OTAyMzMsImV4cCI6MTc1MzcxOTAzM30.anIy7i-y1eH-sKkwgAeF0mJMPr-IsjuAHlwwBey9HnU'
    
    // Ustawiamy ciasteczko
    document.cookie = `token=${testToken}; path=/; max-age=28800`
    
    console.log('✅ Token ustawiony dla testnewuser@example.com')
    
    // Przekieruj na add-new po 1 sekundzie
    setTimeout(() => {
      router.push('/add-new')
    }, 1000)
  }, [router])

  return (
    <div style={{ padding: '2rem', textAlign: 'center' }}>
      <h1>Ustawianie tokenu testowego...</h1>
      <p>Testnewuser@example.com (nowy użytkownik bez ogłoszeń)</p>
      <p>Przekierowuję na /add-new...</p>
    </div>
  )
}
