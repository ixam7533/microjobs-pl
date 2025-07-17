// components/PromotionCounter.tsx
import { useState, useEffect } from 'react'
import styles from './PromotionCounter.module.css'

interface PromotionCounterProps {
  className?: string
}

export default function PromotionCounter({ className }: PromotionCounterProps) {
  const [promotionData, setPromotionData] = useState<{
    promotionsUsed: number
    promotionsLimit: number
    subscriptionType: string | null
  } | null>(null)

  useEffect(() => {
    fetchPromotionData()
  }, [])

  const fetchPromotionData = async () => {
    try {
      const token = document.cookie.split(';').find(row => row.startsWith('token='))?.split('=')[1]
      if (!token) return

      const response = await fetch('/api/subscriptions/status', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        const data = await response.json()
        if (data.subscription.isActive) {
          setPromotionData({
            promotionsUsed: data.subscription.promotionsUsed,
            promotionsLimit: data.subscription.promotionsLimit,
            subscriptionType: data.subscription.type
          })
        }
      }
    } catch (error) {
      console.error('Error fetching promotion data:', error)
    }
  }

  if (!promotionData) return null

  const remaining = promotionData.promotionsLimit - promotionData.promotionsUsed

  return (
    <div className={`${styles.promotionCounter} ${className || ''}`}>
      <div className={styles.counterBadge}>
        <span className={styles.counterIcon}>🎯</span>
        <span className={styles.counterText}>
          {remaining}/{promotionData.promotionsLimit}
        </span>
        <span className={styles.counterLabel}>promowań</span>
      </div>
      <div className={styles.subscriptionBadge}>
        {promotionData.subscriptionType}
      </div>
    </div>
  )
}
