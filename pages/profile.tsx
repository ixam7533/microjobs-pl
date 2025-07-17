import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Header from '../components/Header'
import styles from '../styles/Profile.module.css'
import ChatList from '../components/ChatList'
import ChatWindow from '../components/ChatWindow'
import OfferModal from '../components/OfferModal'
import AccountSettings from '../components/AccountSettings'
import UserRatings from '../components/UserRatings'
import SubscriptionManager from '../components/SubscriptionManager'

type Theme = 'dark' | 'light' | 'night' | 'natura'
type Tab = 'offers' | 'favorites' | 'chat' | 'settings' | 'ratings' | 'subscription'

interface Offer {
  id: string
  title: string
  price: number
  description: string
  category: string
  location: string
  ownerEmail: string
  createdAt: string
  images?: string[]
}

export default function Profile() {
  const router = useRouter()
  const [offers, setOffers] = useState<Offer[]>([])
  const [favorites, setFavorites] = useState<Offer[]>([])
  const [user, setUser] = useState<{email:string; isAdmin?: boolean}|null>(null)
  const [selectedChatId, setSelectedChatId] = useState<number | null>(null)
  const [currentTheme, setCurrentTheme] = useState<Theme>('natura')
  const [activeTab, setActiveTab] = useState<Tab>('offers')
  const [selectedOffer, setSelectedOffer] = useState<Offer | null>(null)
  const [promotingOfferId, setPromotingOfferId] = useState<string | null>(null)

  useEffect(() => {
    fetch('/api/auth/me').then(r=>r.json()).then(d=>setUser(d.user))
  },[])

  // Obsługa parametrów URL
  useEffect(() => {
    if (router.query.tab) {
      setActiveTab(router.query.tab as Tab)
    }
    if (router.query.chatId) {
      setSelectedChatId(parseInt(router.query.chatId as string))
    }
  }, [router.query])

  useEffect(() => {
    if (!user) return
    fetch('/api/offers')
      .then(r=>r.json())
      .then((data: { offers: Offer[] }) => {
        const all = data.offers || []
        if (user.isAdmin) {
          // Admin widzi wszystkie ogłoszenia
          setOffers(all)
        } else {
          // Zwykły użytkownik widzi tylko swoje
          setOffers(all.filter(o => o.ownerEmail === user.email))
        }
      })
      .catch(console.error)
  },[user])

  useEffect(() => {
    if (!user) return
    // Pobierz ulubione ogłoszenia
    fetch('/api/auth/favorites')
      .then(r=>r.json())
      .then(setFavorites)
      .catch(console.error)
  },[user])

  useEffect(() => {
    const observer = new MutationObserver(() => {
      const theme = document.documentElement.getAttribute('data-theme') as Theme || 'natura'
      setCurrentTheme(theme)
    })
    
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme']
    })
    
    
    const initialTheme = document.documentElement.getAttribute('data-theme') as Theme || 'natura'
    setCurrentTheme(initialTheme)
    
    return () => observer.disconnect()
  }, [])

  const del = async (id: string | number) => {
    if (confirm('Usunąć to ogłoszenie?')) {
      await fetch(`/api/offers/${id}`,{method:'DELETE'})
      setOffers(offers.filter(o=>o.id!==id))
    }
  }

  const openOfferDetails = (offer: Offer) => {
    setSelectedOffer(offer)
  }

  const closeOfferDetails = () => {
    setSelectedOffer(null)
  }

  const promoteOffer = async (offerId: string) => {
    setPromotingOfferId(offerId)
    try {
      const token = document.cookie.split(';').find(row => row.startsWith('token='))?.split('=')[1]
      if (!token) {
        alert('Musisz być zalogowany')
        return
      }

      const response = await fetch('/api/offers/promote', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ offerId })
      })

      if (response.ok) {
        const data = await response.json()
        alert(`Ogłoszenie zostało promowane! Pozostało promowań: ${data.promotionsRemaining}`)
        // Refresh offers to show promoted status
        if (user) {
          fetch('/api/offers').then(r=>r.json()).then(all=>{
            if (user.isAdmin) {
              setOffers(all)
            } else {
              setOffers(all.filter((o: any) => o.ownerEmail === user.email))
            }
          })
        }
      } else {
        const error = await response.json()
        alert(error.error || 'Błąd podczas promowania ogłoszenia')
      }
    } catch (error) {
      console.error('Error promoting offer:', error)
      alert('Błąd podczas promowania ogłoszenia')
    } finally {
      setPromotingOfferId(null)
    }
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case 'offers':
        return (
          <div className={styles.offersGrid}>
            {offers.length === 0 ? (
              <div className={styles.emptyState}>
                <h3>Brak ogłoszeń</h3>
                <p>Nie masz jeszcze żadnych ogłoszeń.</p>
                <a href="/add-new" className={styles.addButton}>Dodaj pierwsze ogłoszenie</a>
              </div>
            ) : (
              offers.map((offer) => (
                <div key={offer.id} className={styles.offerCard} onClick={() => openOfferDetails(offer)}>
                  <div className={styles.offerHeader}>
                    <h3>{offer.title}</h3>
                    <span className={styles.offerPrice}>{offer.price} zł</span>
                  </div>
                  <p className={styles.offerDescription}>{offer.description}</p>
                  <div className={styles.offerFooter}>
                    <span className={styles.offerCategory}>{offer.category}</span>
                    <span className={styles.offerLocation}>{offer.location}</span>
                  </div>
                  <div className={styles.offerActions}>
                    <button onClick={(e) => { e.stopPropagation(); del(offer.id) }} className={styles.deleteBtn}>
                      Usuń
                    </button>
                    <button 
                      onClick={(e) => { 
                        e.stopPropagation(); 
                        promoteOffer(offer.id) 
                      }} 
                      className={styles.promoteBtn}
                      disabled={promotingOfferId === offer.id}
                    >
                      {promotingOfferId === offer.id ? 'Promowanie...' : 'Promuj'}
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )
      case 'favorites':
        return (
          <div className={styles.offersGrid}>
            {favorites.length === 0 ? (
              <div className={styles.emptyState}>
                <h3>Brak ulubionych ogłoszeń</h3>
                <p>Nie masz jeszcze żadnych ulubionych ogłoszeń.</p>
                <a href="/" className={styles.addButton}>Przeglądaj ogłoszenia</a>
              </div>
            ) : (
              favorites.map((offer) => (
                <div key={offer.id} className={styles.offerCard} onClick={() => openOfferDetails(offer)}>
                  <div className={styles.offerHeader}>
                    <h3>{offer.title}</h3>
                    <span className={styles.offerPrice}>{offer.price} zł</span>
                  </div>
                  <p className={styles.offerDescription}>{offer.description}</p>
                  <div className={styles.offerFooter}>
                    <span className={styles.offerCategory}>{offer.category}</span>
                    <span className={styles.offerLocation}>{offer.location}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        )
      case 'chat':
        return (
          <div className={styles.tabContent}>
            <h3>Wiadomości</h3>
            <p>Tutaj będą wyświetlane Twoje rozmowy.</p>
          </div>
        )
      case 'settings':
        return (
          <div className={styles.tabContent}>
            <AccountSettings user={user} />
          </div>
        )
      case 'ratings':
        return (
          <div className={styles.tabContent}>
            {user ? (
              <UserRatings userEmail={user.email} />
            ) : (
              <div className={styles.emptyState}>
                <h3>Ładowanie...</h3>
                <p>Proszę czekać...</p>
              </div>
            )}
          </div>
        )
      case 'subscription':
        return (
          <div className={styles.tabContent}>
            <SubscriptionManager onSubscriptionChange={() => {
              // Refresh user data after subscription change
              fetch('/api/auth/me').then(r=>r.json()).then(d=>setUser(d.user))
            }} />
          </div>
        )
      default:
        return null
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
    }
  }

  return (
    <div className={styles.page}>
      <Header />
      
      <main className={styles.main}>
        <div className={styles.bgContainer}>
          {getBackgroundContent()}
          <div className={styles.bgTint} />
        </div>

        <div className={styles.content}>
          <div className={styles.profileLayout}>
            {/* Lewa strona - Menu */}
            <div className={styles.sidebar}>
              <div className={styles.userInfo}>
                <div className={styles.userAvatar}>
                  {user?.email?.charAt(0).toUpperCase() || 'U'}
                </div>
                <div className={styles.userDetails}>
                  <h2>Mój profil</h2>
                  <p>{user?.email}</p>
                  {user?.isAdmin && <span className={styles.adminBadge}>Admin</span>}
                </div>
              </div>
              
              <nav className={styles.navigation}>
                <button 
                  className={`${styles.navButton} ${activeTab === 'offers' ? styles.active : ''}`}
                  onClick={() => setActiveTab('offers')}
                >
                  <span className={styles.navIcon}>📋</span>
                  Moje ogłoszenia
                  <span className={styles.navCount}>{offers.length}</span>
                </button>
                <button 
                  className={`${styles.navButton} ${activeTab === 'favorites' ? styles.active : ''}`}
                  onClick={() => setActiveTab('favorites')}
                >
                  <span className={styles.navIcon}>❤️</span>
                  Ulubione
                  <span className={styles.navCount}>{favorites.length}</span>
                </button>
                <button 
                  className={`${styles.navButton} ${activeTab === 'chat' ? styles.active : ''}`}
                  onClick={() => setActiveTab('chat')}
                >
                  <span className={styles.navIcon}>💬</span>
                  Chat
                </button>
                <button 
                  className={`${styles.navButton} ${activeTab === 'settings' ? styles.active : ''}`}
                  onClick={() => setActiveTab('settings')}
                >
                  <span className={styles.navIcon}>⚙️</span>
                  Ustawienia
                </button>
                <button 
                  className={`${styles.navButton} ${activeTab === 'ratings' ? styles.active : ''}`}
                  onClick={() => setActiveTab('ratings')}
                >
                  <span className={styles.navIcon}>⭐</span>
                  Moje oceny
                </button>
                <button 
                  className={`${styles.navButton} ${activeTab === 'subscription' ? styles.active : ''}`}
                  onClick={() => setActiveTab('subscription')}
                >
                  <span className={styles.navIcon}>📅</span>
                  Subskrypcje
                </button>
              </nav>
            </div>

            {/* Prawa strona - Zawartość */}
            <div className={styles.mainContent}>
              {renderTabContent()}
            </div>
          </div>
        </div>

        {/* Modal z detalami ogłoszenia */}
        {selectedOffer && (
          <div className={styles.modal} onClick={closeOfferDetails}>
            <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
              <div className={styles.modalHeader}>
                <h2>{selectedOffer.title}</h2>
                <button className={styles.closeBtn} onClick={closeOfferDetails}>×</button>
              </div>
              <div className={styles.modalBody}>
                <div className={styles.offerPrice}>{selectedOffer.price} zł</div>
                <div className={styles.offerMeta}>
                  <span className={styles.category}>{selectedOffer.category}</span>
                  <span className={styles.location}>{selectedOffer.location}</span>
                  <span className={styles.date}>
                    {new Date(selectedOffer.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <div className={styles.offerDescription}>
                  {selectedOffer.description}
                </div>
                <div className={styles.contactInfo}>
                  <strong>Kontakt:</strong> {selectedOffer.ownerEmail}
                </div>
              </div>
              <div className={styles.modalFooter}>
                <button className={styles.editBtn}>Edytuj ogłoszenie</button>
                <button 
                  className={styles.deleteBtn} 
                  onClick={() => {
                    del(selectedOffer.id)
                    closeOfferDetails()
                  }}
                >
                  Usuń ogłoszenie
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
