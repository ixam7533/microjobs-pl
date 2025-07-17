// pages/add.tsx

import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import Header from '../components/Header'
import AddOfferForm from '../components/AddOfferForm'
import styles from '../styles/AddAdvertisement.module.css'

type Theme = 'dark' | 'light' | 'night' | 'natura'

export default function AddAdvertisementPage() {
  const router = useRouter()
  const [currentTheme, setCurrentTheme] = useState<Theme>('natura')
  const [user, setUser] = useState<any>(null)
  const [isFirstOffer, setIsFirstOffer] = useState(false)

  // Monitorowanie motywu
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

  // Pobieranie danych użytkownika
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch('/api/auth/me')
        const data = await response.json()
        if (data.user) {
          setUser(data.user)
          // Sprawdź czy to pierwsze ogłoszenie
          const offersResponse = await fetch('/api/offers')
          const offersData = await offersResponse.json()
          const userOffers = offersData.filter((offer: any) => offer.ownerEmail === data.user.email)
          setIsFirstOffer(userOffers.length === 0)
        }
      } catch (error) {
        console.error('Błąd pobierania danych użytkownika:', error)
      }
    }
    fetchUserData()
  }, [])

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

  const handleSubmit = async (formData: any) => {
    try {
      // Jeśli to płatne ogłoszenie, najpierw przejdź do płatności
      if (formData.fees.total > 0) {
        // Tutaj będzie integracja z systemem płatności
        const paymentConfirmed = window.confirm(`Czy chcesz zapłacić ${formData.fees.total.toFixed(2)} zł za publikację ogłoszenia?`)
        if (!paymentConfirmed) return
      }

      // Przygotowanie danych do wysłania
      const submitData = new FormData()
      submitData.append('title', formData.title)
      submitData.append('description', formData.description)
      submitData.append('price', formData.price.toString())
      submitData.append('category', formData.category)
      submitData.append('subcategories', JSON.stringify(formData.subcategories))
      submitData.append('location', formData.location)
      submitData.append('contactName', formData.contactName)
      submitData.append('contactEmail', formData.contactEmail)
      submitData.append('contactPhone', formData.contactPhone)
      submitData.append('offerType', formData.offerType)
      submitData.append('wantPromo', formData.wantPromo.toString())
      
      // Dodanie zdjęć
      formData.images.forEach((image: File) => {
        submitData.append('images', image)
      })

      // Wysłanie powiadomienia email do administratora
      await fetch('/api/notifications/new-offer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: formData.title,
          category: formData.category,
          contactEmail: formData.contactEmail,
          price: formData.price
        })
      })

      // Publikacja ogłoszenia
      const response = await fetch('/api/auth/offers/add', {
        method: 'POST',
        body: submitData
      })

      if (response.ok) {
        alert('Ogłoszenie zostało dodane pomyślnie!')
        router.push('/')
      } else {
        const error = await response.json()
        console.error('Błąd odpowiedzi:', error)
        alert(`Błąd: ${error.error || error.message || 'Nieznany błąd'}`)
      }
    } catch (error) {
      console.error('Błąd podczas dodawania ogłoszenia:', error)
      alert('Wystąpił błąd podczas dodawania ogłoszenia')
    }
  }

  return (
    <div className={styles.pageWrapper}>
      <Header />
      
      {/* Tło wideo */}
      <div className={styles.bgContainer}>
        {getBackgroundContent()}
        <div className={styles.bgTint} />
      </div>

      {/* Zawartość strony */}
      <div className={styles.content}>
        <div className={styles.backWrapper}>
          <Link href="/" className={styles.backButton}>
            ← Powrót do strony głównej
          </Link>
        </div>

        <AddOfferForm 
          onSubmit={handleSubmit}
          isFirstOffer={isFirstOffer}
          userHasPro={user?.hasPro || false}
        />
      </div>
    </div>
  )
}
