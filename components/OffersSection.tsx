import React, { useState, useEffect } from 'react'
import FeatureCard from './FeatureCard'
import OfferModal from './OfferModal'
import { Advertisement } from './AdBlocker'
import styles from './OffersSection.module.css'

export type Offer = {
  id: number
  ownerEmail: string
  image: string
  images?: string[]
  title: string
  price: number | string
  location: string
  description?: string
  category?: string
  subcategories?: string[]
  contactName?: string
  contactEmail?: string
  contactPhone?: string
  offerType?: string
  createdAt?: string
  isPromoted?: boolean
  views?: number
  likes?: number
}

interface OffersSectionProps {
  offers: Offer[]
  initialOfferId?: string | null
}

export default function OffersSection({ offers, initialOfferId }: OffersSectionProps) {
  const [selectedOffer, setSelectedOffer] = useState<Offer | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [favoriteOffers, setFavoriteOffers] = useState<number[]>([])

  // Pobierz ulubione ogłoszenia
  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const response = await fetch('/api/auth/favorites')
        if (response.ok) {
          const favorites = await response.json()
          setFavoriteOffers(favorites.map((fav: any) => fav.id))
        }
      } catch (error) {
        console.error('Błąd pobierania ulubionych:', error)
      }
    }
    fetchFavorites()
  }, [])

  // Automatycznie otwórz modal jeśli podano initialOfferId
  useEffect(() => {
    if (initialOfferId) {
      const offerId = parseInt(initialOfferId)
      if (!isNaN(offerId)) {
        handleOfferClick(offerId)
      }
    }
  }, [initialOfferId])

  const handleOfferClick = async (offerId: number) => {
    try {
      // Zwiększ licznik wyświetleń
      fetch('/api/offers/view', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ offerId: offerId }),
      }).catch(error => console.error('Błąd podczas zwiększania wyświetleń:', error))

      // Pobierz szczegóły ogłoszenia
      const response = await fetch(`/api/offers/${offerId}`)
      const offerDetails = await response.json()
      
      setSelectedOffer(offerDetails)
      setIsModalOpen(true)
    } catch (error) {
      console.error('Błąd podczas pobierania szczegółów ogłoszenia:', error)
    }
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setSelectedOffer(null)
  }

  const handleFavoriteChange = (offerId: number, isFavorite: boolean) => {
    if (isFavorite) {
      setFavoriteOffers(prev => [...prev, offerId])
    } else {
      setFavoriteOffers(prev => prev.filter(id => id !== offerId))
    }
  }

  if (offers.length === 0) {
    return <p className={styles.empty}>Brak ogłoszeń do wyświetlenia.</p>
  }

  return (
    <>
      <div className={styles.container}>
        {offers.map((o, index) => (
          <React.Fragment key={o.id}>
            <FeatureCard
              id={o.id}
              image={o.image}
              images={o.images}
              title={o.title}
              price={o.price}
              location={o.location}
              onClick={() => handleOfferClick(o.id)}
              isFavorite={favoriteOffers.includes(o.id)}
              onFavoriteChange={handleFavoriteChange}
              isPromoted={o.isPromoted}
              views={o.views}
              likes={o.likes}
            />
          </React.Fragment>
        ))}
      </div>
      
      {/* Reklama na końcu listy */}
      {offers.length > 0 && (
        <div className={styles.bottomAd}>
          <Advertisement type="bottom" />
        </div>
      )}
      
      <OfferModal
        offer={selectedOffer}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </>
  )
}
