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
import SmartShopifyPromoButton from '../components/SmartShopifyPromoButton'
import PromotionPaymentModal from '../components/PromotionPaymentModal'

type Theme = 'dark' | 'light' | 'night' | 'natura'
type Tab = 'offers' | 'favorites' | 'chat' | 'settings' | 'ratings' | 'subscription'

interface User {
  email: string
  isAdmin?: boolean
  hasPro?: boolean
  proType?: 'PRO' | 'PRO_PLUS' | null
  promotionsRemaining?: number
}

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
  promoted?: boolean
  promotedUntil?: string
  views?: number
  likes?: number
}

export default function Profile() {
  const router = useRouter()
  const [offers, setOffers] = useState<Offer[]>([])
  const [favorites, setFavorites] = useState<Offer[]>([])
  const [user, setUser] = useState<User | null>(null)
  const [selectedChatId, setSelectedChatId] = useState<number | null>(null)
  const [selectedOfferId, setSelectedOfferId] = useState<string | null>(null)
  const [currentTheme, setCurrentTheme] = useState<Theme>('natura')
  const [activeTab, setActiveTab] = useState<Tab>('offers')
  const [selectedOffer, setSelectedOffer] = useState<Offer | null>(null)
  const [promotingOfferId, setPromotingOfferId] = useState<string | null>(null)
  const [showPromotionModal, setShowPromotionModal] = useState(false)
  const [offerToPromote, setOfferToPromote] = useState<Offer | null>(null)

  useEffect(() => {
    fetch('/api/auth/me').then(r=>r.json()).then(d=>setUser(d.user))
  },[])

  // Obsługa parametrów URL i localStorage mapowania
  useEffect(() => {
    if (router.query.tab) {
      setActiveTab(router.query.tab as Tab)
    }
    if (router.query.chatId) {
      const chatId = parseInt(router.query.chatId as string)
      setSelectedChatId(chatId)
      
      // Jeśli offerId jest w URL, użyj go
      if (router.query.offerId) {
        setSelectedOfferId(router.query.offerId as string)
      } else {
        // Jeśli nie ma offerId w URL, sprawdź localStorage
        try {
          const chatOfferMap = JSON.parse(localStorage.getItem('chatOfferMap') || '{}')
          const mappedOfferId = chatOfferMap[chatId]
          if (mappedOfferId) {
            console.log('📂 Found offer mapping in localStorage:', { chatId, offerId: mappedOfferId })
            setSelectedOfferId(mappedOfferId.toString())
          }
        } catch (error) {
          console.error('⚠️ Failed to read chat-offer mapping:', error)
        }
      }
    }
    if (router.query.offerId && !router.query.chatId) {
      setSelectedOfferId(router.query.offerId as string)
    }
  }, [router.query])

  useEffect(() => {
    if (!user) return
    
    // Sprawdź czy użytkownik jest adminem
    const isAdmin = user.email === 'admin@admin.com' || user.isAdmin
    
    if (isAdmin) {
      // Admin widzi wszystkie ogłoszenia
      fetch('/api/offers')
        .then(r=>r.json())
        .then((data: { offers: Offer[] }) => {
          setOffers(data.offers || [])
        })
        .catch(console.error)
    } else {
      // Zwykły użytkownik - używaj dedykowanego endpointu
      fetch('/api/auth/my-offers')
        .then(r=>r.json())
        .then((data: { offers: Offer[] }) => {
          setOffers(data.offers || [])
        })
        .catch(console.error)
    }
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
      try {
        const response = await fetch(`/api/offers/${id}`, {
          method: 'DELETE',
          credentials: 'include'
        })
        
        if (response.ok) {
          // Usuń z lokalnego stanu tylko jeśli request się powiódł
          setOffers(offers.filter(o=>o.id!==id))
          alert('Ogłoszenie zostało usunięte!')
        } else {
          const error = await response.json()
          alert(`Błąd: ${error.error || 'Nie udało się usunąć ogłoszenia'}`)
        }
      } catch (error) {
        console.error('Error deleting offer:', error)
        alert('Wystąpił błąd podczas usuwania ogłoszenia')
      }
    }
  }

  const removeFavorite = async (offerId: string | number) => {
    if (confirm('Usunąć z ulubionych?')) {
      try {
        const response = await fetch('/api/auth/favorites', {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json'
          },
          credentials: 'include',
          body: JSON.stringify({ offerId })
        })
        
        if (response.ok) {
          setFavorites(favorites.filter(o => o.id !== offerId))
        } else {
          alert('Błąd podczas usuwania z ulubionych')
        }
      } catch (error) {
        console.error('Error removing from favorites:', error)
        alert('Błąd podczas usuwania z ulubionych')
      }
    }
  }

  const openOfferDetails = async (offer: Offer) => {
    // Przekieruj na stronę główną z wybranym ogłoszeniem
    router.push(`/?offerId=${offer.id}`)
  }

  const closeOfferDetails = () => {
    setSelectedOffer(null)
  }

  const initiatePromotion = (offer: Offer) => {
    // Sprawdź czy użytkownik ma PRO
    if (user?.hasPro) {
      // Użytkownicy PRO - bezpośrednio promuj
      promoteOffer(offer.id)
    } else {
      // Użytkownicy bez PRO - pokaż modal płatności
      setOfferToPromote(offer)
      setShowPromotionModal(true)
    }
  }

  const promoteOffer = async (offerId: string | number) => {
    const offerIdStr = offerId.toString()
    setPromotingOfferId(offerIdStr)
    try {
      const response = await fetch('/api/offers/promote', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ offerId: offerIdStr })
      })

      if (response.ok) {
        const data = await response.json()
        if (user?.hasPro) {
          // Dla PRO+ (promotionsRemaining = -1) wyświetl inną wiadomość
          if (data.promotionsRemaining === -1) {
            alert('Ogłoszenie zostało promowane! (PRO+ - nieograniczone promocje)')
          } else {
            alert(`Ogłoszenie zostało promowane! Pozostało promowań: ${data.promotionsRemaining}`)
          }
        } else {
          alert('Płatność została przetworzona! Ogłoszenie zostało promowane na 7 dni.')
        }
        // Refresh offers to show promoted status
        if (user) {
          const isAdmin = user.email === 'admin@admin.com' || user.isAdmin
          
          if (isAdmin) {
            fetch('/api/offers').then(r=>r.json()).then((data) => {
              setOffers(data.offers || [])
            })
          } else {
            fetch('/api/auth/my-offers').then(r=>r.json()).then((data) => {
              setOffers(data.offers || [])
            })
          }
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

  const handleChatDeleted = (deletedChatId: number) => {
    // Jeśli usunięty chat był aktualnie wybrany, wyczyść wybór
    if (selectedChatId === deletedChatId) {
      setSelectedChatId(null)
      setSelectedOfferId(null)
    }
    
    // Usuń mapowanie z localStorage
    try {
      const chatOfferMap = JSON.parse(localStorage.getItem('chatOfferMap') || '{}')
      delete chatOfferMap[deletedChatId]
      localStorage.setItem('chatOfferMap', JSON.stringify(chatOfferMap))
      console.log('🗑️ Removed chat-offer mapping for chat:', deletedChatId)
    } catch (error) {
      console.error('⚠️ Failed to clean chat-offer mapping:', error)
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
                <div key={offer.id} className={styles.offerCard}>
                  <div className={styles.offerContent} onClick={() => openOfferDetails(offer)}>
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
                  <div className={styles.offerActions}>
                    <button 
                      onClick={(e) => { 
                        e.stopPropagation(); 
                        router.push(`/edit/${offer.id}`)
                      }} 
                      className={styles.editBtn}
                      style={{ width: '100%', fontSize: '0.9rem', padding: '0.8rem 1.2rem' }}
                    >
                      Edytuj ogłoszenie
                    </button>
                    <button 
                      onClick={(e) => { e.stopPropagation(); del(offer.id) }} 
                      className={styles.deleteBtn}
                      style={{ width: '100%', fontSize: '0.9rem', padding: '0.8rem 1.2rem' }}
                    >
                      Usuń ogłoszenie
                    </button>
                    <div onClick={(e) => e.stopPropagation()}>
                      <SmartShopifyPromoButton 
                        offer={{
                          id: offer.id,
                          price: offer.price || 0,
                          title: offer.title
                        }}
                        onPromotionStart={() => {
                          setPromotingOfferId(offer.id.toString())
                          console.log(`Rozpoczynam promocję ogłoszenia: ${offer.title}`)
                        }}
                      />
                    </div>
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
                <div key={offer.id} className={styles.offerCard}>
                  <div className={styles.offerContent} onClick={() => openOfferDetails(offer)}>
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
                  <div className={styles.offerActions} style={{ gridTemplateColumns: '1fr' }}>
                    <button 
                      onClick={(e) => { 
                        e.stopPropagation(); 
                        removeFavorite(offer.id) 
                      }} 
                      className={styles.deleteBtn}
                      style={{ width: '100%', fontSize: '0.9rem', padding: '0.8rem 1.2rem' }}
                    >
                      Usuń z ulubionych
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )
      case 'chat':
        return (
          <div className={styles.tabContent}>
            <div style={{
              display: 'flex',
              height: '650px',
              width: '90%',
              margin: '0 auto',
              borderRadius: '12px',
              overflow: 'hidden',
              background: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(10px)',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
              border: '1px solid rgba(255, 255, 255, 0.2)'
            }}>
              <div style={{
                width: '300px',
                borderRight: '1px solid rgba(0, 0, 0, 0.1)',
                background: 'rgba(255, 255, 255, 0.8)',
                overflowY: 'auto'
              }}>
                <ChatList 
                  onSelect={setSelectedChatId}
                  onChatDeleted={handleChatDeleted}
                />
              </div>
              <div style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                background: '#f8f9fa'
              }}>
                {selectedChatId ? (
                  <ChatWindow 
                    chatId={selectedChatId} 
                    offerId={selectedOfferId}
                    onChatDeleted={handleChatDeleted}
                  />
                ) : (
                  <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: '100%',
                    color: '#6c757d',
                    textAlign: 'center',
                    padding: '2rem'
                  }}>
                    <div style={{
                      fontSize: '4rem',
                      marginBottom: '1rem',
                      opacity: 0.5
                    }}>💬</div>
                    <h3 style={{ margin: '0 0 0.5rem 0', color: '#000000', fontSize: '1.5rem' }}>
                      Wybierz rozmowę
                    </h3>
                    <p style={{ margin: 0, fontSize: '1rem', color: '#333333' }}>
                      Kliknij na rozmowę z lewej strony, aby rozpocząć pisanie wiadomości
                    </p>
                  </div>
                )}
              </div>
            </div>
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

        {/* Modal szczegółów ogłoszenia */}
        <OfferModal
          offer={selectedOffer}
          isOpen={!!selectedOffer}
          onClose={closeOfferDetails}
        />

        {/* Modal płatności promocji */}
        <PromotionPaymentModal
          isOpen={showPromotionModal}
          onClose={() => {
            setShowPromotionModal(false)
            setOfferToPromote(null)
          }}
          offer={offerToPromote ? {
            id: offerToPromote.id,
            title: offerToPromote.title,
            price: offerToPromote.price
          } : { id: '', title: '', price: 0 }}
          onConfirm={promoteOffer}
        />
      </main>
    </div>
  )
}
