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
      const token = document.cookie.split(';').find(row => row.startsWith('token='))?.split('=')[1]
      
      if (!token) {
        setLoading(false)
        return
      }

      const response = await fetch('/api/subscriptions/status', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        const data = await response.json()
        setSubscriptionStatus({
          hasActiveSubscription: data.subscription.isActive,
          subscriptionType: data.subscription.type
        })
      }
    } catch (error) {
      console.error('Error checking subscription:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div className={styles.loading}>Sprawdzanie subskrypcji...</div>
  }

  // If user has active subscription, don't show ads
  if (subscriptionStatus.hasActiveSubscription) {
    return null
  }

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
