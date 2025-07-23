import styles from './OfferModal.module.css'
import { useEffect, useState } from 'react'

interface OfferModalProps {
  offer: any
  isOpen: boolean
  onClose: () => void
}

export default function OfferModal({ offer, isOpen, onClose }: OfferModalProps) {
  const [activeImg, setActiveImg] = useState(0)
  
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  if (!isOpen || !offer) return null

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  const images = offer.images?.length ? offer.images : [offer.image || '/house4k.jpg']

  const handleChatStart = async () => {
    try {
      const response = await fetch('/api/auth/chats/new', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ withEmail: offer.contactEmail })
      })
      if (response.ok) {
        const chat = await response.json()
        window.location.href = `/profile?tab=chat&chatId=${chat.chatId}&offerId=${offer.id}`
      } else {
        alert('Błąd podczas rozpoczynania chatu')
      }
    } catch (error) {
      alert('Błąd podczas rozpoczynania chatu')
    }
  }

  return (
    <div className={styles.modalOverlay} onClick={handleBackdropClick}>
      <div className={styles.modalContent}>
        <button className={styles.closeBtn} onClick={onClose}>
          <span>×</span>
        </button>
        
        {/* Galeria zdjęć na górze */}
        <div className={styles.imagesSection}>
          <div className={styles.mainImageContainer}>
            <img
              src={images[activeImg]}
              alt={`Zdjęcie ${activeImg + 1}`}
              className={styles.mainImage}
            />
            <div className={styles.imageOverlay}></div>
          </div>
          {images.length > 1 && (
            <div className={styles.thumbnails}>
              {images.map((img: string, i: number) => (
                <img
                  key={i}
                  src={img}
                  alt={`Miniatura ${i + 1}`}
                  className={`${styles.thumbnail} ${i === activeImg ? styles.activeThumbnail : ''}`}
                  onClick={() => setActiveImg(i)}
                />
              ))}
            </div>
          )}
        </div>

        {/* Sekcja główna */}
        <div className={styles.contentSection}>
          {/* Tytuł i cena */}
          <div className={styles.titleSection}>
            <h1 className={styles.title}>{offer.title}</h1>
            <div className={styles.priceTag}>
              <span className={styles.price}>{offer.price || 100} zł</span>
            </div>
          </div>

          {/* Meta informacje */}
          <div className={styles.metaInfo}>
            <div className={styles.metaItem}>
              <span className={styles.metaIcon}>📍</span>
              <span className={styles.metaLabel}>Lokalizacja</span>
              <span className={styles.metaValue}>{offer.location}</span>
            </div>
            <div className={styles.metaItem}>
              <span className={styles.metaIcon}>🏷️</span>
              <span className={styles.metaLabel}>Kategoria</span>
              <span className={styles.metaValue}>{offer.category}</span>
            </div>
            <div className={styles.metaItem}>
              <span className={styles.metaIcon}>📅</span>
              <span className={styles.metaLabel}>Data dodania</span>
              <span className={styles.metaValue}>
                {new Date(offer.createdAt).toLocaleDateString('pl-PL', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric'
                })}
              </span>
            </div>
          </div>

          {/* Opis */}
          <div className={styles.descriptionSection}>
            <h3 className={styles.sectionTitle}>Opis oferty</h3>
            <div className={styles.description}>{offer.description}</div>
          </div>

          {/* Kontakt */}
          <div className={styles.contactSection}>
            <h3 className={styles.sectionTitle}>Kontakt</h3>
            <div className={styles.contactGrid}>
              <div className={styles.contactItem}>
                <span className={styles.contactIcon}>👤</span>
                <div>
                  <span className={styles.contactLabel}>Imię</span>
                  <span className={styles.contactValue}>
                    {offer.ownerName || offer.owner?.name || offer.contactName}
                  </span>
                </div>
              </div>
              <div className={styles.contactItem}>
                <span className={styles.contactIcon}>📧</span>
                <div>
                  <span className={styles.contactLabel}>Email</span>
                  <span className={styles.contactValue}>{offer.contactEmail}</span>
                </div>
              </div>
              {offer.contactPhone && (
                <div className={styles.contactItem}>
                  <span className={styles.contactIcon}>📞</span>
                  <div>
                    <span className={styles.contactLabel}>Telefon</span>
                    <span className={styles.contactValue}>{offer.contactPhone}</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Akcje */}
          <div className={styles.actionSection}>
            <button 
              className={styles.primaryBtn}
              onClick={() => window.open(`mailto:${offer.contactEmail}?subject=Ogłoszenie: ${offer.title}`)}
            >
              <span className={styles.btnIcon}>📧</span>
              Wyślij email
            </button>
            <button className={styles.secondaryBtn} onClick={handleChatStart}>
              <span className={styles.btnIcon}>💬</span>
              Napisz wiadomość
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
