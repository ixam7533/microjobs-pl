import React, { useState, useEffect } from 'react'
import styles from './FeatureCard.module.css'
import { FaHeart, FaRegHeart } from 'react-icons/fa'

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
  isPromoted = false
}: FeatureCardProps) {
  const [fav, setFav] = useState(isFavorite)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    setFav(isFavorite)
  }, [isFavorite])

  // Wybierz pierwsze dostępne zdjęcie
  const displayImage = images && images.length > 0 ? images[0] : image || '/house4k.jpg'

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
    <div className={`${styles.card} ${isPromoted ? styles.promoted : ''}`} onClick={onClick}>
      <div className={styles.imageContainer}>
        <img src={displayImage} alt={title} className={styles.image} />
        {isPromoted && (
          <div className={styles.promotedBadge}>
            ⭐ PROMOWANE
          </div>
        )}
        <button 
          className={styles.favBtn} 
          onClick={toggleFav}
          disabled={isLoading}
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
      </div>
    </div>
  )
}
