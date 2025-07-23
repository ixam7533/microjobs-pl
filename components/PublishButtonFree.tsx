// components/PublishButtonFree.tsx - Darmowy przycisk publikacji dla PRO/PRO+
import { useState } from 'react'

interface PublishButtonFreeProps {
  offerData: any
  onPublishSuccess?: () => void
}

export default function PublishButtonFree({ offerData, onPublishSuccess }: PublishButtonFreeProps) {
  const [isLoading, setIsLoading] = useState(false)

  const handleFreePublish = async () => {
    setIsLoading(true)
    try {
      console.log('Publikuję darmowe ogłoszenie PRO/PRO+...', offerData)
      
      const response = await fetch('/api/offers/publish-free', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...offerData,
          paymentType: 'free_pro',
          userEmail: offerData.contactEmail,
          userId: 1 // Pobierz z sesji
        }),
      })

      const result = await response.json()
      
      if (result.success) {
        console.log('Ogłoszenie opublikowane za darmo:', result.offerId)
        alert('✅ Ogłoszenie zostało opublikowane za darmo!')
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
      onClick={handleFreePublish}
      disabled={isLoading}
      style={{
        backgroundColor: '#4CAF50',
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
      {isLoading ? '🔄 Publikuję...' : '🆓 Publikuj za darmo (PRO)'}
    </button>
  )
}
