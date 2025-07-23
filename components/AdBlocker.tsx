// components/AdBlocker.tsx
import { useState, useEffect } from 'react'
import styles from './AdBlocker.module.css'
import AdSenseAd from './AdSenseAd'

interface AdBlockerProps {
  children: React.ReactNode
}

interface SubscriptionStatus {
  hasActiveSubscription: boolean
  subscriptionType: string | null
}

export default function AdBlocker({ children }: AdBlockerProps) {
  const [subscriptionStatus, setSubscriptionStatus] = useState<SubscriptionStatus>({
    hasActiveSubscription: false,
    subscriptionType: null
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    checkSubscription()
  }, [])

  const checkSubscription = async () => {
    try {
      // Sprawdź różne sposoby autoryzacji
      const token = document.cookie.split(';').find(row => row.startsWith('token='))?.split('=')[1]
      const headers: any = {
        'Content-Type': 'application/json'
      }

      // Dodaj token JWT jeśli istnieje
      if (token) {
        headers['Authorization'] = `Bearer ${token}`
      }

      const response = await fetch('/api/subscriptions/status', {
        method: 'GET',
        headers,
        credentials: 'include' // Ważne dla sesji NextAuth
      })

      if (response.ok) {
        const data = await response.json()
        console.log('Subscription status:', data) // Debug log
        setSubscriptionStatus({
          hasActiveSubscription: data.subscription.isActive,
          subscriptionType: data.subscription.type
        })
      } else {
        console.log('Subscription status response not ok:', response.status)
      }
    } catch (error) {
      console.error('Error checking subscription:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return null // Nie pokazuj reklam podczas ładowania
  }

  // If user has active subscription, don't show ads
  if (subscriptionStatus.hasActiveSubscription) {
    console.log('User has PRO subscription, hiding ads:', subscriptionStatus.subscriptionType) // Debug log
    return null
  }

  console.log('User has no subscription, showing ads') // Debug log

  // Show ads for users without subscription
  return (
    <div className={styles.adContainer}>
      {children}
    </div>
  )
}

// Component for displaying actual AdSense ads
export function Advertisement({ type = 'banner' }: { type?: 'banner' | 'sidebar' | 'square' | 'offer' | 'bottom' }) {
  const { AD_SLOTS } = require('../lib/adsense-config')
  
  return (
    <AdBlocker>
      <AdSenseAd 
        adSlot={AD_SLOTS[type]} 
        type={type}
        adFormat={type === 'banner' ? 'horizontal' : type === 'sidebar' ? 'vertical' : 'rectangle'}
      />
    </AdBlocker>
  )
}
