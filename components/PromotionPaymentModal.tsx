// components/PromotionPaymentModal.tsx
import { useState, useEffect } from 'react'
import { calculateFees } from '../lib/pricing'
import styles from './PromotionPaymentModal.module.css'

interface PromotionPaymentModalProps {
  isOpen: boolean
  onClose: () => void
  offer: {
    id: string | number
    title: string
    price: number
  }
  onConfirm: (offerId: string | number) => Promise<void>
}

export default function PromotionPaymentModal({ 
  isOpen, 
  onClose, 
  offer, 
  onConfirm 
}: PromotionPaymentModalProps) {
  const [isProcessing, setIsProcessing] = useState(false)
  const [promoPrice, setPromoPrice] = useState(0)

  useEffect(() => {
    if (offer) {
      const fees = calculateFees(offer.price, true) // true = chcemy promocję
      setPromoPrice(fees.promoPrice)
    }
  }, [offer])

  const handleConfirm = async () => {
    setIsProcessing(true)
    try {
      await onConfirm(offer.id)
      onClose()
    } catch (error) {
      console.error('Error promoting offer:', error)
    } finally {
      setIsProcessing(false)
    }
  }

  if (!isOpen || !offer) return null

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h3>Promowanie ogłoszenia</h3>
          <button className={styles.closeBtn} onClick={onClose}>&times;</button>
        </div>

        <div className={styles.modalBody}>
          <div className={styles.offerInfo}>
            <h4>Ogłoszenie do promowania:</h4>
            <p><strong>{offer.title}</strong></p>
            <p>Cena: <strong>{offer.price.toFixed(2)} zł</strong></p>
          </div>

          <div className={styles.promotionDetails}>
            <h4>Szczegóły promocji:</h4>
            <ul>
              <li>✨ Twoje ogłoszenie zostanie wyświetlone na szczycie listy</li>
              <li>⏰ Promocja trwa przez 7 dni</li>
              <li>👁️ Większa widoczność i więcej kontaktów</li>
              <li>🎯 Wyróżnione tło i oznaczenia</li>
            </ul>
          </div>

          <div className={styles.pricingSummary}>
            <div className={styles.priceRow}>
              <span>Koszt promocji:</span>
              <span className={styles.price}>{promoPrice.toFixed(2)} zł</span>
            </div>
            <div className={styles.totalRow}>
              <span>Razem do zapłaty:</span>
              <span className={styles.totalPrice}>{promoPrice.toFixed(2)} zł</span>
            </div>
          </div>

          <div className={styles.paymentInfo}>
            <p>💳 Płatność zostanie przetworzona natychmiastowo</p>
            <p>📧 Otrzymasz potwierdzenie na email</p>
          </div>
        </div>

        <div className={styles.modalFooter}>
          <button 
            className={styles.cancelBtn} 
            onClick={onClose}
            disabled={isProcessing}
          >
            Anuluj
          </button>
          <button 
            className={styles.confirmBtn} 
            onClick={handleConfirm}
            disabled={isProcessing}
          >
            {isProcessing ? 'Przetwarzanie...' : `Zapłać ${promoPrice.toFixed(2)} zł`}
          </button>
        </div>
      </div>
    </div>
  )
}
