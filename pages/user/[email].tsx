// pages/user/[email].tsx
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import styles from '../../styles/UserProfile.module.css'
import Header from '../../components/Header'
import Footer from '../../components/Footer'

interface UserStats {
  totalOffers: number
  activeOffers: number
  averageRating: number
  totalRatings: number
  memberSince: string
}

interface Offer {
  id: string
  title: string
  description: string
  price: number
  location: string
  category: string
  image: string
  createdAt: string
  isActive: boolean
}

interface Rating {
  id: string
  rating: number
  comment: string
  createdAt: string
  fromUser: string
  offerTitle: string
}

export default function UserProfile() {
  const router = useRouter()
  const { email } = router.query
  const [userStats, setUserStats] = useState<UserStats | null>(null)
  const [offers, setOffers] = useState<Offer[]>([])
  const [ratings, setRatings] = useState<Rating[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'offers' | 'ratings'>('offers')
  const [userName, setUserName] = useState('')

  useEffect(() => {
    if (email) {
      fetchUserData()
    }
  }, [email])

  const fetchUserData = async () => {
    try {
      setLoading(true)
      
      // Pobierz statystyki użytkownika
      const statsResponse = await fetch(`/api/user/stats?email=${email}`)
      if (statsResponse.ok) {
        const stats = await statsResponse.json()
        setUserStats(stats)
        setUserName(stats.userName || email)
      }

      // Pobierz oferty użytkownika
      const offersResponse = await fetch(`/api/user/offers?email=${email}`)
      if (offersResponse.ok) {
        const offersData = await offersResponse.json()
        setOffers(offersData)
      }

      // Pobierz oceny użytkownika
      const ratingsResponse = await fetch(`/api/user/ratings?email=${email}`)
      if (ratingsResponse.ok) {
        const ratingsData = await ratingsResponse.json()
        setRatings(ratingsData)
      }

    } catch (error) {
      console.error('Error fetching user data:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pl-PL', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    })
  }

  const renderStars = (rating: number) => {
    const stars = []
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span key={i} className={i <= rating ? styles.starFilled : styles.starEmpty}>
          ⭐
        </span>
      )
    }
    return stars
  }

  if (loading) {
    return (
      <div className={styles.container}>
        <Header />
        <div className={styles.loading}>
          <div className={styles.spinner}></div>
          <p>Ładowanie profilu użytkownika...</p>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className={styles.container}>
      <Header />
      
      <div className={styles.profileContainer}>
        {/* Header profilu */}
        <div className={styles.profileHeader}>
          <div className={styles.userAvatar}>
            <span className={styles.avatarText}>
              {userName.charAt(0).toUpperCase()}
            </span>
          </div>
          <div className={styles.userInfo}>
            <h1 className={styles.userName}>{userName}</h1>
            <p className={styles.userEmail}>{email}</p>
            <div className={styles.userStats}>
              <div className={styles.statItem}>
                <span className={styles.statNumber}>{userStats?.totalOffers || 0}</span>
                <span className={styles.statLabel}>Ogłoszeń</span>
              </div>
              <div className={styles.statItem}>
                <span className={styles.statNumber}>{userStats?.activeOffers || 0}</span>
                <span className={styles.statLabel}>Aktywnych</span>
              </div>
              <div className={styles.statItem}>
                <span className={styles.statNumber}>
                  {userStats?.averageRating ? userStats.averageRating.toFixed(1) : 'Brak'}
                </span>
                <span className={styles.statLabel}>Średnia ocena</span>
              </div>
              <div className={styles.statItem}>
                <span className={styles.statNumber}>{userStats?.totalRatings || 0}</span>
                <span className={styles.statLabel}>Ocen</span>
              </div>
            </div>
            {userStats?.memberSince && (
              <p className={styles.memberSince}>
                Użytkownik od {formatDate(userStats.memberSince)}
              </p>
            )}
          </div>
        </div>

        {/* Nawigacja zakładek */}
        <div className={styles.tabNavigation}>
          <button
            className={`${styles.tabButton} ${activeTab === 'offers' ? styles.activeTab : ''}`}
            onClick={() => setActiveTab('offers')}
          >
            <span className={styles.tabIcon}>📋</span>
            Ogłoszenia ({offers.length})
          </button>
          <button
            className={`${styles.tabButton} ${activeTab === 'ratings' ? styles.activeTab : ''}`}
            onClick={() => setActiveTab('ratings')}
          >
            <span className={styles.tabIcon}>⭐</span>
            Oceny ({ratings.length})
          </button>
        </div>

        {/* Zawartość zakładek */}
        <div className={styles.tabContent}>
          {activeTab === 'offers' && (
            <div className={styles.offersGrid}>
              {offers.length > 0 ? (
                offers.map((offer) => (
                  <div key={offer.id} className={styles.offerCard}>
                    <div className={styles.offerImage}>
                      <img src={offer.image || '/house4k.jpg'} alt={offer.title} />
                      <div className={styles.offerStatus}>
                        <span className={offer.isActive ? styles.activeStatus : styles.inactiveStatus}>
                          {offer.isActive ? 'Aktywne' : 'Nieaktywne'}
                        </span>
                      </div>
                    </div>
                    <div className={styles.offerContent}>
                      <h3 className={styles.offerTitle}>{offer.title}</h3>
                      <p className={styles.offerDescription}>
                        {offer.description.length > 100 
                          ? `${offer.description.substring(0, 100)}...` 
                          : offer.description}
                      </p>
                      <div className={styles.offerMeta}>
                        <span className={styles.offerPrice}>{offer.price} zł</span>
                        <span className={styles.offerLocation}>{offer.location}</span>
                      </div>
                      <div className={styles.offerFooter}>
                        <span className={styles.offerCategory}>{offer.category}</span>
                        <span className={styles.offerDate}>{formatDate(offer.createdAt)}</span>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className={styles.emptyState}>
                  <span className={styles.emptyIcon}>📋</span>
                  <h3>Brak ogłoszeń</h3>
                  <p>Ten użytkownik nie ma jeszcze żadnych ogłoszeń.</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'ratings' && (
            <div className={styles.ratingsContainer}>
              {ratings.length > 0 ? (
                <>
                  <div className={styles.ratingsSummary}>
                    <div className={styles.averageRating}>
                      <span className={styles.ratingNumber}>
                        {userStats?.averageRating ? userStats.averageRating.toFixed(1) : '0.0'}
                      </span>
                      <div className={styles.ratingStars}>
                        {renderStars(Math.round(userStats?.averageRating || 0))}
                      </div>
                      <span className={styles.ratingCount}>
                        na podstawie {ratings.length} ocen
                      </span>
                    </div>
                  </div>
                  
                  <div className={styles.ratingsList}>
                    {ratings.map((rating) => (
                      <div key={rating.id} className={styles.ratingCard}>
                        <div className={styles.ratingHeader}>
                          <div className={styles.ratingStars}>
                            {renderStars(rating.rating)}
                          </div>
                          <span className={styles.ratingDate}>{formatDate(rating.createdAt)}</span>
                        </div>
                        <p className={styles.ratingComment}>{rating.comment}</p>
                        <div className={styles.ratingFooter}>
                          <span className={styles.ratingOffer}>Za: {rating.offerTitle}</span>
                          <span className={styles.ratingFrom}>Od: {rating.fromUser}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <div className={styles.emptyState}>
                  <span className={styles.emptyIcon}>⭐</span>
                  <h3>Brak ocen</h3>
                  <p>Ten użytkownik nie ma jeszcze żadnych ocen.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      
      <Footer />
    </div>
  )
}
