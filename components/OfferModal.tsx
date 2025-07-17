// components/OfferModal.tsx
import { useEffect, useState } from 'react'
import styles from './OfferModal.module.css'
import RatingModal from './RatingModal'
import { Advertisement } from './AdBlocker'

type Theme = 'dark' | 'light' | 'night' | 'natura'

interface OfferModalProps {
  offer: any
  isOpen: boolean
  onClose: () => void
}

export default function OfferModal({ offer, isOpen, onClose }: OfferModalProps) {
  const [activeImg, setActiveImg] = useState(0)
  const [imageLoading, setImageLoading] = useState(false)
  const [touchStart, setTouchStart] = useState<number | null>(null)
  const [touchEnd, setTouchEnd] = useState<number | null>(null)
  const [currentTheme, setCurrentTheme] = useState<Theme>('natura')
  const [showRatingModal, setShowRatingModal] = useState(false)
  const [currentUser, setCurrentUser] = useState<any>(null)
  const [promoting, setPromoting] = useState(false)
  const [hasRated, setHasRated] = useState(false)
  
  // Minimum distance for swipe
  const minSwipeDistance = 50
  
  useEffect(() => {
    // Pobierz informacje o aktualnie zalogowanym użytkowniku
    fetch('/api/auth/me')
      .then(response => response.json())
      .then(data => {
        console.log('API /api/auth/me response:', data)
        if (data.user) {
          setCurrentUser(data.user)
          // Sprawdź czy już ocenił tego użytkownika dla tej oferty
          checkIfAlreadyRated(data.user.email)
        }
      })
      .catch(error => console.error('Error fetching user:', error))
  }, [])

  const checkIfAlreadyRated = async (userEmail: string) => {
    try {
      const token = document.cookie.split(';').find(row => row.startsWith('token='))?.split('=')[1]
      
      if (!token) return

      const response = await fetch(`/api/ratings/check?reviewedEmail=${offer.contactEmail}&offerId=${offer.id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        const data = await response.json()
        setHasRated(data.hasRated)
      }
    } catch (error) {
      console.error('Error checking rating:', error)
    }
  }

  useEffect(() => {
    // Nasłuchuj zmian motywu
    const observer = new MutationObserver(() => {
      const theme = document.documentElement.getAttribute('data-theme') as Theme || 'natura'
      setCurrentTheme(theme)
    })
    
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme']
    })
    
    // Ustaw początkowy motyw
    const initialTheme = document.documentElement.getAttribute('data-theme') as Theme || 'natura'
    setCurrentTheme(initialTheme)
    
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
      
      // Scroll to top when modal opens
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      })
      
      // Keyboard navigation dla zdjęć
      const handleKeyPress = (e: KeyboardEvent) => {
        if (e.key === 'ArrowLeft') {
          prevImage()
        } else if (e.key === 'ArrowRight') {
          nextImage()
        } else if (e.key === 'Escape') {
          onClose()
        }
      }
      
      document.addEventListener('keydown', handleKeyPress)
      
      return () => {
        document.removeEventListener('keydown', handleKeyPress)
      }
    } else {
      document.body.style.overflow = 'unset'
    }
    
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  if (!isOpen || !offer) return null

  const handleBackdropClick = (e: React.MouseEvent) => {
    // Sprawdź czy kliknięto w header
    const target = e.target as HTMLElement
    if (target.closest('header') || target.closest('[data-header="true"]')) {
      return
    }
    
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  const handleModalClick = (e: React.MouseEvent) => {
    e.stopPropagation()
  }

  const images = offer.images?.length ? offer.images : [offer.image || '/house4k.jpg']

  const nextImage = () => {
    setImageLoading(true)
    setTimeout(() => {
      setActiveImg((prev) => (prev + 1) % images.length)
      setImageLoading(false)
    }, 200)
  }

  const prevImage = () => {
    setImageLoading(true)
    setTimeout(() => {
      setActiveImg((prev) => (prev - 1 + images.length) % images.length)
      setImageLoading(false)
    }, 200)
  }

  const handleChatStart = async () => {
    try {
      const token = document.cookie.split(';').find(row => row.startsWith('token='))?.split('=')[1]
      
      if (!token) {
        alert('Musisz być zalogowany aby rozpocząć chat')
        window.location.href = '/login'
        return
      }

      const response = await fetch('/api/auth/chats/new', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ withEmail: offer.contactEmail })
      })
      
      if (response.ok) {
        const data = await response.json()
        // Przekieruj do profilu z otwartym chatem
        window.location.href = `/profile?tab=chat&chatId=${data.chatId}`
      } else {
        const error = await response.json()
        alert(error.error || 'Błąd podczas rozpoczynania chatu')
      }
    } catch (error) {
      console.error('Error starting chat:', error)
      alert('Błąd podczas rozpoczynania chatu')
    }
  }

  const handlePromoteOffer = async () => {
    setPromoting(true)
    try {
      const token = document.cookie.split(';').find(row => row.startsWith('token='))?.split('=')[1]
      
      if (!token) {
        alert('Musisz być zalogowany aby promować ofertę')
        window.location.href = '/login'
        return
      }

      const response = await fetch('/api/offers/promote', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ offerId: offer.id })
      })
      
      if (response.ok) {
        const data = await response.json()
        alert(`Oferta została promowana pomyślnie! Pozostało promowań: ${data.promotionsRemaining}`)
        onClose() // Close modal after successful promotion
      } else {
        const error = await response.json()
        alert(error.error || 'Błąd podczas promowania oferty')
      }
    } catch (error) {
      console.error('Error promoting offer:', error)
      alert('Błąd podczas promowania oferty')
    } finally {
      setPromoting(false)
    }
  }

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null)
    setTouchStart(e.targetTouches[0].clientX)
  }

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX)
  }

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return
    
    const distance = touchStart - touchEnd
    const isLeftSwipe = distance > minSwipeDistance
    const isRightSwipe = distance < -minSwipeDistance

    if (isLeftSwipe && images.length > 1) {
      nextImage()
    }
    if (isRightSwipe && images.length > 1) {
      prevImage()
    }
  }

  const getBackgroundContent = () => {
    switch (currentTheme) {
      case 'light':
        return (
          <video
            className={styles.bgVideo}
            src="/chmury.mp4"
            autoPlay
            loop
            muted
            playsInline
          />
        )
      case 'dark':
        return (
          <video
            className={styles.bgVideo}
            src="/smoke.mp4"
            autoPlay
            loop
            muted
            playsInline
          />
        )
      case 'night':
        return <div className={styles.nightBackground} />
      case 'natura':
        return <div className={styles.naturaBackground} />
      default:
        return <div className={styles.naturaBackground} />
    }
  }

  return (
    <div className={styles.modalOverlay} onClick={handleBackdropClick}>
      {/* Tło w zależności od motywu */}
      <div className={styles.bgContainer}>
        {getBackgroundContent()}
        <div className={styles.bgTint} />
      </div>
      
      <div className={styles.modalContent} onClick={handleModalClick}>
        <button className={styles.closeBtn} onClick={onClose}>
          <span>×</span>
        </button>
        
        {/* Galeria zdjęć na górze */}
        <div className={styles.imagesSection}>
          <div className={styles.mainImageContainer}>
            {imageLoading && <div className={styles.loadingSpinner}></div>}
            <img
              src={images[activeImg]}
              alt={`Zdjęcie ${activeImg + 1}`}
              className={styles.mainImage}
              style={{ opacity: imageLoading ? 0.7 : 1 }}
              onTouchStart={onTouchStart}
              onTouchMove={onTouchMove}
              onTouchEnd={onTouchEnd}
            />
            <div className={styles.imageOverlay}></div>
            
            {/* Wskaźnik liczby zdjęć */}
            {images.length > 1 && (
              <div className={styles.imageIndicator}>
                {activeImg + 1} / {images.length}
              </div>
            )}
            
            {/* Keyboard hints */}
            {images.length > 1 && (
              <div className={styles.keyboardHints}>
                ← → lub kliknij aby przewijać
              </div>
            )}
            
            {/* Nawigacja po zdjęciach */}
            {images.length > 1 && (
              <>
                <button 
                  className={`${styles.imageNavigation} ${styles.prevBtn}`}
                  onClick={prevImage}
                  aria-label="Poprzednie zdjęcie"
                  disabled={imageLoading}
                >
                  ←
                </button>
                <button 
                  className={`${styles.imageNavigation} ${styles.nextBtn}`}
                  onClick={nextImage}
                  aria-label="Następne zdjęcie"
                  disabled={imageLoading}
                >
                  →
                </button>
              </>
            )}
          </div>
          {images.length > 1 && (
            <div className={styles.thumbnails}>
              {images.map((img: string, i: number) => (
                <img
                  key={i}
                  src={img}
                  alt={`Miniatura ${i + 1}`}
                  className={`${styles.thumbnail} ${i === activeImg ? styles.activeThumbnail : ''}`}
                  onClick={() => {
                    setImageLoading(true)
                    setTimeout(() => {
                      setActiveImg(i)
                      setImageLoading(false)
                    }, 150)
                  }}
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
              <div className={styles.metaIcon}>📍</div>
              <div className={styles.metaContent}>
                <span className={styles.metaLabel}>Lokalizacja</span>
                <span className={styles.metaValue}>{offer.location}</span>
              </div>
            </div>
            <div className={styles.metaItem}>
              <div className={styles.metaIcon}>🏷️</div>
              <div className={styles.metaContent}>
                <span className={styles.metaLabel}>Kategoria</span>
                <span className={styles.metaValue}>{offer.category}</span>
              </div>
            </div>
            <div className={styles.metaItem}>
              <div className={styles.metaIcon}>📅</div>
              <div className={styles.metaContent}>
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
              <div 
                className={`${styles.contactItem} ${styles.clickableUser}`}
                onClick={() => window.open(`/user/${offer.contactEmail}`, '_blank')}
              >
                <div className={styles.contactIcon}>👤</div>
                <div className={styles.contactContent}>
                  <span className={styles.contactLabel}>Imię</span>
                  <span className={styles.contactValue}>{offer.contactName}</span>
                </div>
                <div className={styles.viewProfileHint}>
                  <span>👁️ Zobacz profil</span>
                </div>
              </div>
              <div className={styles.contactItem}>
                <div className={styles.contactIcon}>📧</div>
                <div className={styles.contactContent}>
                  <span className={styles.contactLabel}>Email</span>
                  <span className={styles.contactValue}>{offer.contactEmail}</span>
                </div>
              </div>
              {offer.contactPhone && (
                <div className={styles.contactItem}>
                  <div className={styles.contactIcon}>📞</div>
                  <div className={styles.contactContent}>
                    <span className={styles.contactLabel}>Telefon</span>
                    <span className={styles.contactValue}>{offer.contactPhone}</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Reklama w modalu */}
          <div className={styles.adSection}>
            <Advertisement type="offer" />
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
            {/* Przycisk oceny - tylko jeśli to nie jest ogłoszenie aktualnego użytkownika */}
            {currentUser && currentUser.email !== offer.contactEmail && (
              <button 
                className={`${styles.ratingBtn} ${hasRated ? styles.ratingSuccess : ''}`}
                onClick={() => !hasRated && setShowRatingModal(true)}
                title={hasRated ? "Już oceniłeś tego użytkownika" : "Oceń tego użytkownika po współpracy"}
                disabled={hasRated}
              >
                <span className={styles.btnIcon}>
                  {hasRated ? '✅' : '⭐'}
                </span>
                {hasRated ? 'Ocena wystawiona' : 'Wystaw ocenę'}
              </button>
            )}
            {/* Przycisk promowania oferty - tylko dla właściciela oferty */}
            {currentUser && currentUser.email === offer.contactEmail && (
              <button 
                className={styles.promoteBtn} 
                onClick={handlePromoteOffer}
                disabled={promoting}
              >
                {promoting ? 'Promowanie...' : 'Promuj ofertę'}
              </button>
            )}
          </div>
        </div>
      </div>
      
      {/* Modal oceny */}
      {showRatingModal && (
        <RatingModal
          isOpen={showRatingModal}
          onClose={() => setShowRatingModal(false)}
          userEmail={offer.contactEmail}
          userName={offer.contactEmail}
          offerId={offer.id}
          offerTitle={offer.title}
          onRatingAdded={() => {
            setShowRatingModal(false)
            setHasRated(true)
            // Możesz dodać toast notification o sukcesie
            setTimeout(() => {
              alert('Ocena została wystawiona pomyślnie!')
            }, 100)
          }}
        />
      )}
    </div>
  )
}
