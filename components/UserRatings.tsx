import { useState, useEffect } from 'react'
import styles from './UserRatings.module.css'

interface Rating {
  id: number
  rating: number
  comment: string | null
  createdAt: string
  reviewer: {
    email: string
    name: string | null
  }
  offer: {
    id: number
    title: string
  } | null
}

interface UserRatingsProps {
  userEmail: string
}

export default function UserRatings({ userEmail }: UserRatingsProps) {
  const [ratings, setRatings] = useState<Rating[]>([])
  const [averageRating, setAverageRating] = useState(0)
  const [totalRatings, setTotalRatings] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchRatings()
  }, [userEmail])

  const fetchRatings = async () => {
    try {
      const response = await fetch(`/api/ratings/get?userEmail=${encodeURIComponent(userEmail)}`)
      if (response.ok) {
        const data = await response.json()
        setRatings(data.ratings)
        setAverageRating(data.averageRating)
        setTotalRatings(data.totalRatings)
      }
    } catch (error) {
      console.error('Error fetching ratings:', error)
    } finally {
      setLoading(false)
    }
  }

  const renderStars = (rating: number) => {
    const stars = []
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span
          key={i}
          className={`${styles.star} ${i <= rating ? styles.filled : ''}`}
        >
          ⭐
        </span>
      )
    }
    return stars
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pl-PL', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    })
  }

  if (loading) {
    return (
      <div className={styles.ratingsContainer}>
        <div className={styles.loadingSpinner}>Ładowanie ocen...</div>
      </div>
    )
  }

  return (
    <div className={styles.ratingsContainer}>
      <div className={styles.ratingsHeader}>
        <h3>Oceny użytkownika</h3>
        {totalRatings > 0 ? (
          <div className={styles.averageRating}>
            <div className={styles.averageStars}>
              {renderStars(Math.round(averageRating))}
            </div>
            <span className={styles.averageText}>
              {averageRating.toFixed(1)} ({totalRatings} {totalRatings === 1 ? 'ocena' : totalRatings < 5 ? 'oceny' : 'ocen'})
            </span>
          </div>
        ) : (
          <div className={styles.noRatings}>
            <span>Brak ocen</span>
          </div>
        )}
      </div>

      {ratings.length > 0 && (
        <div className={styles.ratingsList}>
          {ratings.map((rating) => (
            <div key={rating.id} className={styles.ratingItem}>
              <div className={styles.ratingHeader}>
                <div className={styles.ratingStars}>
                  {renderStars(rating.rating)}
                </div>
                <div className={styles.ratingDate}>
                  {formatDate(rating.createdAt)}
                </div>
              </div>
              
              {rating.comment && (
                <div className={styles.ratingComment}>
                  "{rating.comment}"
                </div>
              )}
              
              <div className={styles.ratingMeta}>
                <span className={styles.reviewer}>
                  przez {rating.reviewer.name || rating.reviewer.email}
                </span>
                {rating.offer && (
                  <span className={styles.offerTitle}>
                    za "{rating.offer.title}"
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
