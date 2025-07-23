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

    // Odświeżaj dane co 30 sekund, aby mieć aktualne informacje
    const intervalId = setInterval(fetchPromotionData, 30000)
    
    // Cleanup na unmount
    return () => clearInterval(intervalId)
  }, [])

  const fetchPromotionData = async () => {
    try {
      console.log('🔄 PromotionCounter: Fetching data...')
      // Dodaj losowy parametr, aby uniknąć cache'a przeglądarki
      const timestamp = new Date().getTime()
      const response = await fetch(`/api/subscriptions/status?t=${timestamp}`, {
        credentials: 'include' // ważne dla cookies httpOnly
      })

      console.log('📡 PromotionCounter: Response status:', response.status)

      if (response.ok) {
        const data = await response.json()
        console.log('📊 PromotionCounter: Received raw data:', JSON.stringify(data, null, 2))
        
        try {
          if (data && data.subscription && data.subscription.isActive) {
            console.log('✅ PromotionCounter: Setting active subscription data')
            const newPromotionData = {
              promotionsUsed: Number(data.subscription.promotionsUsed) || 0,
              promotionsLimit: Number(data.subscription.promotionsLimit) || 0,
              subscriptionType: data.subscription.type || null
            }
            console.log('🎯 PromotionCounter: Setting state to:', newPromotionData)
            setPromotionData(newPromotionData)
          } else {
            console.log('❌ PromotionCounter: No active subscription')
          }
        } catch (parseError) {
          console.error('Error parsing subscription data:', parseError)
        }
      } else {
        console.log('❌ PromotionCounter: Response not ok:', response.status)
      }
    } catch (error) {
      console.error('❌ PromotionCounter: Error fetching promotion data:', error)
    }
  }

  if (!promotionData) {
    console.log('⏳ PromotionCounter: No promotion data yet')
    return null
  }

  // Zabezpieczamy się przed nieprawidłowymi danymi
  const isProPlus = promotionData.subscriptionType === 'PRO_PLUS'
  const isPro = promotionData.subscriptionType === 'PRO'
  
  // Używamy limitu z API - tam już jest prawidłowa logika
  const promoLimit = promotionData.promotionsLimit || 0
  const promotionsUsed = promotionData.promotionsUsed || 0
  const remaining = Math.max(0, promoLimit - promotionsUsed)
  
  console.log('🎯 PromotionCounter: Rendering with data:', { 
    remaining, 
    limit: promoLimit,
    isProPlus,
    isPro,
    type: promotionData.subscriptionType 
  })

  // Upewnij się, że wartości są liczbami i mogą być wyświetlane
  const remainingText = Number.isFinite(remaining) ? remaining.toString() : '0';
  const limitText = Number.isFinite(promoLimit) ? promoLimit.toString() : '0';
  
  return (
    <div className={`${styles.promotionCounter} ${className || ''}`}>
      <div className={styles.miniCounter}>
        <span className={styles.miniIcon}>🎯</span>
        <span className={styles.miniText}>
          {`${remainingText}/${limitText}`}
        </span>
      </div>
    </div>
  )
}
