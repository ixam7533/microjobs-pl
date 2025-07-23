// components/PublishWithPromoFree.tsx - Darmowy przycisk promocji dla PRO+
import { useState } from 'react'

interface PublishWithPromoFreeProps {
  offerData: any
  onPublishSuccess?: () => void
}

export default function PublishWithPromoFree({ offerData, onPublishSuccess }: PublishWithPromoFreeProps) {
  const [isLoading, setIsLoading] = useState(false)

  const handleFreePromoPublish = async () => {
    setIsLoading(true)
    try {
      console.log('Publikuję darmowe ogłoszenie + promocja PRO+...', offerData)
      
      const response = await fetch('/api/offers/publish-free-promo', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...offerData,
          paymentType: 'free_promo_plus',
          wantPromo: true,
          userEmail: offerData.contactEmail,
          userId: 1 // Pobierz z sesji
        }),
      })

      const result = await response.json()
      
      if (result.success) {
        console.log('Ogłoszenie + promocja opublikowane za darmo:', result.offerId)
        alert('✅ Ogłoszenie z promocją zostało opublikowane za darmo!')
        onPublishSuccess?.()
      } else {
        throw new Error(result.error || 'Błąd publikacji')
      }
    } catch (error) {
      console.error('Błąd publikacji:', error)
      alert('Błąd publikacji ogłoszenia. Spróbuj ponownie.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <button
      type="button"
      onClick={handleFreePromoPublish}
      disabled={isLoading}
      style={{
        backgroundColor: '#FF6B35',
        color: 'white',
        border: 'none',
        padding: '16px 24px',
        borderRadius: '8px',
        fontSize: '16px',
        fontWeight: 'bold',
        cursor: isLoading ? 'not-allowed' : 'pointer',
        width: '100%',
        opacity: isLoading ? 0.7 : 1
      }}
    >
      {isLoading ? '🔄 Publikuję...' : '🎯 Publikuj + Promuj za darmo (PRO+)'}
    </button>
  )
}
