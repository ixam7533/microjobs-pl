// components/SubscriptionManager.tsx
import { useState, useEffect } from 'react'
import { PRO_VERSIONS } from '../lib/pricing'
import styles from './SubscriptionManager.module.css'

interface SubscriptionData {
  isActive: boolean
  type: string | null
  startDate: string | null
  endDate: string | null
  promotionsUsed: number
  promotionsLimit: number
  emailReminder: boolean
  daysRemaining: number
}

interface SubscriptionManagerProps {
  onSubscriptionChange?: () => void
}

export default function SubscriptionManager({ onSubscriptionChange }: SubscriptionManagerProps) {
  const [subscription, setSubscription] = useState<SubscriptionData | null>(null)
  const [loading, setLoading] = useState(true)
  const [purchasing, setPurchasing] = useState(false)
  const [cancelling, setCancelling] = useState(false)

  useEffect(() => {
    fetchSubscriptionStatus()
  }, [])

  const fetchSubscriptionStatus = async () => {
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
        setSubscription(data.subscription)
      }
    } catch (error) {
      console.error('Error fetching subscription:', error)
    } finally {
      setLoading(false)
    }
  }

  const handlePurchase = async (subscriptionType: string) => {
    setPurchasing(true)
    try {
      const token = document.cookie.split(';').find(row => row.startsWith('token='))?.split('=')[1]
      if (!token) {
        alert('Musisz być zalogowany aby zakupić subskrypcję')
        return
      }

      const response = await fetch('/api/subscriptions/purchase', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ subscriptionType })
      })

      if (response.ok) {
        const data = await response.json()
        alert('Subskrypcja została zakupiona pomyślnie!')
        await fetchSubscriptionStatus()
        if (onSubscriptionChange) onSubscriptionChange()
        // Reload page to remove ads
        window.location.reload()
      } else {
        const error = await response.json()
        alert(error.error || 'Błąd podczas zakupu subskrypcji')
      }
    } catch (error) {
      console.error('Error purchasing subscription:', error)
      alert('Błąd podczas zakupu subskrypcji')
    } finally {
      setPurchasing(false)
    }
  }

  const handleCancel = async () => {
    if (!confirm('Czy na pewno chcesz anulować subskrypcję? Zachowasz wszystkie korzyści do końca obecnego okresu rozliczeniowego.')) {
      return
    }

    setCancelling(true)
    try {
      const token = document.cookie.split(';').find(row => row.startsWith('token='))?.split('=')[1]
      if (!token) return

      const response = await fetch('/api/subscriptions/cancel', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        const data = await response.json()
        alert(data.message)
        await fetchSubscriptionStatus()
        if (onSubscriptionChange) onSubscriptionChange()
      } else {
        const error = await response.json()
        alert(error.error || 'Błąd podczas anulowania subskrypcji')
      }
    } catch (error) {
      console.error('Error cancelling subscription:', error)
      alert('Błąd podczas anulowania subskrypcji')
    } finally {
      setCancelling(false)
    }
  }

  if (loading) {
    return (
      <div className={styles.loading}>
        <div className={styles.spinner}></div>
        <p>Ładowanie informacji o subskrypcji...</p>
      </div>
    )
  }

  return (
    <div className={styles.subscriptionManager}>
      <h2>Subskrypcje</h2>
      
      {subscription?.isActive ? (
        <div className={styles.activeSubscription}>
          <div className={styles.subscriptionHeader}>
            <div className={styles.subscriptionBadge}>
              <span className={styles.badgeIcon}>✨</span>
              <span>{subscription.type === 'PRO' ? 'PRO' : 'PRO+'}</span>
            </div>
            <div className={styles.subscriptionInfo}>
              <p><strong>Subskrypcja aktywna do:</strong></p>
              <p>{subscription.endDate ? new Date(subscription.endDate).toLocaleDateString('pl-PL') : 'Nie określono'}</p>
              <p className={styles.daysRemaining}>
                Pozostało: {subscription.daysRemaining} dni
              </p>
            </div>
          </div>

          <div className={styles.promotionsCounter}>
            <h3>Promowanie ogłoszeń</h3>
            <div className={styles.counterDisplay}>
              <span className={styles.counterValue}>
                {subscription.promotionsLimit - subscription.promotionsUsed}/{subscription.promotionsLimit}
              </span>
              <span className={styles.counterLabel}>dostępnych promowań</span>
            </div>
            <div className={styles.promotionProgress}>
              <div 
                className={styles.progressBar}
                style={{ 
                  width: `${((subscription.promotionsLimit - subscription.promotionsUsed) / subscription.promotionsLimit) * 100}%` 
                }}
              />
            </div>
          </div>

          <div className={styles.subscriptionActions}>
            <button 
              onClick={handleCancel}
              disabled={cancelling}
              className={styles.cancelButton}
            >
              {cancelling ? 'Anulowanie...' : 'Anuluj subskrypcję'}
            </button>
          </div>
        </div>
      ) : (
        <div className={styles.noSubscription}>
          <p>Nie masz aktywnej subskrypcji</p>
          
          <div className={styles.pricingCards}>
            <div className={styles.pricingCard}>
              <h3>Wersja PRO</h3>
              <div className={styles.price}>
                <span className={styles.priceAmount}>15</span>
                <span className={styles.priceCurrency}>zł</span>
                <span className={styles.pricePeriod}>/miesiąc</span>
              </div>
              <ul className={styles.featureList}>
                {PRO_VERSIONS.PRO.features.map((feature, index) => (
                  <li key={index}>
                    <span className={styles.checkmark}>✓</span>
                    {feature}
                  </li>
                ))}
              </ul>
              <button 
                onClick={() => handlePurchase('PRO')}
                disabled={purchasing}
                className={styles.purchaseButton}
              >
                {purchasing ? 'Przetwarzanie...' : 'Wybierz PRO'}
              </button>
            </div>

            <div className={styles.pricingCard}>
              <h3>Wersja PRO+</h3>
              <div className={styles.price}>
                <span className={styles.priceAmount}>50</span>
                <span className={styles.priceCurrency}>zł</span>
                <span className={styles.pricePeriod}>/miesiąc</span>
              </div>
              <ul className={styles.featureList}>
                {PRO_VERSIONS.PRO_PLUS.features.map((feature, index) => (
                  <li key={index}>
                    <span className={styles.checkmark}>✓</span>
                    {feature}
                  </li>
                ))}
              </ul>
              <button 
                onClick={() => handlePurchase('PRO_PLUS')}
                disabled={purchasing}
                className={styles.purchaseButton}
              >
                {purchasing ? 'Przetwarzanie...' : 'Wybierz PRO+'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
