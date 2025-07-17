import { useState } from 'react'
import styles from './RatingModal.module.css'

interface RatingModalProps {
  isOpen: boolean
  onClose: () => void
  userEmail: string
  userName: string
  offerId?: number
  offerTitle?: string
  onRatingAdded: () => void
}

export default function RatingModal({
  isOpen,
  onClose,
  userEmail,
  userName,
  offerId,
  offerTitle,
  onRatingAdded
}: RatingModalProps) {
  const [rating, setRating] = useState(0)
  const [hoveredRating, setHoveredRating] = useState(0)
  const [comment, setComment] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (rating === 0) return

    setIsSubmitting(true)

    try {
      const token = document.cookie.split(';').find(row => row.startsWith('token='))?.split('=')[1]
      
      const response = await fetch('/api/ratings/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          reviewedEmail: userEmail,
          rating,
          comment,
          offerId
        })
      })

      if (response.ok) {
        onRatingAdded()
        onClose()
        setRating(0)
        setComment('')
      } else {
        const error = await response.json()
        alert(error.message || 'Błąd podczas dodawania oceny')
      }
    } catch (error) {
      console.error('Error adding rating:', error)
      alert('Błąd podczas dodawania oceny')
    } finally {
      setIsSubmitting(false)
    }
  }

  const renderStars = () => {
    const stars = []
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <button
          key={i}
          type="button"
          className={`${styles.star} ${i <= (hoveredRating || rating) ? styles.filled : ''}`}
          onClick={() => setRating(i)}
          onMouseEnter={() => setHoveredRating(i)}
          onMouseLeave={() => setHoveredRating(0)}
        >
          ⭐
        </button>
      )
    }
    return stars
  }

  if (!isOpen) return null

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h2>Oceń użytkownika</h2>
          <button className={styles.closeButton} onClick={onClose}>×</button>
        </div>

        <div className={styles.modalBody}>
          <div className={styles.userInfo}>
            <h3>{userName}</h3>
            {offerTitle && <p className={styles.offerTitle}>Za: {offerTitle}</p>}
          </div>

          <form onSubmit={handleSubmit}>
            <div className={styles.ratingSection}>
              <label>Twoja ocena:</label>
              <div className={styles.starsContainer}>
                {renderStars()}
              </div>
              <span className={styles.ratingText}>
                {rating === 0 ? 'Wybierz ocenę' : `${rating} ${rating === 1 ? 'gwiazdka' : rating < 5 ? 'gwiazdki' : 'gwiazdek'}`}
              </span>
            </div>

            <div className={styles.commentSection}>
              <label htmlFor="comment">Komentarz (opcjonalnie):</label>
              <textarea
                id="comment"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Opisz swoje doświadczenie..."
                rows={4}
                maxLength={500}
              />
              <div className={styles.charCount}>
                {comment.length}/500
              </div>
            </div>

            <div className={styles.modalFooter}>
              <button
                type="button"
                onClick={onClose}
                className={styles.cancelButton}
              >
                Anuluj
              </button>
              <button
                type="submit"
                disabled={rating === 0 || isSubmitting}
                className={styles.submitButton}
              >
                {isSubmitting ? 'Dodawanie...' : 'Dodaj ocenę'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
