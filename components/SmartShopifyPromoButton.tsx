// components/SmartShopifyPromoButton.tsx - Inteligentny wybór przycisku Shopify na podstawie ceny
import React, { useState, useEffect } from 'react'
import ShopifyPromoButton4 from './ShopifyPromoButton4'
import ShopifyPromoButton10 from './ShopifyPromoButton10'
import ShopifyPromoButton15 from './ShopifyPromoButton15'

interface SmartShopifyPromoButtonProps {
  offer: {
    id: number | string
    price: number
    title: string
  }
  onPromotionStart?: () => void
}

interface User {
  email: string
  subscriptionType?: 'PRO' | 'PRO_PLUS' | null
  promotionsRemaining?: number
  subscriptionEnd?: string
}

export default function SmartShopifyPromoButton({ offer, onPromotionStart }: SmartShopifyPromoButtonProps) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Pobierz dane użytkownika
    fetch('/api/auth/me')
      .then(r => r.json())
      .then(data => {
        if (data.user) {
          setUser(data.user)
        }
        setLoading(false)
      })
      .catch(console.error)
  }, [])

  // Sprawdź czy użytkownik może promować za darmo
  const canPromoteForFree = () => {
    if (!user) return false
    
    // PRO+ użytkownicy mają nieograniczone darmowe promocje
    if (user.subscriptionType === 'PRO_PLUS') {
      return true
    }
    
    // PRO użytkownicy mają ograniczone darmowe promocje
    if (user.subscriptionType === 'PRO' && user.promotionsRemaining && user.promotionsRemaining > 0) {
      return true
    }
    
    return false
  }

  // Obsługa darmowej promocji dla PRO/PRO+
  const handleFreePromotion = async () => {
    if (!canPromoteForFree()) return

    onPromotionStart?.()

    try {
      const response = await fetch('/api/offers/promote', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ offerId: offer.id.toString() })
      })

      if (response.ok) {
        alert('Ogłoszenie zostało promowane za darmo! 🎉')
        window.location.reload()
      } else {
        const error = await response.json()
        alert(error.error || 'Błąd podczas promowania ogłoszenia')
      }
    } catch (error) {
      console.error('Error promoting offer:', error)
      alert('Błąd podczas promowania ogłoszenia')
    }
  }

  if (loading) {
    return (
      <div style={{ 
        padding: '8px 16px', 
        background: '#f0f0f0', 
        borderRadius: '8px', 
        fontSize: '12px',
        textAlign: 'center'
      }}>
        Ładowanie...
      </div>
    )
  }

  // Jeśli użytkownik może promować za darmo
  if (canPromoteForFree()) {
    return (
      <button
        onClick={handleFreePromotion}
        style={{
          background: '#ff6b35',
          color: 'white',
          border: 'none',
          padding: '8px 16px',
          borderRadius: '8px',
          fontSize: '12px',
          fontWeight: 'bold',
          cursor: 'pointer',
          transition: 'all 0.2s'
        }}
        onMouseOver={(e) => {
          e.currentTarget.style.background = '#e55a2b'
        }}
        onMouseOut={(e) => {
          e.currentTarget.style.background = '#ff6b35'
        }}
      >
        🚀 Promuj za DARMO
        {user?.subscriptionType === 'PRO' && user.promotionsRemaining && 
          ` (${user.promotionsRemaining} pozostało)`
        }
      </button>
    )
  }

  // Dla użytkowników bez PRO/PRO+ lub gdy się skończą darmowe promocje - pokaż Shopify przyciski
  const price = offer?.price || 0

  if (price >= 0 && price <= 100) {
    return <ShopifyPromoButton4 offerId={offer.id} />
  } else if (price >= 101 && price <= 200) {
    return <ShopifyPromoButton10 offerId={offer.id} />
  } else if (price >= 201 && price <= 1000) {
    return <ShopifyPromoButton15 offerId={offer.id} />
  } else {
    // Powyżej 1000zł - brak promocji
    return (
      <div style={{ 
        padding: '8px 16px', 
        background: '#f0f0f0', 
        borderRadius: '8px', 
        fontSize: '12px',
        color: '#666',
        textAlign: 'center'
      }}>
        Brak promocji dla tej ceny
      </div>
    )
  }
}
