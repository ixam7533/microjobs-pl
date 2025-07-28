import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import styles from './FeatureCard.module.css'
import { FaHeart, FaRegHeart, FaEye } from 'react-icons/fa'

interface FeatureCardProps {
  id: number
  image: string
  images?: string[]
  title: string
  price: string | number
  location: string
  onClick?: () => void
  isFavorite?: boolean
  onFavoriteChange?: (id: number, isFavorite: boolean) => void
  isPromoted?: boolean
  views?: number
  likes?: number
}

export default function FeatureCard({ 
  id, 
  image, 
  images,
  title, 
  price, 
  location, 
  onClick, 
  isFavorite = false,
  onFavoriteChange,
  isPromoted = false,
  views = 0,
  likes = 0
}: FeatureCardProps) {
  const router = useRouter()
  const [fav, setFav] = useState(isFavorite)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    setFav(isFavorite)
  }, [isFavorite])

  // Wybierz pierwsze dostępne zdjęcie
  const displayImage = images && images.length > 0 ? images[0] : image || '/house4k.jpg'

  const handleCardClick = (e: React.MouseEvent) => {
    // Sprawdź czy kliknięto środkowy przycisk lub Ctrl+klik
    if (e.button === 1 || (e.button === 0 && e.ctrlKey)) {
      // Otwórz w nowej karcie
      e.preventDefault()
      window.open(`/offer/${id}`, '_blank')
    } else if (e.button === 0) {
      // Normalny klik - wywołaj onClick callback (otwórz modal)
      onClick?.()
    }
  }

  async function toggleFav(e: React.MouseEvent) {
    e.stopPropagation()
    
    if (isLoading) return
    setIsLoading(true)

    try {
      if (fav) {
        // Usuń z ulubionych
        const response = await fetch('/api/auth/favorites', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ offerId: id })
        })

        if (response.ok) {
          setFav(false)
          onFavoriteChange?.(id, false)
        }
      } else {
        // Dodaj do ulubionych
        const response = await fetch('/api/auth/favorites', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ offerId: id })
        })

        if (response.ok) {
          setFav(true)
          onFavoriteChange?.(id, true)
        }
      }
    } catch (error) {
      console.error('Błąd zarządzania ulubionymi:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div 
      className={`${styles.card} ${isPromoted ? styles.promoted : ''}`} 
      onClick={handleCardClick}
      onMouseDown={handleCardClick}
      style={{ cursor: 'pointer' }}
    >
      <div className={styles.imageContainer}>
        <img src={displayImage} alt={title} className={styles.image} />
        {isPromoted && (
          <div className={styles.promotedBadge}>
            PROMOWANE
          </div>
        )}
        <button 
          className={styles.favBtn} 
          onClick={toggleFav}
          disabled={isLoading}
          onMouseDown={(e) => e.stopPropagation()} // Zapobiega propagacji zdarzenia do karty
        >
          {fav ? (
            <FaHeart color="#e63946" />
          ) : (
            <FaRegHeart color="#fff" />
          )}
        </button>
      </div>
      <div className={styles.info}>
        <h3>{title}</h3>
        <div className={styles.price}>{typeof price === 'number' ? `${price} zł` : price}</div>
        <div className={styles.location}>{location}</div>
        
        {/* Statystyki */}
        <div className={styles.stats}>
          <div className={styles.stat}>
            <FaEye className={styles.statIcon} />
            <span>{views || 0}</span>
          </div>
          <div className={styles.stat}>
            <FaHeart className={styles.statIcon} />
            <span>{likes || 0}</span>
          </div>
        </div>
        
        <div className={styles.actions}>
          <a 
            href={`/offer/${id}`}
            className={styles.viewLink}
            onClick={(e) => e.stopPropagation()}
            title="Zobacz szczegóły ogłoszenia"
          >
            Zobacz szczegóły →
          </a>
        </div>
      </div>
    </div>
  )
}
