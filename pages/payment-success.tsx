// pages/payment-success.tsx - Strona po udanej płatności Shopify
import { useEffect } from 'react'
import { useRouter } from 'next/router'

export default function PaymentSuccess() {
  const router = useRouter()

  useEffect(() => {
    // Ustaw flagę w localStorage, że zakup został ukończony
    localStorage.setItem('shopify_purchase_completed', 'true')
    
    // Przekieruj na stronę główną po 3 sekundach
    const timer = setTimeout(() => {
      router.push('/')
    }, 3000)

    return () => clearTimeout(timer)
  }, [router])

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      textAlign: 'center',
      backgroundColor: '#f0f8ff',
      padding: '20px'
    }}>
      <div style={{
        backgroundColor: 'white',
        padding: '40px',
        borderRadius: '12px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
        maxWidth: '500px'
      }}>
        <div style={{ fontSize: '64px', marginBottom: '20px' }}>✅</div>
        <h1 style={{ color: '#2e7d2e', marginBottom: '16px' }}>Płatność zakończona pomyślnie!</h1>
        <p style={{ color: '#666', marginBottom: '20px', lineHeight: '1.6' }}>
          Twoje ogłoszenie zostało opłacone i będzie opublikowane automatycznie.
        </p>
        <p style={{ color: '#888', fontSize: '14px' }}>
          Przekierowujemy Cię na stronę główną za 3 sekundy...
        </p>
        <button
          onClick={() => router.push('/')}
          style={{
            marginTop: '20px',
            padding: '12px 24px',
            backgroundColor: '#b359f9',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '16px'
          }}
        >
          Przejdź teraz do strony głównej
        </button>
      </div>
    </div>
  )
}
