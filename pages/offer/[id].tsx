import { useRouter } from 'next/router'
import { useState, useEffect } from 'react'
import Header from '../../components/Header'
import OfferModal from '../../components/OfferModal'
import styles from '../../styles/OfferPage.module.css'

interface Offer {
  id: number
  title: string
  description: string
  price: number
  category: string
  location: string
  contactName: string
  contactEmail: string
  contactPhone?: string
  offerType: string
  createdAt: string
  images?: string[]
  promoted: boolean
  views?: number
  likes?: number
  ownerEmail: string
}

export default function OfferPage() {
  const router = useRouter()
  const { id } = router.query
  const [offer, setOffer] = useState<Offer | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!id) return

    const fetchOffer = async () => {
      try {
        setLoading(true)
        
        // Zwiększ licznik wyświetleń
        fetch('/api/offers/view', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ offerId: parseInt(id as string) }),
        }).catch(error => console.error('Błąd podczas zwiększania wyświetleń:', error))

        // Pobierz szczegóły ogłoszenia
        const response = await fetch(`/api/offers/${id}`)
        
        if (!response.ok) {
          if (response.status === 404) {
            setError('Ogłoszenie nie zostało znalezione')
          } else {
            setError('Wystąpił błąd podczas pobierania ogłoszenia')
          }
          return
        }

        const offerData = await response.json()
        setOffer(offerData)
      } catch (err) {
        console.error('Error fetching offer:', err)
        setError('Wystąpił błąd podczas pobierania ogłoszenia')
      } finally {
        setLoading(false)
      }
    }

    fetchOffer()
  }, [id])

  const handleCloseModal = () => {
    router.push('/')
  }

  if (loading) {
    return (
      <div className={styles.container}>
        <Header />
        <div className={styles.loading}>
          <div className={styles.spinner}></div>
          <p>Ładowanie ogłoszenia...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className={styles.container}>
        <Header />
        <div className={styles.error}>
          <h2>❌ Błąd</h2>
          <p>{error}</p>
          <button onClick={() => router.push('/')} className={styles.backButton}>
            Powrót do strony głównej
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.container}>
      <Header />
      <OfferModal
        offer={offer}
        isOpen={true}
        onClose={handleCloseModal}
      />
    </div>
  )
}
