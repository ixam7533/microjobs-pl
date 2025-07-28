// components/SubscriptionManager.tsx
import { useState, useEffect } from 'react'
import { PRO_VERSIONS } from '../lib/pricing'
import styles from './SubscriptionManager.module.css'

interface SubscriptionData {
  isActive: boolean
  isCancelled?: boolean
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
      const response = await fetch('/api/subscriptions/status', {
        credentials: 'include'
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

  const handleCancel = async () => {
    if (!confirm('Czy na pewno chcesz anulować subskrypcję? Zachowasz wszystkie korzyści do końca obecnego okresu rozliczeniowego.')) {
      return
    }

    setCancelling(true)
    try {
      const response = await fetch('/api/subscriptions/cancel', {
        method: 'POST',
        credentials: 'include'
      })

      if (response.ok) {
        const data = await response.json()
        // Odśwież status subskrypcji bez alertu
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
          {/* Header z informacją o statusie */}
          <div className={styles.subscriptionHeader}>
            <div className={styles.subscriptionBadge}>
              <span className={styles.badgeIcon}>
                {subscription.isCancelled ? '⏰' : '✨'}
              </span>
              <span>{subscription.type === 'PRO' ? 'PRO' : 'PRO+'}</span>
              {subscription.isCancelled && (
                <span className={styles.cancelledLabel}>ANULOWANA</span>
              )}
            </div>
            <div className={styles.subscriptionInfo}>
              <p><strong>
                {subscription.isCancelled ? 
                  'Subskrypcja anulowana - aktywna do:' : 
                  'Subskrypcja aktywna do:'}
              </strong></p>
              <p>{subscription.endDate ? new Date(subscription.endDate).toLocaleDateString('pl-PL') : 'Nie określono'}</p>
              <p className={styles.daysRemaining}>
                Pozostało: {subscription.daysRemaining} dni
              </p>
              {subscription.isCancelled && (
                <p className={styles.cancelledNote}>
                  💡 Możesz wykupić nową subskrypcję, która zastąpi obecną i zresetuje okres na 30 dni
                </p>
              )}
            </div>
          </div>

          <div className={styles.promotionsCounter}>
            <h3>Promowanie ogłoszeń</h3>
            <div className={styles.counterDisplay}>
              <span className={styles.counterValue}>
                {subscription.type === 'PRO' ? 
                  'Promocje płatne' : 
                  subscription.promotionsLimit === -1 || subscription.promotionsLimit === 0 ?
                    'Nielimitowane' :
                    `${Math.max(0, subscription.promotionsLimit - subscription.promotionsUsed)}/${subscription.promotionsLimit}`
                }
              </span>
              <span className={styles.counterLabel}>
                {subscription.type === 'PRO' ? 
                  'dostępne za opłatą' :
                  subscription.promotionsLimit === -1 || subscription.promotionsLimit === 0 ?
                    'darmowe promocje' :
                    'dostępnych promowań'
                }
              </span>
            </div>
            {subscription.type !== 'PRO' && subscription.promotionsLimit > 0 && (
              <div className={styles.promotionProgress}>
                <div 
                  className={styles.progressBar}
                  style={{ 
                    width: `${Math.max(0, ((subscription.promotionsLimit - subscription.promotionsUsed) / subscription.promotionsLimit) * 100)}%` 
                  }}
                />
              </div>
            )}
          </div>

          <div className={styles.subscriptionActions}>
            {subscription.isCancelled ? (
              // Sekcja dla anulowanej subskrypcji - pokaż opcje zakupu nowej
              <div className={styles.renewOptions}>
                <h3>Kup nową subskrypcję</h3>
                <p className={styles.renewNote}>
                  Nowa subskrypcja zastąpi obecną i zresetuje okres na pełne 30 dni
                </p>
                <div className={styles.renewButtons}>
                  <button 
                    onClick={() => window.location.href = '/pro'}
                    disabled={purchasing}
                    className={`${styles.purchaseButton} ${styles.proButton}`}
                  >
                    Kup PRO (15 zł)
                  </button>
                  <button 
                    onClick={() => window.location.href = '/pro'}
                    disabled={purchasing}
                    className={`${styles.purchaseButton} ${styles.proPlusButton}`}
                  >
                    Kup PRO+ (25 zł)
                  </button>
                </div>
              </div>
            ) : (
              // Przycisk anulowania dla aktywnej subskrypcji
              <button 
                onClick={handleCancel}
                disabled={cancelling}
                className={styles.cancelButton}
              >
                {cancelling ? 'Anulowanie...' : 'Anuluj subskrypcję'}
              </button>
            )}
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
                onClick={() => window.location.href = '/pro'}
                disabled={purchasing}
                className={styles.purchaseButton}
              >
                Kup PRO
              </button>
            </div>

            <div className={styles.pricingCard}>
              <h3>Wersja PRO+</h3>
              <div className={styles.price}>
                <span className={styles.priceAmount}>25</span>
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
                onClick={() => window.location.href = '/pro'}
                disabled={purchasing}
                className={styles.purchaseButton}
              >
                Kup PRO+
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
