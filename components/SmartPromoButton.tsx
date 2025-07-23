// components/SmartPromoButton.tsx - Inteligentny przycisk promocji z obsługą darmowych promowań dla PRO+
import React, { useState, useEffect } from 'react'

interface SmartPromoButtonProps {
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

export default function SmartPromoButton({ offer, onPromotionStart }: SmartPromoButtonProps) {
  const [user, setUser] = useState<User | null>(null)
  const [promoting, setPromoting] = useState(false)

  useEffect(() => {
    // Pobierz dane użytkownika
    fetch('/api/auth/me')
      .then(r => r.json())
      .then(data => {
        if (data.user) {
          setUser(data.user)
        }
      })
      .catch(console.error)
  }, [])

  const handlePromote = async () => {
    if (promoting) return
    
    setPromoting(true)
    onPromotionStart?.()

    // Sprawdź czy użytkownik ma PRO+ i darmowe promocje
    if (user?.subscriptionType === 'PRO_PLUS') {
      // PRO+ użytkownicy mają nieograniczone darmowe promocje
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
          const data = await response.json()
          alert('Ogłoszenie zostało promowane za darmo! 🎉')
          // Odśwież stronę żeby zaktualizować listę ogłoszeń
          window.location.reload()
        } else {
          const error = await response.json()
          alert(error.error || 'Błąd podczas promowania ogłoszenia')
        }
      } catch (error) {
        console.error('Error promoting offer:', error)
        alert('Błąd podczas promowania ogłoszenia')
      }
    } else {
      // Pozostali użytkownicy (bez PRO lub PRO) - przekieruj do Shopify
      const price = offer?.price || 0
      let shopifyUrl = ''
      
      // Wybierz odpowiedni produkt na podstawie ceny
      if (price >= 0 && price <= 100) {
        shopifyUrl = 'https://3cusn0-tb.myshopify.com/products/promocja-ogloszenia-za-4zl?variant=49026127864166'
      } else if (price >= 101 && price <= 300) {
        shopifyUrl = 'https://3cusn0-tb.myshopify.com/products/promocja-ogloszenia-za-8zl?variant=49026127929702'
      } else if (price > 300) {
        shopifyUrl = 'https://3cusn0-tb.myshopify.com/products/promocja-ogloszenia-za-12zl?variant=49026127962470'
      }
      
      if (shopifyUrl) {
        window.open(shopifyUrl, '_blank')
      }
    }

    setPromoting(false)
  }

  const getButtonText = () => {
    if (promoting) return '⏳ Promowanie...'
    
    if (user?.subscriptionType === 'PRO_PLUS') {
      return '🚀 Promuj za DARMO'
    }
    
    const price = offer?.price || 0
    if (price <= 100) return '🚀 Promuj za 4zł'
    if (price <= 300) return '🚀 Promuj za 8zł'
    return '🚀 Promuj za 12zł'
  }

  const getButtonColor = () => {
    if (user?.subscriptionType === 'PRO_PLUS') {
      return '#ff6b35' // Pomarańczowy dla darmowych promowań
    }
    return '#34c759' // Zielony dla płatnych
  }

  return (
    <button
      onClick={handlePromote}
      disabled={promoting}
      style={{
        backgroundColor: getButtonColor(),
        color: 'white',
        border: 'none',
        borderRadius: '8px',
        padding: '8px 16px',
        fontSize: '14px',
        fontWeight: 'bold',
        cursor: promoting ? 'not-allowed' : 'pointer',
        display: 'flex',
        alignItems: 'center',
        gap: '5px',
        transition: 'all 0.2s',
        opacity: promoting ? 0.7 : 1
      }}
      onMouseOver={(e) => {
        if (!promoting) {
          const baseColor = user?.subscriptionType === 'PRO_PLUS' ? '#e55a2b' : '#28a745'
          e.currentTarget.style.backgroundColor = baseColor
        }
      }}
      onMouseOut={(e) => {
        if (!promoting) {
          e.currentTarget.style.backgroundColor = getButtonColor()
        }
      }}
    >
      {getButtonText()}
    </button>
  )
}
